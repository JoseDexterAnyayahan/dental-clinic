import { AppointmentStatus } from '@/types/appointment'

const CONFIG: Record<AppointmentStatus, { label: string; dot: string; bg: string; text: string }> = {
  pending:     { label: 'Pending',     dot: 'hsl(38,92%,45%)',  bg: 'hsl(38,92%,95%)',  text: 'hsl(38,92%,35%)'  },
  confirmed:   { label: 'Confirmed',   dot: 'hsl(142,72%,35%)', bg: 'hsl(142,72%,94%)', text: 'hsl(142,72%,28%)' },
  in_progress: { label: 'In Progress', dot: 'hsl(213,94%,44%)', bg: 'hsl(213,94%,94%)', text: 'hsl(213,94%,35%)' },
  completed:   { label: 'Completed',   dot: 'hsl(220,60%,35%)', bg: 'hsl(220,60%,94%)', text: 'hsl(220,60%,28%)' },
  cancelled:   { label: 'Cancelled',   dot: 'hsl(0,70%,50%)',   bg: 'hsl(0,70%,95%)',   text: 'hsl(0,70%,40%)'   },
  no_show:     { label: 'No Show',     dot: 'hsl(270,50%,50%)', bg: 'hsl(270,50%,95%)', text: 'hsl(270,50%,38%)' },
}

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const c = CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  )
}