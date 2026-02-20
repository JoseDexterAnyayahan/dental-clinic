'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { Service } from '@/types/admin'

interface Props {
  service: Service | null
  onClose: () => void
  onDeleted: () => void
}

export default function DeleteServiceModal({ service, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false)

  if (!service) return null

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/admin/services/${service.id}`)
      onDeleted()
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { if (!deleting) onClose() }} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
        <div className="px-6 py-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'hsl(0,70%,95%)' }}>
            <Trash2 className="w-5 h-5" style={{ color: 'hsl(0,70%,52%)' }} />
          </div>
          <h2 className="text-sm font-bold mb-1" style={{ color: 'hsl(220,60%,15%)' }}>Delete Service</h2>
          <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>
            Are you sure you want to delete{' '}
            <span className="font-semibold" style={{ color: 'hsl(220,60%,15%)' }}>{service.name}</span>?
            This cannot be undone.
          </p>
        </div>
        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={() => { if (!deleting) onClose() }}
            disabled={deleting}
            className="flex-1 py-2 rounded-xl text-xs font-semibold border hover:bg-gray-50 disabled:opacity-50"
            style={{ color: 'hsl(220,15%,50%)', borderColor: 'hsl(213,30%,88%)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-50"
            style={{ background: 'hsl(0,70%,52%)' }}
          >
            {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}