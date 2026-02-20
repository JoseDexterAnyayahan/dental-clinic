interface Props {
  name: string
  email: string
}

export default function ProfileBanner({ name, email }: Props) {
  const initials = name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?'

  return (
    <div
      className="rounded-2xl p-6 flex items-center gap-5"
      style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.15)' }}
      >
        {initials}
      </div>
      <div>
        <p className="text-white font-bold text-base">{name}</p>
        <p className="text-white/70 text-xs mt-0.5">{email}</p>
        <span
          className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          Patient
        </span>
      </div>
    </div>
  )
}