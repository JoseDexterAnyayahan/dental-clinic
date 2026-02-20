'use client'

import { useState, useEffect } from 'react'

import { X, UserPlus, Loader2, Pencil, Trash2, Mail, Phone, User } from 'lucide-react'
import api from '@/lib/api'
import { Dentist } from '@/types/admin'

// ─── Shared Field ────────────────────────────────────────────────────────────

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

// ─── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-xs font-semibold" style={{ color: 'hsl(220,60%,15%)' }}>Active Status</p>
        <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>Dentist can receive appointments</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full relative transition-colors duration-200"
        style={{ background: value ? 'hsl(142,72%,35%)' : 'hsl(220,15%,75%)' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
          style={{ left: value ? '22px' : '2px' }}
        />
      </button>
    </div>
  )
}

// ─── Form Body (shared between Add & Edit) ───────────────────────────────────

interface FormData {
  first_name: string; last_name: string; email: string
  phone: string; specialization: string; bio: string; is_active: boolean
}

function DentistFormBody({ form, errors, set }: {
  form: FormData
  errors: Partial<Record<keyof FormData, string>>
  set: (field: keyof FormData, value: string | boolean) => void
}) {
  return (
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
          rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)}
          placeholder="Short description about the dentist…"
          className="w-full px-3 py-2 rounded-xl border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
          style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
        />
      </div>
      <Toggle value={form.is_active} onChange={(v) => set('is_active', v)} />
    </div>
  )
}

// ─── Add Modal ───────────────────────────────────────────────────────────────

const INITIAL: FormData = { first_name: '', last_name: '', email: '', phone: '', specialization: '', bio: '', is_active: true }

interface AddProps { open: boolean; onClose: () => void; onCreated: () => void }

export function AddDentistModal({ open, onClose, onCreated }: AddProps) {
  const [form, setForm]     = useState<FormData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  if (!open) return null

  const set = (field: keyof FormData, value: string | boolean) => setForm((p) => ({ ...p, [field]: value }))

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.first_name.trim()) e.first_name = 'First name is required.'
    if (!form.last_name.trim())  e.last_name  = 'Last name is required.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email.'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await api.post('/admin/dentists', form)
      setForm(INITIAL); setErrors({}); onCreated(); onClose()
    } catch (err: any) { setErrors(err?.response?.data?.errors ?? {}) }
    finally { setSaving(false) }
  }

  const handleClose = () => { if (saving) return; setForm(INITIAL); setErrors({}); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
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
        <DentistFormBody form={form} errors={errors} set={set} />
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: 'hsl(213,30%,91%)', background: 'hsl(213,30%,98%)' }}>
          <button onClick={handleClose} disabled={saving} className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 disabled:opacity-50" style={{ color: 'hsl(220,15%,50%)' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100" style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}>
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : 'Add Dentist'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Modal ──────────────────────────────────────────────────────────────

interface EditProps { dentist: Dentist | null; onClose: () => void; onUpdated: () => void }

