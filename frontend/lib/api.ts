import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    const key = path.startsWith('/admin') ? 'admin_token' : 'client_token'
    const token = localStorage.getItem(key)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        stopSessionKeepAlive()
        const path = window.location.pathname
        if (path.startsWith('/admin')) {
          localStorage.removeItem('admin_token')
          window.location.href = '/admin/login'
        } else {
          localStorage.removeItem('client_token')
          window.location.href = '/client/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ── Session Keep-Alive ──────────────────────────────────────────────
// Token expires only after 1hr of true inactivity or browser close.
// Page loads, navigation, and any activity reset the timer.

let keepAliveTimeout: ReturnType<typeof setTimeout> | null = null
const INACTIVITY_LIMIT = 60 * 60 * 1000 // 1 hour

function scheduleRefresh() {
  if (keepAliveTimeout) clearTimeout(keepAliveTimeout)
  keepAliveTimeout = setTimeout(async () => {
    const path = window.location.pathname
    const key = path.startsWith('/admin') ? 'admin_token' : 'client_token'
    const token = localStorage.getItem(key)
    if (!token) return
    try {
      const endpoint = path.startsWith('/admin') ? '/admin/refresh' : '/client/refresh'
      const res = await api.post<{ token: string }>(endpoint)
      localStorage.setItem(key, res.data.token)
      scheduleRefresh()
    } catch {
      // 401 interceptor will handle redirect
    }
  }, INACTIVITY_LIMIT)
}

const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

export function startSessionKeepAlive() {
  if (typeof window === 'undefined') return

  // Refresh token immediately when tab becomes visible again
  const handleVisibility = async () => {
    if (document.visibilityState === 'visible') {
      const path = window.location.pathname
      const key = path.startsWith('/admin') ? 'admin_token' : 'client_token'
      const token = localStorage.getItem(key)
      if (!token) return
      try {
        const endpoint = path.startsWith('/admin') ? '/admin/refresh' : '/client/refresh'
        const res = await api.post<{ token: string }>(endpoint)
        localStorage.setItem(key, res.data.token)
        scheduleRefresh()
      } catch {
        // 401 interceptor will handle redirect
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibility)
  activityEvents.forEach((e) => window.addEventListener(e, scheduleRefresh))
  scheduleRefresh()
}

export function stopSessionKeepAlive() {
  if (keepAliveTimeout) clearTimeout(keepAliveTimeout)
  activityEvents.forEach((e) => window.removeEventListener(e, scheduleRefresh))
}

export default api