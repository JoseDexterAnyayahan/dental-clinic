import Link from 'next/link'
import { Calendar, Clock, User, Stethoscope, ChevronRight } from 'lucide-react'

export interface Appointment {
  id: number
  appointment_no: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  dentist: { first_name: string; last_name: string; specialization: string }
  service: { name: string; price: string }
  notes?: string
}

const STATUS_CONFIG: Record<
  Appointment['status'],
  { label: string; color: string; bg: string }
> = {
  pending:     { label: 'Pending',     color: 'hsl(38,92%,40%)',   bg: 'hsl(38,92%,96%)'  },
  confirmed:   { label: 'Confirmed',   color: 'hsl(142,72%,29%)',  bg: 'hsl(142,72%,96%)' },
  in_progress: { label: 'In Progress', color: 'hsl(213,94%,44%)',  bg: 'hsl(213,94%,95%)' },
  completed:   { label: 'Completed',   color: 'hsl(220,60%,35%)',  bg: 'hsl(220,60%,95%)' },
  cancelled:   { label: 'Cancelled',   color: 'hsl(0,70%,45%)',    bg: 'hsl(0,70%,96%)'   },
  no_show:     { label: 'No Show',     color: 'hsl(270,50%,45%)',  bg: 'hsl(270,50%,96%)' },
}

export function StatusBadge({ status }: { status: Appointment['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
        style={{ background: cfg.color }}
      />
      {cfg.label}
    </span>
  )
}

interface Props {
  appointment: Appointment
  compact?: boolean
}

export default function AppointmentCard({ appointment, compact = false }: Props) {
  const date = new Date(appointment.appointment_date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
  const time = `${appointment.start_time.slice(0, 5)} – ${appointment.end_time.slice(0, 5)}`

  return (
    <Link
      href={`/client/portal/appointments/${appointment.id}`}
      className="block bg-white rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 group"
      style={{ borderColor: 'hsl(213,30%,91%)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Appointment no + status */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-mono font-medium" style={{ color: 'hsl(213,94%,44%)' }}>
              {appointment.appointment_no}
            </span>
            <StatusBadge status={appointment.status} />
          </div>

          {/* Service */}
          <p className="font-semibold text-sm mb-3 truncate" style={{ color: 'hsl(220,60%,15%)' }}>
            {appointment.service.name}
          </p>

          {/* Meta */}
          <div className={`grid gap-2 text-xs ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="flex items-center gap-1.5" style={{ color: 'hsl(220,15%,50%)' }}>
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{date}</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: 'hsl(220,15%,50%)' }}>
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-full" style={{ color: 'hsl(220,15%,50%)' }}>
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                Dr. {appointment.dentist.first_name} {appointment.dentist.last_name}
                {appointment.dentist.specialization && ` · ${appointment.dentist.specialization}`}
              </span>
            </div>
          </div>
        </div>

        <ChevronRight
          className="w-4 h-4 mt-1 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: 'hsl(213,30%,70%)' }}
        />
      </div>
    </Link>
  )
}