export function EditDentistModal({ dentist, onClose, onUpdated }: EditProps) {
  const [form, setForm]     = useState<FormData>({
    first_name: '', last_name: '', email: '', phone: '',
    specialization: '', bio: '', is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // ✅ Re-populate form whenever dentist changes
  useEffect(() => {
    if (dentist) {
      setForm({
        first_name:     dentist.first_name     ?? '',
        last_name:      dentist.last_name      ?? '',
        email:          dentist.email          ?? '',
        phone:          dentist.phone          ?? '',
        specialization: dentist.specialization ?? '',
        bio:            dentist.bio            ?? '',
        is_active:      dentist.is_active      ?? true,
      })
      setErrors({})
    }
  }, [dentist])

  if (!dentist) return null

  const set = (field: keyof FormData, value: string | boolean) => setForm((p) => ({ ...p, [field]: value }))

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.first_name.trim()) e.first_name = 'First name is required.'
    if (!form.last_name.trim())  e.last_name  = 'Last name is required.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email.'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await api.put(`/admin/dentists/${dentist.id}`, form)
      setErrors({}); onUpdated(); onClose()
    } catch (err: any) { setErrors(err?.response?.data?.errors ?? {}) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { if (!saving) onClose() }} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'hsl(213,30%,91%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'hsl(38,92%,93%)' }}>
              <Pencil className="w-4 h-4" style={{ color: 'hsl(38,92%,45%)' }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Edit Dentist</h2>
              <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>Dr. {dentist.first_name} {dentist.last_name}</p>
            </div>
          </div>
          <button onClick={() => { if (!saving) onClose() }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" style={{ color: 'hsl(220,15%,55%)' }} />
          </button>
        </div>
        <DentistFormBody form={form} errors={errors} set={set} />
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: 'hsl(213,30%,91%)', background: 'hsl(213,30%,98%)' }}>
          <button onClick={() => { if (!saving) onClose() }} disabled={saving} className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 disabled:opacity-50" style={{ color: 'hsl(220,15%,50%)' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100" style={{ background: 'linear-gradient(135deg, hsl(38,92%,45%) 0%, hsl(38,92%,55%) 100%)', boxShadow: '0 4px 12px rgba(251,146,60,0.25)' }}>
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteProps { dentist: Dentist | null; onClose: () => void; onDeleted: () => void }

export function DeleteDentistModal({ dentist, onClose, onDeleted }: DeleteProps) {
  const [deleting, setDeleting] = useState(false)

  if (!dentist) return null

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/admin/dentists/${dentist.id}`)
      onDeleted(); onClose()
    } finally { setDeleting(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { if (!deleting) onClose() }} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
        <div className="px-6 py-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'hsl(0,70%,95%)' }}>
            <Trash2 className="w-5 h-5" style={{ color: 'hsl(0,70%,52%)' }} />
          </div>
          <h2 className="text-sm font-bold mb-1" style={{ color: 'hsl(220,60%,15%)' }}>Delete Dentist</h2>
          <p className="text-xs" style={{ color: 'hsl(220,15%,55%)' }}>
            Are you sure you want to delete <span className="font-semibold" style={{ color: 'hsl(220,60%,15%)' }}>Dr. {dentist.first_name} {dentist.last_name}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center gap-2 px-6 pb-6">
          <button onClick={() => { if (!deleting) onClose() }} disabled={deleting} className="flex-1 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 disabled:opacity-50 border" style={{ color: 'hsl(220,15%,50%)', borderColor: 'hsl(213,30%,88%)' }}>Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-50" style={{ background: 'hsl(0,70%,52%)' }}>
            {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Dentist Detail Modal ─────────────────────────────────────────────────────

interface DetailProps { dentist: Dentist | null; onClose: () => void; onEdit: () => void; onDelete: () => void }

export function DentistDetailModal({ dentist, onClose, onEdit, onDelete }: DetailProps) {
  if (!dentist) return null

  const initials = `${dentist.first_name[0]}${dentist.last_name[0]}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'hsl(213,30%,91%)' }}>
        {/* Top banner */}
        <div className="h-20 w-full" style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }} />

        <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors">
          <X className="w-3.5 h-3.5 text-white" />
        </button>

        {/* Avatar */}
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-7 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold text-white border-2 border-white shadow-md" style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}>
              {initials}
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={dentist.is_active
              ? { background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,28%)' }
              : { background: 'hsl(0,70%,95%)',   color: 'hsl(0,70%,40%)'   }
            }>
              {dentist.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <h2 className="text-base font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Dr. {dentist.first_name} {dentist.last_name}</h2>
          <p className="text-xs mb-4" style={{ color: 'hsl(213,94%,44%)' }}>{dentist.specialization ?? 'General Dentist'}</p>

          <div className="space-y-2.5">
            {dentist.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'hsl(220,15%,60%)' }} />
                <span className="text-xs truncate" style={{ color: 'hsl(220,30%,35%)' }}>{dentist.email}</span>
              </div>
            )}
            {dentist.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'hsl(220,15%,60%)' }} />
                <span className="text-xs" style={{ color: 'hsl(220,30%,35%)' }}>{dentist.phone}</span>
              </div>
            )}
            {dentist.bio && (
              <div className="flex items-start gap-2.5">
                <User className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(220,15%,60%)' }} />
                <p className="text-xs line-clamp-3" style={{ color: 'hsl(220,30%,35%)' }}>{dentist.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-6 pb-6">
          <button onClick={onDelete} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105" style={{ borderColor: 'hsl(0,70%,88%)', color: 'hsl(0,70%,52%)', background: 'hsl(0,70%,98%)' }}>
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' }}>
            <Pencil className="w-3.5 h-3.5" /> Edit Dentist
          </button>
        </div>
      </div>
    </div>
  )
}