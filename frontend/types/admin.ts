export interface DashboardStats {
  total_appointments_today: number
  total_clients: number
  pending_appointments: number
  completed_today: number
  total_appointments: number
  total_dentists: number
  confirmed_appointments: number
}

export interface Dentist {
  id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  specialization: string | null
  bio: string | null
  avatar: string | null
  is_active: boolean
}

export interface Service {
  id: number
  name: string
  slug: string
  description: string | null
  duration_mins: number
  price: string
  icon: string | null
  is_active: boolean
}

export interface ClientProfile {
  id: number
  name: string
  email: string
  avatar: string | null
  is_active: boolean
  created_at: string
  client: {
    id: number
    phone: string | null
    birthdate: string | null
    gender: 'male' | 'female' | 'other' | null
    address: string | null
  } | null
}

export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}