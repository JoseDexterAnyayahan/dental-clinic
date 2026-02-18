import { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: string
  sub?: string
}

export default function StatsCard({ label, value, icon: Icon, accent = 'hsl(213,94%,44%)', sub }: Props) {
  return (
    <div
      className="bg-white rounded-2xl border p-5 flex items-start gap-4"
      style={{ borderColor: 'hsl(213,30%,91%)' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium mb-0.5" style={{ color: 'hsl(220,15%,55%)' }}>
          {label}
        </p>
        <p className="text-2xl font-bold leading-none" style={{ color: 'hsl(220,60%,15%)' }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: 'hsl(220,15%,60%)' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}