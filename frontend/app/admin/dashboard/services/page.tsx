'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Plus, RefreshCw, LayoutGrid, List } from 'lucide-react'
import api from '@/lib/api'
import { Service } from '@/types/admin'
import AdminHeader from '@/components/admin/AdminHeader'
import ServiceCard from '@/components/admin/services/ServiceCard'
import ServiceFormModal from '@/components/admin/services/ServiceFormModal'
import DeleteServiceModal from '@/components/admin/services/DeleteServiceModal'
import { Clock } from 'lucide-react'

const ICON_MAP: Record<string, string> = {
  stethoscope: '🩺', tooth: '🦷', sparkles: '✨', sun: '☀️',
  shield: '🛡️', activity: '⚡', 'align-center': '📐',
}

export default function AdminServicesPage() {
  const [services,     setServices]     = useState<Service[]>([])
  const [loading,      setLoading]      = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)
  const [search,       setSearch]       = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [view,         setView]         = useState<'grid' | 'list'>('grid')
  const [showForm,     setShowForm]     = useState(false)
  const [editTarget,   setEditTarget]   = useState<Service | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const fetchServices = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true)
    try {
      const res = await api.get<Service[]>('/admin/services')
      setServices(res.data)
    } catch {
      setServices([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  const displayed = services.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase())
    const matchActive = filterActive === 'all'
      || (filterActive === 'active' && s.is_active)
      || (filterActive === 'inactive' && !s.is_active)
    return matchSearch && matchActive
  })

  const totalRevenuePotential = services
    .filter((s) => s.is_active)
    .reduce((sum, s) => sum + parseFloat(String(s.price)), 0)

  return (
    <>
      <ServiceFormModal
        open={showForm || !!editTarget}
        service={editTarget}
        onClose={() => { setShowForm(false); setEditTarget(null) }}
        onSaved={() => fetchServices(true)}
      />
      <DeleteServiceModal
        service={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => fetchServices(true)}
      />

      <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
        <AdminHeader
          title="Services"
          subtitle={`${services.length} dental procedures · ${services.filter((s) => s.is_active).length} active`}
        />

        {/* Summary strip */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total Services', value: services.length,                              color: 'hsl(213,94%,44%)' },
              { label: 'Active',         value: services.filter((s) => s.is_active).length,   color: 'hsl(142,72%,35%)' },
              { label: 'Avg. Price',
                value: services.length
                  ? `₱${(services.reduce((s, x) => s + parseFloat(String(x.price)), 0) / services.length).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`
                  : '₱0',
                color: 'hsl(38,92%,45%)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border p-4 text-center" style={{ borderColor: 'hsl(213,30%,91%)' }}>
                <p className="text-xl font-bold" style={{ color }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(220,15%,55%)' }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'hsl(220,15%,60%)' }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'hsl(213,30%,96%)' }}>
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterActive(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={filterActive === f
                  ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white' }
                  : { color: 'hsl(220,15%,55%)', background: 'transparent' }
                }
              >
                {f}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'hsl(213,30%,96%)' }}>
            <button
              onClick={() => setView('grid')}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={view === 'grid' ? { background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : {}}
            >
              <LayoutGrid className="w-3.5 h-3.5" style={{ color: view === 'grid' ? 'hsl(213,94%,44%)' : 'hsl(220,15%,55%)' }} />
            </button>
            <button
              onClick={() => setView('list')}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={view === 'list' ? { background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : {}}
            >
              <List className="w-3.5 h-3.5" style={{ color: view === 'list' ? 'hsl(213,94%,44%)' : 'hsl(220,15%,55%)' }} />
            </button>
          </div>

          <button
            onClick={() => fetchServices(true)} disabled={refreshing}
            className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-50"
            style={{ background: 'hsl(213,30%,95%)' }}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: 'hsl(220,30%,45%)' }} />
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Service</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: 'hsl(213,30%,95%)' }} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border text-sm" style={{ borderColor: 'hsl(213,30%,91%)', color: 'hsl(220,15%,55%)' }}>
            No services found.
          </div>
        ) : view === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                onEdit={() => setEditTarget(s)}
                onDelete={() => setDeleteTarget(s)}
              />
            ))}
          </div>
        ) : (
          // List view
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
            {displayed.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                style={{ borderBottom: i < displayed.length - 1 ? '1px solid hsl(213,30%,93%)' : 'none' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'hsl(213,60%,95%)' }}>
                  {ICON_MAP[s.icon ?? ''] ?? '🦷'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'hsl(220,60%,15%)' }}>{s.name}</p>
                  {s.description && <p className="text-xs truncate" style={{ color: 'hsl(220,15%,60%)' }}>{s.description}</p>}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3 h-3" style={{ color: 'hsl(220,15%,60%)' }} />
                  <span className="text-xs" style={{ color: 'hsl(220,20%,45%)' }}>{s.duration_mins}m</span>
                </div>
                <p className="text-sm font-bold flex-shrink-0" style={{ color: 'hsl(213,94%,44%)' }}>
                  ₱{parseFloat(String(s.price)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
                  style={s.is_active
                    ? { background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,28%)' }
                    : { background: 'hsl(0,70%,95%)',   color: 'hsl(0,70%,40%)'   }
                  }
                >
                  {s.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setEditTarget(s)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-sky-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'hsl(213,94%,44%)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => setDeleteTarget(s)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'hsl(0,70%,52%)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}