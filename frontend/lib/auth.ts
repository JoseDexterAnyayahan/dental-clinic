import api, { startSessionKeepAlive } from '@/lib/api'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'client'
  avatar: string | null
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

// ── Client Auth ───────────────────────────────────────────────

export async function clientLogin(data: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/client/login', data)
  persistToken('client_token', res.data.token)
  startSessionKeepAlive()
  return res.data
}

export async function clientRegister(data: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/client/register', data)
  persistToken('client_token', res.data.token)
  startSessionKeepAlive()
  return res.data
}

export async function clientLogout(): Promise<void> {
  try {
    await api.post('/client/logout')
  } finally {
    clearToken('client_token')
  }
}

export async function clientMe(): Promise<User> {
  const res = await api.get<User>('/client/me')
  return res.data
}

// ── Admin Auth ────────────────────────────────────────────────

export async function adminLogin(data: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/admin/login', data)
  persistToken('admin_token', res.data.token)
  startSessionKeepAlive()
  return res.data
}

export async function adminLogout(): Promise<void> {
  try {
    await api.post('/admin/logout')
  } finally {
    clearToken('admin_token')
  }
}

export async function adminMe(): Promise<User> {
  const res = await api.get<User>('/admin/me')
  return res.data
}

// ── Token helpers ─────────────────────────────────────────────

function persistToken(key: string, token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, token)
  }
}

export function clearToken(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}

export function getToken(key: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}