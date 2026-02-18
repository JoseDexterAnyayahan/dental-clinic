'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import api from '@/lib/api'
import { ClientProfile, Paginated } from '@/types/admin'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminClientsPage() {
  const [clients,    setClients]    = useState<ClientProfile[]>([])
  const [search,     setSearch]     = useState('')
  const [page,       setPage]       = useState(1)
  const [lastPage,   setLastPage]   = useState(1)
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchClients = useCallback(async (p = 1, refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true)
    try {
      const res = await api.get<Paginated<ClientProfile>>('/admin/clients', { params: { page: p } })
      setClients(res.data.data)
      setLastPage(res.data.last_page)
      setTotal(res.data.total)
      setPage(p)
    } finally { setLoading(false); setRefreshing(false) }
  }, [])

  useEffect(() => { fetchClients(1) }, [fetchClients])

  // API returns User shape — search directly on c.name / c.email
  const displayed = search
    ? clients.filter((c) => {
        const q = search.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      })
    : clients

  return (
    <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      <AdminHeader title="Clients" subtitle={`${total} registered patients`} />

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: 'hsl(220,15%,60%)' }} />
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
            style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
          />
        </div>
        <button
          onClick={() => fetchClients(page, true)} disabled={refreshing}
          className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-50"
          style={{ background: 'hsl(213,30%,95%)' }}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            style={{ color: 'hsl(220,30%,45%)' }} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse"
                style={{ background: 'hsl(213,30%,96%)' }} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center text-sm" style={{ color: 'hsl(220,15%,55%)' }}>
            No clients found.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'hsl(213,30%,91%)' }}>
            {displayed.map((c) => (
              <div key={c.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">

                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
                >
                  {c.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'hsl(220,60%,15%)' }}>
                    {c.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'hsl(220,15%,55%)' }}>
                    {c.email}
                  </p>
                </div>

                {/* Phone + status */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>
                    {c.client?.phone ?? 'No phone'}
                  </p>
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded-lg text-xs font-medium"
                    style={c.is_active
                      ? { background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,28%)' }
                      : { background: 'hsl(0,70%,95%)',   color: 'hsl(0,70%,40%)'   }
                    }
                  >
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Joined date */}
                <p className="text-xs flex-shrink-0 hidden lg:block" style={{ color: 'hsl(220,15%,60%)' }}>
                  Joined {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => fetchClients(page - 1)} disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
            style={{ background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }}
          >
            Previous
          </button>
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => fetchClients(p)}
              className="w-9 h-9 rounded-xl text-sm font-semibold"
              style={page === p
                ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white' }
                : { background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }
              }
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => fetchClients(page + 1)} disabled={page === lastPage}
            className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
            style={{ background: 'hsl(213,30%,95%)', color: 'hsl(220,20%,40%)' }}
          >
            Next
          </button>
        </div>
      )}
    </main>
  )
}