'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, RefreshCw } from 'lucide-react'
import api from '@/lib/api'
import { Appointment, AppointmentStatus, PaginatedAppointments } from '@/types/appointment'
import ClientHeader from '@/components/client/ClientHeader'
import AppointmentRow from '@/components/client/appointments/AppointmentRow'
import FilterBar from '@/components/client/appointments/FilterBar'
import EmptyState from '@/components/client/appointments/EmptyState'

const SKELETON = Array.from({ length: 4 })

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter,       setFilter]       = useState<AppointmentStatus | 'all'>('all')
  const [page,         setPage]         = useState(1)
  const [lastPage,     setLastPage]     = useState(1)
  const [total,        setTotal]        = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)

  const fetchAppointments = useCallback(async (p = 1, showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const params: Record<string, string | number> = { page: p }
      if (filter !== 'all') params.status = filter

      const res = await api.get<PaginatedAppointments>('/client/appointments', { params })
      setAppointments(res.data.data)
      setLastPage(res.data.last_page)
      setTotal(res.data.total)
      setPage(p)
    } catch {
      // guarded by layout
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter])

  useEffect(() => {
    fetchAppointments(1)
  }, [fetchAppointments])

  const filtered = filter !== 'all'

  return (
    <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      <ClientHeader
        title="My Appointments"
        subtitle={`You have ${total} appointment${total !== 1 ? 's' : ''} total.`}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <FilterBar active={filter} onChange={(s) => setFilter(s)} />

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => fetchAppointments(page, true)}
            disabled={refreshing}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
            style={{ background: 'hsl(213,30%,95%)' }}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              style={{ color: 'hsl(220,30%,45%)' }}
            />
          </button>
          <Link
            href="/client/portal/appointments/book"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
                       transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Book new</span>
          </Link>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {SKELETON.map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl border animate-pulse"
              style={{ background: 'hsl(213,30%,96%)', borderColor: 'hsl(213,30%,91%)' }}
            />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState filtered={filtered} />
      ) : (
        <>
          <div className="space-y-3">
            {appointments.map((appt) => (
              <AppointmentRow key={appt.id} appt={appt} />
            ))}
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => fetchAppointments(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }}
              >
                Previous
              </button>

              {Array.from({ length: lastPage }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`d-${i}`} className="px-2 text-sm" style={{ color: 'hsl(220,15%,60%)' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => fetchAppointments(p as number)}
                      className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
                      style={
                        page === p
                          ? {
                              background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)',
                              color: 'white',
                            }
                          : { background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }
                      }
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => fetchAppointments(page + 1)}
                disabled={page === lastPage}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}