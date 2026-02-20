'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ClientSidebar from '@/components/client/ClientSidebar'
import { getToken, clientMe } from '@/lib/auth'

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

useEffect(() => {
    const token = getToken('client_token')
    if (!token) {
      router.replace('/client/login')
      return
    }
    clientMe()
      .then(() => setChecking(false))
      .catch(() => {
        router.replace('/client/login')
      })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(213,30%,97%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
          >
            <span className="text-white font-serif text-lg font-bold">D</span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  background: 'hsl(213,94%,44%)',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(213,30%,97%)' }}>
      <ClientSidebar />
      <div className="flex-1 flex flex-col pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  )
}