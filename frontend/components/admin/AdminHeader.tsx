'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { adminMe, User } from '@/lib/auth'

export default function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => { adminMe().then(setUser).catch(() => {}) }, [])

  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?'

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'hsl(220,60%,15%)' }}>{title}</h1>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: 'hsl(220,15%,55%)' }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'hsl(213,30%,96%)' }}
        >
          <Bell className="w-4 h-4" style={{ color: 'hsl(220,30%,40%)' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'hsl(0,70%,52%)' }} />
        </button>
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none" style={{ color: 'hsl(220,60%,15%)' }}>{user?.name ?? '…'}</p>
            <p className="text-xs mt-0.5" style={{ color: 'hsl(220,15%,55%)' }}>Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}