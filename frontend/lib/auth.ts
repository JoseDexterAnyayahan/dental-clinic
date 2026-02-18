import api from '@/lib/api'

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
  persistToken(res.data.token)
  return res.data
}

export async function clientRegister(data: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/client/register', data)
  persistToken(res.data.token)
  return res.data
}

export async function clientLogout(): Promise<void> {
  try {
    await api.post('/client/logout')   // auth:sanctum + client middleware
  } finally {
    clearToken()
  }
}

export async function clientMe(): Promise<User> {
  const res = await api.get<User>('/client/me')
  return res.data
}

// ── Admin Auth ────────────────────────────────────────────────

export async function adminLogin(data: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/admin/login', data)
  persistToken(res.data.token)
  return res.data
}

export async function adminLogout(): Promise<void> {
  try {
    await api.post('/admin/logout')    // auth:sanctum + admin middleware
  } finally {
    clearToken()
  }
}

export async function adminMe(): Promise<User> {
  const res = await api.get<User>('/admin/me')
  return res.data
}

// ── Token helpers ─────────────────────────────────────────────

function persistToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}