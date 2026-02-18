import Link from 'next/link'
import { Calendar, Clock, User, ChevronRight } from 'lucide-react'
import { Appointment } from '@/types/appointment'
import StatusBadge from './StatusBadge'

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
function fmtTime(t: string) { return t.slice(0, 5) }

export default function AppointmentRow({ appt }: { appt: Appointment }) {
  return (
    <Link
      href={`/client/portal/appointments/${appt.id}`}
      className="flex items-center gap-4 px-5 py-4 bg-white border rounded-2xl
                 hover:shadow-md hover:-translate-y-0.5 transition-all group"
      style={{ borderColor: 'hsl(213,30%,91%)' }}
    >
      {/* Date block */}
      <div
        className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
        style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
      >
        <span className="text-xs font-medium leading-none opacity-80">
          {new Date(appt.appointment_date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-lg font-bold leading-tight">
          {new Date(appt.appointment_date).getDate()}
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold truncate" style={{ color: 'hsl(220,60%,15%)' }}>
            {appt.service.name}
          </span>
          <StatusBadge status={appt.status} />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs" style={{ color: 'hsl(220,15%,55%)' }}>
            <User className="w-3 h-3" />
            Dr. {appt.dentist.first_name} {appt.dentist.last_name}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'hsl(220,15%,55%)' }}>
            <Clock className="w-3 h-3" />
            {fmtTime(appt.start_time)} – {fmtTime(appt.end_time)}
          </span>
        </div>
      </div>

      {/* Appt no + arrow */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs font-mono" style={{ color: 'hsl(213,94%,44%)' }}>
          {appt.appointment_no}
        </span>
        <ChevronRight
          className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
          style={{ color: 'hsl(213,30%,70%)' }}
        />
      </div>
    </Link>
  )
}