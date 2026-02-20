'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, RefreshCw, UserPlus } from 'lucide-react'
import api from '@/lib/api'
import { Dentist } from '@/types/admin'
import AdminHeader from '@/components/admin/AdminHeader'
import {
  AddDentistModal,
  EditDentistModal,
  DeleteDentistModal,
  DentistDetailModal,
} from '@/components/admin/DentistModals'

export default function AdminDentistsPage() {
  const [dentists,       setDentists]       = useState<Dentist[]>([])
  const [search,         setSearch]         = useState('')
  const [loading,        setLoading]        = useState(true)
  const [refreshing,     setRefreshing]     = useState(false)
  const [showAdd,        setShowAdd]        = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<Dentist | null>(null)
  const [selectedEdit,   setSelectedEdit]   = useState<Dentist | null>(null)
  const [selectedDelete, setSelectedDelete] = useState<Dentist | null>(null)

  const fetchDentists = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true)
    try {
      const res  = await api.get('/admin/dentists')
      const data = res.data?.data ?? res.data
      setDentists(Array.isArray(data) ? data : [])
    } finally { setLoading(false); setRefreshing(false) }
  }, [])

  useEffect(() => { fetchDentists() }, [fetchDentists])

  const displayed = search
    ? dentists.filter((d) => {
        const q = search.toLowerCase()
        return `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) ||
               (d.specialization ?? '').toLowerCase().includes(q)
      })
    : dentists

  return (
    <>
      <AddDentistModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={() => fetchDentists(true)}
      />
      <DentistDetailModal
        dentist={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        onEdit={() => { setSelectedEdit(selectedDetail); setSelectedDetail(null) }}
        onDelete={() => { setSelectedDelete(selectedDetail); setSelectedDetail(null) }}
      />
      <EditDentistModal
        dentist={selectedEdit}
        onClose={() => setSelectedEdit(null)}
        onUpdated={() => fetchDentists(true)}
      />
      <DeleteDentistModal
        dentist={selectedDelete}
        onClose={() => setSelectedDelete(null)}
        onDeleted={() => fetchDentists(true)}
      />

      <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
        <AdminHeader title="Dentists" subtitle={`${dentists.length} staff members`} />

        <div className="flex gap-2 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'hsl(220,15%,60%)' }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dentists…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
            />
          </div>
          <button
            onClick={() => fetchDentists(true)} disabled={refreshing}
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
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Dentist</span>
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: 'hsl(213,30%,95%)' }} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border text-sm" style={{ borderColor: 'hsl(213,30%,91%)', color: 'hsl(220,15%,55%)' }}>
            No dentists found.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDetail(d)}
                className="bg-white rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer hover:border-sky-200"
                style={{ borderColor: 'hsl(213,30%,91%)' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
                  >
                    {d.first_name[0]}{d.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'hsl(220,60%,15%)' }}>
                      Dr. {d.first_name} {d.last_name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'hsl(213,94%,44%)' }}>
                      {d.specialization ?? 'General Dentist'}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-medium flex-shrink-0"
                    style={d.is_active
                      ? { background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,28%)' }
                      : { background: 'hsl(0,70%,95%)',   color: 'hsl(0,70%,40%)'   }
                    }
                  >
                    {d.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {d.email && <p className="text-xs truncate" style={{ color: 'hsl(220,15%,55%)' }}>{d.email}</p>}
                {d.bio   && <p className="text-xs mt-2 line-clamp-2" style={{ color: 'hsl(220,15%,60%)' }}>{d.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}