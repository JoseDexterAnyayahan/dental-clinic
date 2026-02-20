'use client'

import { useState, useEffect } from 'react'
import { X, CalendarDays, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { Dentist } from '@/types/admin'
import ScheduleField from './ScheduleField'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface FormData {
  dentist_id: string
  day_of_week: string
  start_time: string
  end_time: string
  slot_duration: string
}

const INITIAL: FormData = {
  dentist_id: '', day_of_week: '', start_time: '', end_time: '', slot_duration: '30',
}

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
  dentists: Dentist[]
}

export default function AddScheduleModal({ open, onClose, onCreated, dentists }: Props) {
  const [form,   setForm]   = useState<FormData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  if (!open) return null

  const set = (field: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [field]: value }))

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.dentist_id)   e.dentist_id   = 'Please select a dentist.'
    if (form.day_of_week === '') e.day_of_week = 'Please select a day.'
    if (!form.start_time)   e.start_time   = 'Start time is required.'
    if (!form.end_time)     e.end_time     = 'End time is required.'
    if (!form.slot_duration) e.slot_duration = 'Slot duration is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await api.post('/admin/schedules', {
        ...form,
        day_of_week:   parseInt(form.day_of_week),
        slot_duration: parseInt(form.slot_duration),
      })
      setForm(INITIAL)
      setErrors({})
      onCreated()
      onClose()
    } catch (err: any) {
      const data = err?.response?.data
      if (data?.message) setErrors({ day_of_week: data.message })
      else setErrors(data?.errors ?? {})
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => { if (saving) return; setForm(INITIAL); setErrors({}); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'hsl(213,94%,93%)' }}>
              <CalendarDays className="w-4 h-4" style={{ color: 'hsl(213,94%,44%)' }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Add Schedule</h2>
              <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>Set a dentist's working hours</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" style={{ color: 'hsl(220,15%,55%)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Dentist select */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>
              Dentist <span className="text-red-400">*</span>
            </label>
            <select
              value={form.dentist_id}
              onChange={(e) => set('dentist_id', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: errors.dentist_id ? 'hsl(0,70%,60%)' : 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
            >
              <option value="">Select dentist…</option>
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}</option>
              ))}
            </select>
            {errors.dentist_id && <p className="text-xs mt-1" style={{ color: 'hsl(0,70%,50%)' }}>{errors.dentist_id}</p>}
          </div>

          {/* Day of week */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>
              Day of Week <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {DAYS.map((day, i) => (
                <button
                  key={day}
                  onClick={() => set('day_of_week', String(i))}
                  className="py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={form.day_of_week === String(i)
                    ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white' }
                    : { background: 'hsl(213,30%,96%)', color: 'hsl(220,15%,55%)', border: '1px solid hsl(213,30%,88%)' }
                  }
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            {errors.day_of_week && <p className="text-xs mt-1" style={{ color: 'hsl(0,70%,50%)' }}>{errors.day_of_week}</p>}
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <ScheduleField label="Start Time" required type="time" value={form.start_time} onChange={(v) => set('start_time', v)} error={errors.start_time} />
            <ScheduleField label="End Time"   required type="time" value={form.end_time}   onChange={(v) => set('end_time', v)}   error={errors.end_time}   />
          </div>

          {/* Slot duration */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>
              Slot Duration (minutes) <span className="text-red-400">*</span>
            </label>
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
            {errors.slot_duration && <p className="text-xs mt-1" style={{ color: 'hsl(0,70%,50%)' }}>{errors.slot_duration}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: 'hsl(213,30%,91%)', background: 'hsl(213,30%,98%)' }}>
          <button onClick={handleClose} disabled={saving} className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 disabled:opacity-50" style={{ color: 'hsl(220,15%,50%)' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : 'Add Schedule'}
          </button>
        </div>
      </div>
    </div>
  )
}