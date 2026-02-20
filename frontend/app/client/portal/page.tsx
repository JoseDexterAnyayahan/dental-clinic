'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, ClipboardList, CheckCircle2, Clock4, Plus, ArrowRight } from 'lucide-react'
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
  const [user, setUser]                 = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats]               = useState<DashboardStats>({ total: 0, upcoming: 0, completed: 0, pending: 0 })
  const [loading, setLoading]           = useState(true)

 useEffect(() => {
    const load = async () => {
      try {
        const [me, apptRes] = await Promise.all([
          clientMe(),
          api.get('/client/appointments', { params: { per_page: 1000 } }),
        ])
        setUser(me)

        const appts: Appointment[] = apptRes.data.data ?? apptRes.data ?? []
        setAppointments(appts)

        const now = new Date()
        now.setHours(0, 0, 0, 0) // compare by date only, not time

        setStats({
          total:     appts.length,
          upcoming:  appts.filter((a) => {
            const d = new Date(a.appointment_date)
            d.setHours(0, 0, 0, 0)
            return d >= now && a.status !== 'cancelled' && a.status !== 'completed'
          }).length,
          completed: appts.filter((a) => a.status === 'completed').length,
          pending:   appts.filter((a) => a.status === 'pending').length,
        })
      } catch {
        // handle silently
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Only show 1 next upcoming
  const nextUpcoming = appointments
    .filter((a) => new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
    .slice(0, 1)

  // Only show 1 most recent
  const lastRecent = appointments
    .filter((a) => a.status === 'completed' || a.status === 'cancelled')
    .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
    .slice(0, 1)

  const upcomingCount = appointments.filter(
    (a) => new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled'
  ).length

  const recentCount = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  ).length

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

      {/* Stats */}
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

      {/* Book CTA */}
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sm font-semibold flex-shrink-0 transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ color: 'hsl(220,60%,15%)' }}
        >
          <Plus className="w-4 h-4" />
          Book appointment
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Next Upcoming — show only 1 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Upcoming</h2>
              {!loading && upcomingCount > 0 && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                  style={{ background: 'hsl(213,94%,93%)', color: 'hsl(213,94%,44%)' }}
                >
                  {upcomingCount} total
                </span>
              )}
            </div>
            <Link
              href="/client/portal/appointments?filter=upcoming"
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: 'hsl(213,94%,44%)' }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border h-32 animate-pulse" style={{ borderColor: 'hsl(213,30%,91%)' }} />
          ) : nextUpcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: 'hsl(213,30%,91%)' }}>
              <CalendarDays className="w-8 h-8 mx-auto mb-2" style={{ color: 'hsl(213,30%,75%)' }} />
              <p className="text-sm font-medium" style={{ color: 'hsl(220,15%,50%)' }}>No upcoming appointments</p>
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
              <AppointmentCard appointment={nextUpcoming[0]} compact />
              {upcomingCount > 1 && (
                <Link
                  href="/client/portal/appointments?filter=upcoming"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.01]"
                  style={{ borderColor: 'hsl(213,30%,88%)', color: 'hsl(213,94%,44%)', background: 'hsl(213,94%,97%)' }}
                >
                  +{upcomingCount - 1} more upcoming <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Last Recent — show only 1 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Recent history</h2>
              {!loading && recentCount > 0 && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                  style={{ background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,35%)' }}
                >
                  {recentCount} total
                </span>
              )}
            </div>
            <Link
              href="/client/portal/appointments?filter=history"
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: 'hsl(213,94%,44%)' }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border h-32 animate-pulse" style={{ borderColor: 'hsl(213,30%,91%)' }} />
          ) : lastRecent.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: 'hsl(213,30%,91%)' }}>
              <ClipboardList className="w-8 h-8 mx-auto mb-2" style={{ color: 'hsl(213,30%,75%)' }} />
              <p className="text-sm font-medium" style={{ color: 'hsl(220,15%,50%)' }}>No past appointments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AppointmentCard appointment={lastRecent[0]} compact />
              {recentCount > 1 && (
                <Link
                  href="/client/portal/appointments?filter=history"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.01]"
                  style={{ borderColor: 'hsl(213,30%,88%)', color: 'hsl(142,72%,35%)', background: 'hsl(142,72%,97%)' }}
                >
                  +{recentCount - 1} more in history <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}