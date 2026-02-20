import { Appointment } from '@/types/appointment.types'
import AppointmentStatusBadge from '@/components/shared/AppointmentStatusBadge'
import { Calendar, Clock, Edit2, XCircle } from 'lucide-react'

interface AppointmentRowProps {
  appt: Appointment
  onEdit?: () => void
  onCancel?: () => void
}

export default function AppointmentRow({ appt, onEdit, onCancel }: AppointmentRowProps) {
  const canEdit = ['pending', 'confirmed'].includes(appt.status) &&
                  appt.appointment_date > new Date().toISOString().split('T')[0]

  const canCancel = ['pending', 'confirmed'].includes(appt.status)

  return (
    <div className="bg-white rounded-2xl border p-5 hover:shadow-md transition-all"
      style={{ borderColor: 'hsl(213,30%,91%)' }}>
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="font-semibold text-base mb-1" style={{ color: 'hsl(220,60%,15%)' }}>
            {appt.service.name}
          </p>
          <p className="text-sm mb-2" style={{ color: 'hsl(220,15%,50%)' }}>
            Dr. {appt.dentist.first_name} {appt.dentist.last_name}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5" style={{ color: 'hsl(220,15%,50%)' }}>
              <Calendar className="w-4 h-4" />
              {new Date(appt.appointment_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: 'hsl(220,15%,50%)' }}>
              <Clock className="w-4 h-4" />
              {appt.start_time} - {appt.end_time}
            </span>
          </div>
        </div>

        <AppointmentStatusBadge status={appt.status} size="sm" />
      </div>

      {/* Action Buttons */}
      {(canEdit || canCancel) && (
        <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          {canEdit && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'hsl(213,60%,95%)', color: 'hsl(213,94%,44%)' }}
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'hsl(0,70%,95%)', color: 'hsl(0,70%,50%)' }}
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      )}

      {appt.notes && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'hsl(220,30%,45%)' }}>Notes:</p>
          <p className="text-sm" style={{ color: 'hsl(220,15%,50%)' }}>{appt.notes}</p>
        </div>
      )}
    </div>
  )
}