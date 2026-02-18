'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, Users, Clock4, CheckCircle2, UserCog, TrendingUp } from 'lucide-react'
import api from '@/lib/api'
import AdminHeader from '@/components/admin/AdminHeader'
import StatsCard   from '@/components/admin/StatsCard'
import AppointmentStatusBadge from '@/components/admin/appointments/AppointmentStatusBadge'
import { Appointment } from '@/types/appointment'
import { DashboardStats } from '@/types/admin'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState<DashboardStats | null>(null)
  const [recent,  setRecent]  = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, apptRes] = await Promise.all([
          api.get<DashboardStats>('/admin/dashboard'),
          api.get<{ data: Appointment[] }>('/admin/appointments', { params: { per_page: 5 } }),
        ])
        setStats(statsRes.data)
        setRecent(apptRes.data.data ?? [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = stats ? [
    { label: "Today's Appointments", value: stats.total_appointments_today, icon: CalendarDays, accent: 'hsl(213,94%,44%)' },
    { label: 'Total Clients',        value: stats.total_clients,            icon: Users,        accent: 'hsl(142,72%,35%)' },
    { label: 'Pending',              value: stats.pending_appointments,     icon: Clock4,       accent: 'hsl(38,92%,45%)'  },
    { label: 'Completed Today',      value: stats.completed_today,          icon: CheckCircle2, accent: 'hsl(220,60%,35%)' },
    { label: 'Total Dentists',       value: stats.total_dentists ?? '–',    icon: UserCog,      accent: 'hsl(270,50%,50%)' },
    { label: 'Total Appointments',   value: stats.total_appointments ?? '–',icon: TrendingUp,   accent: 'hsl(0,70%,52%)'   },
  ] : []

  return (
    <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      <AdminHeader title="Dashboard" subtitle="Welcome back. Here's today's overview." />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border h-24 animate-pulse"
                style={{ borderColor: 'hsl(213,30%,91%)' }} />
            ))
          : statCards.map((s) => <StatsCard key={s.label} {...s} />)
        }
      </div>

      {/* Recent appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Recent Appointments</h2>
          <Link href="/admin/dashboard/appointments"
            className="text-xs font-medium hover:underline" style={{ color: 'hsl(213,94%,44%)' }}>
            View all
          </Link>
        </div>
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'hsl(213,30%,96%)' }} />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: 'hsl(220,15%,55%)' }}>
              No appointments yet.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'hsl(213,30%,91%)' }}>
              {recent.map((a) => (
                <Link key={a.id} href={`/admin/dashboard/appointments/${a.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'hsl(220,60%,15%)' }}>
                      {(a as any).client?.user?.name ?? 'Client'}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'hsl(220,15%,55%)' }}>
                      {(a as any).service?.name} · Dr. {(a as any).dentist?.first_name} {(a as any).dentist?.last_name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <AppointmentStatusBadge status={a.status} />
                    <p className="text-xs mt-1" style={{ color: 'hsl(220,15%,60%)' }}>
                      {new Date(a.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}