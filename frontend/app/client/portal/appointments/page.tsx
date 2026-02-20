'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, RefreshCw, CalendarDays, Clock, User, Stethoscope, ChevronRight, XCircle, Pencil } from 'lucide-react'
import api from '@/lib/api'
import { Appointment, AppointmentStatus, PaginatedAppointments } from '@/types/appointment.types'
import ClientHeader from '@/components/client/ClientHeader'
import FilterBar from '@/components/client/appointments/FilterBar'
import EmptyState from '@/components/client/appointments/EmptyState'
import AppointmentEditModal from '@/components/client/appointments/AppointmentEditModal'
import AppointmentCancelModal from '@/components/client/appointments/AppointmentCancelModal'

const SKELETON = Array.from({ length: 6 })

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'hsl(38,92%,93%)',   color: 'hsl(38,92%,35%)',  label: 'Pending'   },
  confirmed: { bg: 'hsl(213,94%,93%)',  color: 'hsl(213,94%,38%)', label: 'Confirmed' },
  completed: { bg: 'hsl(142,72%,93%)',  color: 'hsl(142,72%,28%)', label: 'Completed' },
  cancelled: { bg: 'hsl(0,70%,95%)',    color: 'hsl(0,70%,45%)',   label: 'Cancelled' },
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function groupByDate(appointments: Appointment[]) {
  const groups: Record<string, Appointment[]> = {}
  for (const a of appointments) {
    const key = a.appointment_date.slice(0, 10)
    if (!groups[key]) groups[key] = []
    groups[key].push(a)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
}

function isEditable(a: Appointment) {
  return a.status === 'pending' || a.status === 'confirmed'
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter,       setFilter]       = useState<AppointmentStatus | 'all'>('all')
  const [page,         setPage]         = useState(1)
  const [lastPage,     setLastPage]     = useState(1)
  const [total,        setTotal]        = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showEditModal,       setShowEditModal]       = useState(false)
  const [showCancelModal,     setShowCancelModal]     = useState(false)

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

  useEffect(() => { fetchAppointments(1) }, [fetchAppointments])

  const grouped = groupByDate(appointments)

  return (
    <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      <ClientHeader
        title="My Appointments"
        subtitle={`${total} appointment${total !== 1 ? 's' : ''} total`}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <FilterBar active={filter} onChange={(s) => { setFilter(s) }} />
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => fetchAppointments(page, true)}
            disabled={refreshing}
            className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-50"
            style={{ background: 'hsl(213,30%,95%)' }}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: 'hsl(220,30%,45%)' }} />
          </button>
          <Link
            href="/client/portal/appointments/book"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Book new</span>
          </Link>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          {SKELETON.map((_, i) => (
            <div
              key={i}
              className="h-14 border-b animate-pulse last:border-0"
              style={{ background: i % 2 === 0 ? 'hsl(213,30%,97%)' : 'white', borderColor: 'hsl(213,30%,91%)' }}
            />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState filtered={filter !== 'all'} />
      ) : (
        <>
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
            {grouped.map(([dateKey, appts], gi) => (
  <div key={dateKey}>
    {/* Date group header */}
    <div
      className="px-5 py-2.5 flex items-center gap-2 sticky top-0"
      style={{ background: 'hsl(213,30%,97%)', borderBottom: '1px solid hsl(213,30%,91%)' }}
    >
      <CalendarDays className="w-3.5 h-3.5" style={{ color: 'hsl(213,94%,44%)' }} />
      <span className="text-xs font-semibold" style={{ color: 'hsl(220,60%,15%)' }}>
        {formatDate(dateKey)}
      </span>
    </div>

    {/* Rows */}
    {appts.map((a, i) => {
      const status = STATUS_STYLES[a.status] ?? STATUS_STYLES.pending
      const editable = isEditable(a)
      return (
        <div
          key={a.id}
          className="grid items-center px-5 py-4 gap-3 transition-colors hover:bg-slate-50"
          style={{
            gridTemplateColumns: '8px 80px 90px 1fr 1fr 90px 64px',
            borderBottom: i < appts.length - 1 ? '1px solid hsl(213,30%,93%)' : 'none',
          }}
        >
          {/* Status dot */}
          <div className="w-2 h-2 rounded-full" style={{ background: status.color }} />

          {/* Appt No */}
          <span className="text-xs font-mono font-semibold truncate" style={{ color: 'hsl(220,15%,55%)' }}>
            #{a.appointment_no}
          </span>

          {/* Time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(220,15%,65%)' }} />
            <span className="text-xs" style={{ color: 'hsl(220,30%,40%)' }}>
              {formatTime(a.appointment_date)}
            </span>
          </div>

          {/* Dentist */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Stethoscope className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(220,15%,65%)' }} />
            <span className="text-xs truncate" style={{ color: 'hsl(220,30%,40%)' }}>
              {a.dentist ? `Dr. ${a.dentist.first_name} ${a.dentist.last_name}` : '—'}
            </span>
          </div>

          {/* Service */}
          <span className="text-xs truncate hidden sm:block" style={{ color: 'hsl(220,15%,55%)' }}>
            {a.service?.name ?? '—'}
          </span>

          {/* Status badge */}
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-lg text-center"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>

          {/* Actions */}
          <div className="flex items-center justify-end gap-1">
            {editable ? (
              <>
                <button
                  onClick={() => { setSelectedAppointment(a); setShowEditModal(true) }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-sky-100 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" style={{ color: 'hsl(213,94%,44%)' }} />
                </button>
                <button
                  onClick={() => { setSelectedAppointment(a); setShowCancelModal(true) }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                  title="Cancel"
                >
                  <XCircle className="w-3.5 h-3.5" style={{ color: 'hsl(0,70%,52%)' }} />
                </button>
              </>
            ) : (
              <div className="w-[64px]" /> // placeholder to keep alignment
            )}
          </div>
        </div>
      )
    })}
  </div>
))}
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => fetchAppointments(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
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
                      style={page === p
                        ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white' }
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
                className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
                style={{ background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {selectedAppointment && (
        <>
          <AppointmentEditModal
            appointment={selectedAppointment}
            isOpen={showEditModal}
            onClose={() => { setShowEditModal(false); setSelectedAppointment(null) }}
            onSuccess={() => fetchAppointments(page, true)}
          />
          <AppointmentCancelModal
            appointmentId={selectedAppointment.id}
            appointmentNo={selectedAppointment.appointment_no}
            isOpen={showCancelModal}
            onClose={() => { setShowCancelModal(false); setSelectedAppointment(null) }}
            onSuccess={() => fetchAppointments(page, true)}
          />
        </>
      )}
    </main>
  )
}