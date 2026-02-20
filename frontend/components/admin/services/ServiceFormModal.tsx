'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Zap } from 'lucide-react'
import api from '@/lib/api'
import { Service } from '@/types/admin'

const ICONS = [
  { key: 'stethoscope', emoji: '🩺', label: 'Checkup'    },
  { key: 'tooth',       emoji: '🦷', label: 'Tooth'      },
  { key: 'sparkles',    emoji: '✨', label: 'Cleaning'   },
  { key: 'sun',         emoji: '☀️', label: 'Whitening'  },
  { key: 'shield',      emoji: '🛡️', label: 'Filling'    },
  { key: 'activity',    emoji: '⚡', label: 'Root Canal' },
  { key: 'align-center',emoji: '📐', label: 'Ortho'      },
]

const DURATIONS = ['15', '30', '45', '60', '90', '120']

interface FormData {
  name: string; slug: string; description: string
  duration_mins: string; price: string; icon: string; is_active: boolean
}

const INITIAL: FormData = {
  name: '', slug: '', description: '', duration_mins: '30', price: '', icon: 'tooth', is_active: true,
}

function toSlug(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

interface Props {
  open: boolean
  service?: Service | null  // if provided = edit mode
  onClose: () => void
  onSaved: () => void
}

export default function ServiceFormModal({ open, service, onClose, onSaved }: Props) {
  const [form,   setForm]   = useState<FormData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const isEdit = !!service

  useEffect(() => {
    if (service) {
      setForm({
        name:          service.name          ?? '',
        slug:          service.slug          ?? '',
        description:   service.description   ?? '',
        duration_mins: String(service.duration_mins ?? 30),
        price:         String(service.price  ?? ''),
        icon:          service.icon          ?? 'tooth',
        is_active:     service.is_active     ?? true,
      })
    } else {
      setForm(INITIAL)
    }
    setErrors({})
  }, [service, open])

  if (!open) return null

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }))

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim())  e.name  = 'Name is required.'
    if (!form.price)        e.price = 'Price is required.'
    if (parseFloat(form.price) < 0) e.price = 'Price must be positive.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form, duration_mins: parseInt(form.duration_mins), price: parseFloat(form.price) }
      if (isEdit) {
        await api.put(`/admin/services/${service!.id}`, payload)
      } else {
        await api.post('/admin/services', payload)
      }
      onSaved()
      onClose()
    } catch (err: any) {
      setErrors(err?.response?.data?.errors ?? {})
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => { if (saving) return; onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'hsl(213,94%,93%)' }}>
              <Zap className="w-4 h-4" style={{ color: 'hsl(213,94%,44%)' }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'hsl(220,60%,15%)' }}>
                {isEdit ? 'Edit Service' : 'Add Service'}
              </h2>
              <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>
                {isEdit ? `Editing "${service!.name}"` : 'Create a new dental procedure'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: 'hsl(220,15%,55%)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Icon picker */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'hsl(220,60%,15%)' }}>Icon</label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(({ key, emoji, label }) => (
                <button
                  key={key}
                  onClick={() => set('icon', key)}
                  title={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={form.icon === key
                    ? { background: 'hsl(213,94%,93%)', outline: '2px solid hsl(213,94%,44%)', outlineOffset: 2 }
                    : { background: 'hsl(213,30%,96%)', border: '1px solid hsl(213,30%,88%)' }
                  }
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>
              Service Name <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => { set('name', e.target.value); if (!isEdit) set('slug', toSlug(e.target.value)) }}
              placeholder="e.g. General Checkup"
              className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: errors.name ? 'hsl(0,70%,60%)' : 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
            />
            {errors.name && <p className="text-xs mt-1" style={{ color: 'hsl(0,70%,50%)' }}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief description of the procedure…"
              className="w-full px-3 py-2 rounded-xl border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
            />
          </div>

          {/* Duration + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>Duration (minutes)</label>
              <div className="grid grid-cols-3 gap-1">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => set('duration_mins', d)}
                    className="py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={form.duration_mins === d
                      ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white' }
                      : { background: 'hsl(213,30%,96%)', color: 'hsl(220,15%,55%)', border: '1px solid hsl(213,30%,88%)' }
                    }
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>
                Price (₱) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: 'hsl(220,15%,55%)' }}>₱</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                  style={{ borderColor: errors.price ? 'hsl(0,70%,60%)' : 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
                />
              </div>
              {errors.price && <p className="text-xs mt-1" style={{ color: 'hsl(0,70%,50%)' }}>{errors.price}</p>}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'hsl(220,60%,15%)' }}>Active</p>
              <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>Visible and bookable by clients</p>
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
          <button onClick={handleClose} disabled={saving} className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 disabled:opacity-50" style={{ color: 'hsl(220,15%,50%)' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Service'}
          </button>
        </div>
      </div>
    </div>
  )
}