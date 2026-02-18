'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { getToken, adminMe } from '@/lib/auth'
import { Stethoscope } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Skip auth check on the login page
    if (isLoginPage) {
      setChecking(false)
      return
    }

    const token = getToken()
    if (!token) {
      router.replace('/admin/login')
      return
    }

    adminMe()
      .then(() => setChecking(false))
      .catch(() => router.replace('/admin/login'))
  }, [router, isLoginPage])

  if (checking && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(213,30%,97%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}>
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div className="flex gap-1">
            {[0,1,2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ background: 'hsl(213,94%,44%)', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Login page — no sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // Authenticated pages — with sidebar
  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'hsl(213,30%,97%)' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  )
}