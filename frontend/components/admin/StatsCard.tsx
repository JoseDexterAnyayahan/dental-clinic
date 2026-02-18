import { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: string
  sub?: string
  trend?: { value: number; label: string }
}

export default function StatsCard({ label, value, icon: Icon, accent = 'hsl(213,94%,44%)', sub, trend }: Props) {
  return (
    <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'hsl(213,30%,91%)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18` }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-lg"
            style={{
              color:      trend.value >= 0 ? 'hsl(142,72%,30%)' : 'hsl(0,70%,45%)',
              background: trend.value >= 0 ? 'hsl(142,72%,94%)' : 'hsl(0,70%,95%)',
            }}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold leading-none mb-1" style={{ color: 'hsl(220,60%,15%)' }}>{value}</p>
      <p className="text-xs font-medium" style={{ color: 'hsl(220,15%,55%)' }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'hsl(220,15%,65%)' }}>{sub}</p>}
    </div>
  )
}