'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Plus, RefreshCw, ChevronDown, Clock, Pencil, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import { Dentist } from '@/types/admin'
import AdminHeader from '@/components/admin/AdminHeader'
import AddScheduleModal from '@/components/admin/schedules/AddScheduleModal'
import EditScheduleModal from '@/components/admin/schedules/EditScheduleModal'
import DeleteScheduleModal from '@/components/admin/schedules/DeleteScheduleModal'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface Schedule {
  id: number
  dentist_id: number
  day_of_week: number
  start_time: string
  end_time: string
  slot_duration: number
  is_active: boolean
  dentist?: { first_name: string; last_name: string }
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

function DentistScheduleRow({
  dentistName, schedules, onEdit, onDelete,
}: {
  dentistName: string
  schedules: Schedule[]
  onEdit: (s: Schedule) => void
  onDelete: (s: Schedule) => void
}) {
  const [open, setOpen] = useState(false)

  const initials = dentistName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  const activeDays = schedules.filter((s) => s.is_active).length
  const scheduledDayIndexes = schedules.map((s) => s.day_of_week)

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden transition-all"
      style={{ borderColor: 'hsl(213,30%,91%)' }}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
        >
          {initials}
        </div>

        {/* Name + summary */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: 'hsl(220,60%,15%)' }}>
            Dr. {dentistName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'hsl(220,15%,55%)' }}>
            {activeDays} active day{activeDays !== 1 ? 's' : ''} · {schedules.length} schedule{schedules.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Week dots — quick visual of which days are scheduled */}
        <div className="hidden sm:flex items-center gap-1">
          {DAYS.map((day, i) => {
            const sched = schedules.find((s) => s.day_of_week === i)
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-xs" style={{ color: 'hsl(220,15%,65%)', fontSize: 10 }}>{day}</span>
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={sched
                    ? sched.is_active
                      ? { background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,35%)' }
                      : { background: 'hsl(0,70%,95%)',   color: 'hsl(0,70%,50%)'   }
                    : { background: 'hsl(213,30%,95%)',   color: 'hsl(220,15%,70%)' }
                  }
                >
                  <span style={{ fontSize: 9, fontWeight: 700 }}>
                    {sched ? (sched.is_active ? '✓' : '−') : '·'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Chevron */}
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{
            color: 'hsl(220,15%,55%)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Expanded schedule rows */}
      {open && (
        <div className="border-t" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          {schedules
            .sort((a, b) => a.day_of_week - b.day_of_week)
            .map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors"
                style={{
                  borderBottom: i < schedules.length - 1 ? '1px solid hsl(213,30%,93%)' : 'none',
                  opacity: s.is_active ? 1 : 0.6,
                }}
              >
                {/* Day */}
                <div
                  className="w-16 py-1 rounded-lg text-center text-xs font-bold flex-shrink-0"
                  style={s.is_active
                    ? { background: 'hsl(213,94%,93%)', color: 'hsl(213,94%,38%)' }
                    : { background: 'hsl(220,15%,93%)', color: 'hsl(220,15%,55%)' }
                  }
                >
                  {DAYS_FULL[s.day_of_week]}
                </div>

                {/* Time */}
                <div className="flex items-center gap-1.5 flex-1">
                  <Clock className="w-3 h-3 flex-shrink-0" style={{ color: 'hsl(220,15%,60%)' }} />
                  <span className="text-xs" style={{ color: 'hsl(220,30%,40%)' }}>
                    {formatTime(s.start_time)} – {formatTime(s.end_time)}
                  </span>
                </div>

                {/* Slot */}
                <span
                  className="text-xs px-2 py-0.5 rounded-md flex-shrink-0"
                  style={{ background: 'hsl(213,30%,94%)', color: 'hsl(220,15%,55%)' }}
                >
                  {s.slot_duration}m slots
                </span>

                {/* Status */}
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
                  style={s.is_active
                    ? { background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,28%)' }
                    : { background: 'hsl(0,70%,95%)',   color: 'hsl(0,70%,40%)'   }
                  }
                >
                  {s.is_active ? 'Active' : 'Inactive'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEdit(s)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-sky-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" style={{ color: 'hsl(213,94%,44%)' }} />
                  </button>
                  <button
                    onClick={() => onDelete(s)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" style={{ color: 'hsl(0,70%,52%)' }} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default function AdminSchedulesPage() {
  const [schedules,    setSchedules]    = useState<Schedule[]>([])
  const [dentists,     setDentists]     = useState<Dentist[]>([])
  const [loading,      setLoading]      = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)
  const [search,       setSearch]       = useState('')
  const [showAdd,      setShowAdd]      = useState(false)
  const [editTarget,   setEditTarget]   = useState<Schedule | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null)

  const fetchSchedules = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true)
    try {
      const [schedRes, dentRes] = await Promise.all([
        api.get('/admin/schedules'),
        api.get('/admin/dentists'),
      ])
      setSchedules(schedRes.data)
      const dentData = dentRes.data?.data ?? dentRes.data
      setDentists(Array.isArray(dentData) ? dentData : [])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchSchedules() }, [fetchSchedules])

  // Group by dentist
  const grouped = schedules.reduce<Record<string, Schedule[]>>((acc, s) => {
    const key = `${s.dentist?.first_name} ${s.dentist?.last_name}`
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  const filteredGroups = Object.entries(grouped).filter(([name]) =>
    !search || name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <AddScheduleModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={() => fetchSchedules(true)}
        dentists={dentists}
      />
      <EditScheduleModal
        schedule={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={() => fetchSchedules(true)}
      />
      <DeleteScheduleModal
        schedule={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => fetchSchedules(true)}
      />

      <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
        <AdminHeader
          title="Schedules"
          subtitle={`${Object.keys(grouped).length} dentist${Object.keys(grouped).length !== 1 ? 's' : ''} · ${schedules.length} total schedules`}
        />

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'hsl(220,15%,60%)' }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dentist…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
            />
          </div>
          <button
            onClick={() => fetchSchedules(true)} disabled={refreshing}
            className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-50"
            style={{ background: 'hsl(213,30%,95%)' }}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: 'hsl(220,30%,45%)' }} />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Schedule</span>
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'hsl(213,30%,95%)' }} />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border text-sm"
            style={{ borderColor: 'hsl(213,30%,91%)', color: 'hsl(220,15%,55%)' }}>
            No schedules found.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map(([dentistName, scheds]) => (
              <DentistScheduleRow
                key={dentistName}
                dentistName={dentistName}
                schedules={scheds}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}