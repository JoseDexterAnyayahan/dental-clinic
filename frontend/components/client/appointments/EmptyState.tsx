import Link from 'next/link'
import { CalendarDays } from 'lucide-react'

export default function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border"
      style={{ borderColor: 'hsl(213,30%,91%)' }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'hsl(213,30%,95%)' }}
      >
        <CalendarDays className="w-6 h-6" style={{ color: 'hsl(213,30%,65%)' }} />
      </div>
      <p className="text-sm font-semibold mb-1" style={{ color: 'hsl(220,60%,20%)' }}>
        {filtered ? 'No appointments found' : 'No appointments yet'}
      </p>
      <p className="text-xs mb-5" style={{ color: 'hsl(220,15%,55%)' }}>
        {filtered ? 'Try a different filter.' : 'Book your first visit with us.'}
      </p>
      {!filtered && (
        <Link
          href="/client/portal/appointments/book"
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
        >
          Book appointment
        </Link>
      )}
    </div>
  )
}