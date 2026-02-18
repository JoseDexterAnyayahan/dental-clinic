'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AppointmentStatus } from '@/types/appointment'
import api from '@/lib/api'

const STATUSES: AppointmentStatus[] = ['pending','confirmed','in_progress','completed','cancelled','no_show']

interface Props {
  appointmentId: number
  current: AppointmentStatus
  onClose: () => void
  onUpdated: (status: AppointmentStatus, adminNotes: string) => void
}

export default function StatusUpdateModal({ appointmentId, current, onClose, onUpdated }: Props) {
  const [status,       setStatus]       = useState<AppointmentStatus>(current)
  const [adminNotes,   setAdminNotes]   = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await api.patch(`/admin/appointments/${appointmentId}/status`, {
        status,
        admin_notes:   adminNotes || undefined,
        cancel_reason: status === 'cancelled' ? cancelReason : undefined,
      })
      onUpdated(status, adminNotes)
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to update status.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base" style={{ color: 'hsl(220,60%,15%)' }}>Update Status</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'hsl(213,30%,95%)' }}>
            <X className="w-4 h-4" style={{ color: 'hsl(220,30%,40%)' }} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'hsl(220,15%,50%)' }}>
              NEW STATUS
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border"
                  style={{
                    background:   status === s ? 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' : 'hsl(213,30%,97%)',
                    color:        status === s ? 'white' : 'hsl(220,20%,40%)',
                    borderColor:  status === s ? 'transparent' : 'hsl(213,30%,91%)',
                    boxShadow:    status === s ? '0 2px 8px rgba(59,130,246,0.2)' : 'none',
                  }}
                >
                  {s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {status === 'cancelled' && (
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,15%,50%)' }}>
                CANCEL REASON
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={2}
                placeholder="Reason for cancellation…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,98%)' }}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,15%,50%)' }}>
              ADMIN NOTES <span style={{ color: 'hsl(220,15%,70%)' }}>(optional)</span>
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              placeholder="Internal notes…"
              className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,98%)' }}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">{error}</p>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: 'hsl(213,30%,88%)', color: 'hsl(220,20%,45%)' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
          >
            {saving ? 'Saving…' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  )
}