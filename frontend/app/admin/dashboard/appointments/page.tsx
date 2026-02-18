'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { RefreshCw, Search } from 'lucide-react'
import api from '@/lib/api'
import { Appointment, AppointmentStatus } from '@/types/appointment'
import { Paginated } from '@/types/admin'
import AdminHeader from '@/components/admin/AdminHeader'
import AppointmentStatusBadge from '@/components/admin/appointments/AppointmentStatusBadge'
import StatusUpdateModal from '@/components/admin/appointments/StatusUpdateModal'

const STATUSES: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'All'         },
  { value: 'pending',     label: 'Pending'     },
  { value: 'confirmed',   label: 'Confirmed'   },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed'   },
  { value: 'cancelled',   label: 'Cancelled'   },
  { value: 'no_show',     label: 'No Show'     },
]

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter,  setFilter]  = useState<AppointmentStatus | 'all'>('all')
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)
  const [lastPage,setLastPage]= useState(1)
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing,setRefreshing] = useState(false)
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null)

  const fetchAppointments = useCallback(async (p = 1, refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true)
    try {
      const params: Record<string, string | number> = { page: p }
      if (filter !== 'all') params.status = filter
      const res = await api.get<Paginated<Appointment>>('/admin/appointments', { params })
      setAppointments(res.data.data)
      setLastPage(res.data.last_page)
      setTotal(res.data.total)
      setPage(p)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter])

  useEffect(() => { fetchAppointments(1) }, [fetchAppointments])

  const displayed = search
    ? appointments.filter((a) => {
        const q = search.toLowerCase()
        return (
          a.appointment_no.toLowerCase().includes(q) ||
          (a as any).client?.user?.name?.toLowerCase().includes(q) ||
          (a as any).service?.name?.toLowerCase().includes(q)
        )
      })
    : appointments

  const handleStatusUpdated = (apptId: number, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status } : a))
    )
  }

  return (
    <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      <AdminHeader title="Appointments" subtitle={`${total} total appointments`} />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Status filters */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 flex-1">
          {STATUSES.map(({ value, label }) => (
            <button key={value} onClick={() => setFilter(value)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium flex-shrink-0 transition-all"
              style={filter === value
                ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white', boxShadow: '0 2px 8px rgba(59,130,246,0.25)' }
                : { background: 'hsl(213,30%,96%)', color: 'hsl(220,20%,45%)' }
              }>
              {label}
            </button>
          ))}
        </div>

        {/* Search + refresh */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'hsl(220,15%,60%)' }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', width: '160px', color: 'hsl(220,30%,30%)' }}
            />
          </div>
          <button onClick={() => fetchAppointments(page, true)} disabled={refreshing}
            className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-50"
            style={{ background: 'hsl(213,30%,95%)' }}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: 'hsl(220,30%,45%)' }} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'hsl(213,30%,96%)' }} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center text-sm" style={{ color: 'hsl(220,15%,55%)' }}>
            No appointments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(213,30%,91%)', background: 'hsl(213,30%,98%)' }}>
                  {['Ref #','Patient','Service','Dentist','Date & Time','Status','Action'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                      style={{ color: 'hsl(220,15%,55%)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'hsl(213,30%,93%)' }}>
                {displayed.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono" style={{ color: 'hsl(213,94%,44%)' }}>
                        {a.appointment_no}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium" style={{ color: 'hsl(220,60%,15%)' }}>
                        {(a as any).client?.user?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: 'hsl(220,20%,45%)' }}>
                      {(a as any).service?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: 'hsl(220,20%,45%)' }}>
                      Dr. {(a as any).dentist?.first_name} {(a as any).dentist?.last_name}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium" style={{ color: 'hsl(220,30%,30%)' }}>
                        {new Date(a.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs" style={{ color: 'hsl(220,15%,60%)' }}>
                        {a.start_time.slice(0,5)} – {a.end_time.slice(0,5)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <AppointmentStatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setModalAppt(a)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50"
                        style={{ borderColor: 'hsl(213,30%,88%)', color: 'hsl(220,20%,45%)' }}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => fetchAppointments(page - 1)} disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
            style={{ background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }}>
            Previous
          </button>
          {Array.from({ length: lastPage }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
            .reduce<(number | '...')[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i-1] as number) > 1) acc.push('...')
              acc.push(p); return acc
            }, [])
            .map((p, i) => p === '...'
              ? <span key={`d${i}`} className="px-2 text-sm" style={{ color: 'hsl(220,15%,60%)' }}>…</span>
              : <button key={p} onClick={() => fetchAppointments(p as number)}
                  className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
                  style={page === p
                    ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white' }
                    : { background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }
                  }>
                  {p}
                </button>
            )}
          <button onClick={() => fetchAppointments(page + 1)} disabled={page === lastPage}
            className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
            style={{ background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }}>
            Next
          </button>
        </div>
      )}

      {/* Status update modal */}
      {modalAppt && (
        <StatusUpdateModal
          appointmentId={modalAppt.id}
          current={modalAppt.status}
          onClose={() => setModalAppt(null)}
          onUpdated={(status) => {
            handleStatusUpdated(modalAppt.id, status)
            setModalAppt(null)
          }}
        />
      )}
    </main>
  )
}