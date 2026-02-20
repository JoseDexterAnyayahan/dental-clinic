import { Clock, Pencil, Trash2 } from 'lucide-react'
import { Service } from '@/types/admin'

const ICON_MAP: Record<string, string> = {
  stethoscope: '🩺', tooth: '🦷', sparkles: '✨', sun: '☀️',
  shield: '🛡️', activity: '⚡', 'align-center': '📐',
}

interface Props {
  service: Service
  onEdit: () => void
  onDelete: () => void
}

export default function ServiceCard({ service, onEdit, onDelete }: Props) {
  return (
    <div
      className="bg-white rounded-2xl border p-5 hover:shadow-md transition-all flex flex-col"
      style={{ borderColor: 'hsl(213,30%,91%)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'hsl(213,60%,95%)' }}
        >
          {ICON_MAP[service.icon ?? ''] ?? '🦷'}
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={service.is_active
            ? { background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,28%)' }
            : { background: 'hsl(0,70%,95%)',   color: 'hsl(0,70%,40%)'   }
          }
        >
          {service.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Name + description */}
      <p className="text-sm font-bold mb-1" style={{ color: 'hsl(220,60%,15%)' }}>{service.name}</p>
      {service.description && (
        <p className="text-xs line-clamp-2 mb-4 flex-1" style={{ color: 'hsl(220,15%,60%)' }}>
          {service.description}
        </p>
      )}

      {/* Meta row */}
      <div
        className="flex items-center gap-3 pt-3 mt-auto border-t"
        style={{ borderColor: 'hsl(213,30%,93%)' }}
      >
        <div className="flex items-center gap-1.5 flex-1">
          <Clock className="w-3.5 h-3.5" style={{ color: 'hsl(220,15%,60%)' }} />
          <span className="text-xs font-medium" style={{ color: 'hsl(220,20%,45%)' }}>
            {service.duration_mins} min
          </span>
        </div>
        <p className="text-base font-bold" style={{ color: 'hsl(213,94%,44%)' }}>
          ₱{parseFloat(String(service.price)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-sky-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" style={{ color: 'hsl(213,94%,44%)' }} />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" style={{ color: 'hsl(0,70%,52%)' }} />
          </button>
        </div>
      </div>
    </div>
  )
}