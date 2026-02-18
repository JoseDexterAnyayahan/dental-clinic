'use client'

import { AppointmentStatus } from '@/types/appointment'

const STATUSES: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'All'         },
  { value: 'pending',     label: 'Pending'     },
  { value: 'confirmed',   label: 'Confirmed'   },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed'   },
  { value: 'cancelled',   label: 'Cancelled'   },
]

interface Props {
  active: AppointmentStatus | 'all'
  onChange: (s: AppointmentStatus | 'all') => void
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {STATUSES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className="px-4 py-1.5 rounded-xl text-sm font-medium flex-shrink-0 transition-all"
          style={
            active === value
              ? {
                  background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(59,130,246,0.25)',
                }
              : {
                  background: 'hsl(213,30%,96%)',
                  color: 'hsl(220,20%,45%)',
                }
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}