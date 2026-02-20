'use client'

import { useState } from 'react'
import { X, UserPlus, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  specialization: string
  bio: string
  is_active: boolean
}

const INITIAL: FormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  specialization: '',
  bio: '',
  is_active: true,
}

export default function AddDentistModal({ open, onClose, onCreated }: Props) {
  const [form, setForm]     = useState<FormData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  if (!open) return null

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.first_name.trim()) e.first_name = 'First name is required.'
    if (!form.last_name.trim())  e.last_name  = 'Last name is required.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Invalid email address.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await api.post('/admin/dentists', form)
      setForm(INITIAL)
      setErrors({})
      onCreated()
      onClose()
    } catch (err: any) {
      const serverErrors = err?.response?.data?.errors ?? {}
      setErrors(serverErrors)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (saving) return
    setForm(INITIAL)
    setErrors({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border overflow-hidden"
        style={{ borderColor: 'hsl(213,30%,91%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'hsl(213,94%,93%)' }}>
              <UserPlus className="w-4 h-4" style={{ color: 'hsl(213,94%,44%)' }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Add Dentist</h2>
              <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>Fill in the dentist's details</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" style={{ color: 'hsl(220,15%,55%)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" required value={form.first_name} error={errors.first_name} onChange={(v) => set('first_name', v)} placeholder="Juan" />
            <Field label="Last Name"  required value={form.last_name}  error={errors.last_name}  onChange={(v) => set('last_name', v)}  placeholder="Dela Cruz" />
          </div>
          <Field label="Specialization" value={form.specialization} onChange={(v) => set('specialization', v)} placeholder="e.g. Orthodontist, General Dentist" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" type="email" value={form.email} error={errors.email} onChange={(v) => set('email', v)} placeholder="dr@clinic.com" />
            <Field label="Phone" value={form.phone} onChange={(v) => set('phone', v)} placeholder="+63 9xx xxx xxxx" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Short description about the dentist…"
              className="w-full px-3 py-2 rounded-xl border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'hsl(220,60%,15%)' }}>Active Status</p>
              <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>Dentist can receive appointments</p>
            </div>
            <button
              type="button"
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
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : 'Add Dentist'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, error, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; error?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
        style={{ borderColor: error ? 'hsl(0,70%,60%)' : 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
      />
      {error && <p className="text-xs mt-1" style={{ color: 'hsl(0,70%,50%)' }}>{error}</p>}
    </div>
  )
}