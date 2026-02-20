export type AppointmentStatus =
  | 'pending' | 'confirmed' | 'in_progress'
  | 'completed' | 'cancelled' | 'no_show'

export interface AppointmentDentist {
  id: number
  first_name: string
  last_name: string
  specialization: string
  avatar: string | null
}

export interface AppointmentService {
  id: number
  name: string
  duration_mins: number
  price: string
}

export interface Appointment {
  id: number
  appointment_no: string
  client_id: number          // ← Add this
  dentist_id: number         // ← Add this
  service_id: number         // ← Add this
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  notes: string | null
  admin_notes: string | null
  cancelled_by: 'client' | 'admin' | null
  cancel_reason: string | null
  dentist: AppointmentDentist
  service: AppointmentService
  created_at?: string
  updated_at?: string
}
export interface PaginatedAppointments {
  data: Appointment[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// ↓↓↓ ADD THESE BELOW ↓↓↓

export interface Service {
  id: number
  name: string
  slug: string
  description: string
  duration_mins: number
  price: string
  icon: string | null
  is_active: boolean
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

export interface TimeSlot {
  start_time: string
  end_time: string
  available: boolean
}