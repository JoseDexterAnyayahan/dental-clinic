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
}

export interface PaginatedAppointments {
  data: Appointment[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}