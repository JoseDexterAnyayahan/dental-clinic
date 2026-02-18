'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Clock, DollarSign } from 'lucide-react'
import api from '@/lib/api'
import { Service, Paginated } from '@/types/admin'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading,  setLoading]  = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchServices = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true)
    try {
      const res = await api.get<Paginated<Service>>('/admin/services')
      setServices(res.data.data)
    } finally { setLoading(false); setRefreshing(false) }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  return (
    <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      <AdminHeader title="Services" subtitle={`${services.length} dental procedures`} />

      <div className="flex justify-end mb-5">
        <button onClick={() => fetchServices(true)} disabled={refreshing}
          className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-50"
          style={{ background: 'hsl(213,30%,95%)' }}>
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: 'hsl(220,30%,45%)' }} />
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl animate-pulse" style={{ background: 'hsl(213,30%,95%)' }} />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border p-5 hover:shadow-md transition-all group"
              style={{ borderColor: 'hsl(213,30%,91%)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsl(213,60%,95%)' }}>
                  <span className="text-lg">{s.icon ?? '🦷'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg text-xs font-medium"
                  style={s.is_active
                    ? { background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,28%)' }
                    : { background: 'hsl(0,70%,95%)',   color: 'hsl(0,70%,40%)'   }
                  }>
                  {s.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm font-bold mb-1" style={{ color: 'hsl(220,60%,15%)' }}>{s.name}</p>
              {s.description && (
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'hsl(220,15%,60%)' }}>{s.description}</p>
              )}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'hsl(213,94%,44%)' }}>
                  <Clock className="w-3 h-3" /> {s.duration_mins} min
                </span>
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'hsl(142,72%,35%)' }}>
                  <DollarSign className="w-3 h-3" /> ₱{parseFloat(s.price).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}