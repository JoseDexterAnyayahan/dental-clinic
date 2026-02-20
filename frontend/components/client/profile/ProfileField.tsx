import { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  icon?: LucideIcon
  error?: string
}

export default function ProfileField({
  label, value, onChange, placeholder, type = 'text', icon: Icon, error,
}: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'hsl(220,15%,60%)' }} />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
          style={{
            paddingLeft: Icon ? '2rem' : '0.75rem',
            paddingRight: '0.75rem',
            borderColor: error ? 'hsl(0,70%,60%)' : 'hsl(213,30%,88%)',
            background: 'hsl(213,30%,97%)',
            color: 'hsl(220,30%,30%)',
          }}
        />
      </div>
      {error && <p className="text-xs mt-1" style={{ color: 'hsl(0,70%,50%)' }}>{error}</p>}
    </div>
  )
}