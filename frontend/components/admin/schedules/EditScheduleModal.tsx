'use client'

import { useState, useEffect } from 'react'
import { X, Pencil, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import ScheduleField from './ScheduleField'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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

interface FormData {
  start_time: string
  end_time: string
  slot_duration: string
  is_active: boolean
}

interface Props {
  schedule: Schedule | null
  onClose: () => void
  onUpdated: () => void
}

export default function EditScheduleModal({ schedule, onClose, onUpdated }: Props) {
  const [form,   setForm]   = useState<FormData>({ start_time: '', end_time: '', slot_duration: '30', is_active: true })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  useEffect(() => {
    if (schedule) {
      setForm({
        start_time:    schedule.start_time.slice(0, 5),
        end_time:      schedule.end_time.slice(0, 5),
        slot_duration: String(schedule.slot_duration),
        is_active:     schedule.is_active,
      })
      setErrors({})
    }
  }, [schedule])

  if (!schedule) return null

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }))

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await api.put(`/admin/schedules/${schedule.id}`, {
        ...form,
        slot_duration: parseInt(form.slot_duration),
      })
      onUpdated()
      onClose()
    } catch (err: any) {
      setErrors(err?.response?.data?.errors ?? {})
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { if (!saving) onClose() }} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'hsl(38,92%,93%)' }}>
              <Pencil className="w-4 h-4" style={{ color: 'hsl(38,92%,45%)' }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Edit Schedule</h2>
              <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>
                Dr. {schedule.dentist?.first_name} {schedule.dentist?.last_name} — {DAYS[schedule.day_of_week]}
              </p>
            </div>
          </div>
          <button onClick={() => { if (!saving) onClose() }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: 'hsl(220,15%,55%)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ScheduleField label="Start Time" required type="time" value={form.start_time} onChange={(v) => set('start_time', v)} error={errors.start_time} />
            <ScheduleField label="End Time"   required type="time" value={form.end_time}   onChange={(v) => set('end_time', v)}   error={errors.end_time}   />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>Slot Duration (minutes)</label>
            <div className="flex gap-2">
              {['15', '30', '45', '60'].map((d) => (
                <button
                  key={d}
                  onClick={() => set('slot_duration', d)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={form.slot_duration === d
                    ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white' }
                    : { background: 'hsl(213,30%,96%)', color: 'hsl(220,15%,55%)', border: '1px solid hsl(213,30%,88%)' }
                  }
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'hsl(220,60%,15%)' }}>Active</p>
              <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>Disable to block this day</p>
            </div>
            <button
              onClick={() => set('is_active', !form.is_active)}
              className="w-11 h-6 rounded-full relative transition-colors duration-200"
              style={{ background: form.is_active ? 'hsl(142,72%,35%)' : 'hsl(220,15%,75%)' }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                style={{ left: form.is_active ? '22px' : '2px' }}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: 'hsl(213,30%,91%)', background: 'hsl(213,30%,98%)' }}>
          <button onClick={() => { if (!saving) onClose() }} disabled={saving} className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 disabled:opacity-50" style={{ color: 'hsl(220,15%,50%)' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            style={{ background: 'linear-gradient(135deg, hsl(38,92%,45%) 0%, hsl(38,92%,55%) 100%)', boxShadow: '0 4px 12px rgba(251,146,60,0.25)' }}
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}