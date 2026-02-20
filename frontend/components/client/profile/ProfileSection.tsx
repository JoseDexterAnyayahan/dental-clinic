export default function ProfileSection({
  title, subtitle, children,
}: {
  title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'hsl(213,30%,91%)' }}>
      <div className="mb-5">
        <h2 className="text-sm font-bold" style={{ color: 'hsl(220,60%,15%)' }}>{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'hsl(220,15%,55%)' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}