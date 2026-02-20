'use client'

import { useState } from 'react'
import { X, AlertTriangle, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface AppointmentCancelModalProps {
  appointmentId: number
  appointmentNo: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AppointmentCancelModal({
  appointmentId,
  appointmentNo,
  isOpen,
  onClose,
  onSuccess,
}: AppointmentCancelModalProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleCancel = async () => {
    setSubmitting(true)
    try {
      await api.patch(`/client/appointments/${appointmentId}/cancel`, {
        cancel_reason: reason,
      })
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel appointment')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
        style={{ borderColor: 'hsl(213,30%,90%)' }}
      >
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between rounded-t-3xl"
          style={{ borderColor: 'hsl(213,30%,90%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'hsl(0,70%,95%)' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: 'hsl(0,70%,50%)' }} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold" style={{ color: 'hsl(220,60%,15%)' }}>
                Cancel Appointment
              </h2>
              <p className="text-xs" style={{ color: 'hsl(220,15%,50%)' }}>
                {appointmentNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: 'hsl(220,30%,40%)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: 'hsl(220,15%,50%)' }}>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </p>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(220,30%,35%)' }}>
              Reason for Cancellation (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Let us know why you're cancelling..."
              className="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2"
              style={{ borderColor: 'hsl(213,30%,90%)', color: 'hsl(220,60%,15%)' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex gap-3 rounded-b-3xl"
          style={{ borderColor: 'hsl(213,30%,90%)' }}>
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-3 rounded-xl border-2 font-semibold transition-all hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: 'hsl(213,30%,90%)', color: 'hsl(220,60%,15%)' }}
          >
            Keep Appointment
          </button>
          <button
            onClick={handleCancel}
            disabled={submitting}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            style={{ background: 'hsl(0,70%,50%)' }}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}