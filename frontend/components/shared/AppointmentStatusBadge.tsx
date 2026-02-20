import { AppointmentStatus } from '@/types/appointment.types'

const statusConfig: Record<AppointmentStatus, { label: string; bg: string; text: string }> = {
  pending:     { label: 'Pending',     bg: 'hsl(45,100%,95%)',  text: 'hsl(45,100%,35%)' },
  confirmed:   { label: 'Confirmed',   bg: 'hsl(213,60%,95%)',  text: 'hsl(213,94%,44%)' },
  in_progress: { label: 'In Progress', bg: 'hsl(199,60%,95%)',  text: 'hsl(199,89%,40%)' },
  completed:   { label: 'Completed',   bg: 'hsl(142,72%,94%)',  text: 'hsl(142,72%,28%)' },
  cancelled:   { label: 'Cancelled',   bg: 'hsl(0,70%,95%)',    text: 'hsl(0,70%,40%)'   },
  no_show:     { label: 'No Show',     bg: 'hsl(0,0%,92%)',     text: 'hsl(0,0%,40%)'    },
}

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
  size?: 'sm' | 'md'
}

export default function AppointmentStatusBadge({ status, size = 'md' }: AppointmentStatusBadgeProps) {
  const config = statusConfig[status]
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'

  return (
    <span
      className={`inline-flex items-center ${padding} rounded-lg font-medium ${textSize}`}
      style={{ background: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  )
}