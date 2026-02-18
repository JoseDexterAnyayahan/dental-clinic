'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, ClipboardList, CheckCircle2, Clock4, Plus } from 'lucide-react'
import api from '@/lib/api'
import { clientMe, User } from '@/lib/auth'
import ClientHeader from '@/components/client/ClientHeader'
import AppointmentCard, { Appointment } from '@/components/client/AppointmentCard'
import StatsCard from '@/components/client/StatsCard'

interface DashboardStats {
  total: number
  upcoming: number
  completed: number
  pending: number
}

export default function ClientDashboardPage() {
  const [user, setUser]               = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats]             = useState<DashboardStats>({ total: 0, upcoming: 0, completed: 0, pending: 0 })
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [me, apptRes] = await Promise.all([
          clientMe(),
          api.get<{ data: Appointment[] }>('/client/appointments'),
        ])
        setUser(me)

        const appts = apptRes.data.data ?? apptRes.data as unknown as Appointment[]
        setAppointments(appts)

        const now = new Date()
        setStats({
          total:     appts.length,
          upcoming:  appts.filter((a) => new Date(a.appointment_date) >= now && a.status !== 'cancelled').length,
          completed: appts.filter((a) => a.status === 'completed').length,
          pending:   appts.filter((a) => a.status === 'pending').length,
        })
      } catch {
        // handle silently; guarded by layout auth
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const upcoming = appointments
    .filter((a) => new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
    .slice(0, 3)

  const recent = appointments
    .filter((a) => a.status === 'completed' || a.status === 'cancelled')
    .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
    .slice(0, 3)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
   <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      <ClientHeader
        title={`${greeting()}, ${user?.name?.split(' ')[0] ?? '…'} 👋`}
        subtitle="Here's what's happening with your appointments."
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border h-24 animate-pulse"
              style={{ borderColor: 'hsl(213,30%,91%)' }} />
          ))
        ) : (
          <>
            <StatsCard label="Total"     value={stats.total}     icon={ClipboardList} accent="hsl(220,60%,35%)" />
            <StatsCard label="Upcoming"  value={stats.upcoming}  icon={CalendarDays}  accent="hsl(213,94%,44%)" />
            <StatsCard label="Completed" value={stats.completed} icon={CheckCircle2}  accent="hsl(142,72%,35%)" />
            <StatsCard label="Pending"   value={stats.pending}   icon={Clock4}        accent="hsl(38,92%,45%)"  />
          </>
        )}
      </div>

      {/* Book CTA banner */}
      <div
        className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
      >
        <div>
          <p className="text-white font-semibold text-base">Ready for your next visit?</p>
          <p className="text-white/70 text-sm mt-0.5">Book an appointment with one of our dentists.</p>
        </div>
        <Link
          href="/client/portal/appointments/book"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sm font-semibold flex-shrink-0
                     transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ color: 'hsl(220,60%,15%)' }}
        >
          <Plus className="w-4 h-4" />
          Book appointment
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: 'hsl(220,60%,15%)' }}>
              Upcoming
            </h2>
            <Link
              href="/client/portal/appointments"
              className="text-xs font-medium hover:underline"
              style={{ color: 'hsl(213,94%,44%)' }}
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border h-32 animate-pulse"
                  style={{ borderColor: 'hsl(213,30%,91%)' }} />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <div
              className="bg-white rounded-2xl border p-8 text-center"
              style={{ borderColor: 'hsl(213,30%,91%)' }}
            >
              <CalendarDays className="w-8 h-8 mx-auto mb-2" style={{ color: 'hsl(213,30%,75%)' }} />
              <p className="text-sm font-medium" style={{ color: 'hsl(220,15%,50%)' }}>
                No upcoming appointments
              </p>
              <Link
                href="/client/portal/appointments/book"
                className="inline-block mt-3 text-xs font-semibold hover:underline"
                style={{ color: 'hsl(213,94%,44%)' }}
              >
                Book one now →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((a) => (
                <AppointmentCard key={a.id} appointment={a} compact />
              ))}
            </div>
          )}
        </section>

        {/* Recent history */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: 'hsl(220,60%,15%)' }}>
              Recent history
            </h2>
            <Link
              href="/client/portal/appointments"
              className="text-xs font-medium hover:underline"
              style={{ color: 'hsl(213,94%,44%)' }}
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border h-32 animate-pulse"
                  style={{ borderColor: 'hsl(213,30%,91%)' }} />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div
              className="bg-white rounded-2xl border p-8 text-center"
              style={{ borderColor: 'hsl(213,30%,91%)' }}
            >
              <ClipboardList className="w-8 h-8 mx-auto mb-2" style={{ color: 'hsl(213,30%,75%)' }} />
              <p className="text-sm font-medium" style={{ color: 'hsl(220,15%,50%)' }}>
                No past appointments yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((a) => (
                <AppointmentCard key={a.id} appointment={a} compact />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}