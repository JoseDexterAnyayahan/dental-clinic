'use client'

import { useState } from 'react'
import { User, Mail, Phone, Calendar, MapPin, Loader2, CheckCircle2 } from 'lucide-react'
import api from '@/lib/api'
import ProfileField from './ProfileField'
import ProfileSection from './ProfileSection'

interface FormData {
  name: string; email: string; phone: string
  birthdate: string; gender: string; address: string
}

interface Props {
  initial: FormData
  onUpdated: (name: string, email: string) => void
}

export default function PersonalInfoForm({ initial, onUpdated }: Props) {
  const [form,    setForm]    = useState<FormData>(initial)
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState('')
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  const set = (field: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    setErrors({})
    setSuccess('')
    try {
      const res = await api.put('/client/profile', form)
      onUpdated(res.data.user.name, res.data.user.email)
      setSuccess('Profile updated successfully.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setErrors(err?.response?.data?.errors ?? {})
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProfileSection title="Personal Information" subtitle="Update your name, email and contact details">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <ProfileField label="Full Name"  value={form.name}      onChange={(v) => set('name', v)}      icon={User}     placeholder="Juan Dela Cruz"    error={errors.name}      />
        <ProfileField label="Email"      value={form.email}     onChange={(v) => set('email', v)}     icon={Mail}     type="email" placeholder="juan@email.com" error={errors.email} />
        <ProfileField label="Phone"      value={form.phone}     onChange={(v) => set('phone', v)}     icon={Phone}    placeholder="+63 9xx xxx xxxx"  error={errors.phone}     />
        <ProfileField label="Birthdate"  value={form.birthdate} onChange={(v) => set('birthdate', v)} icon={Calendar} type="date"                        error={errors.birthdate} />
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>Gender</label>
        <div className="flex gap-2">
          {['male', 'female', 'other'].map((g) => (
            <button
              key={g}
              onClick={() => set('gender', g)}
              className="px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
              style={form.gender === g
                ? { background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', color: 'white' }
                : { background: 'hsl(213,30%,96%)', color: 'hsl(220,15%,55%)', border: '1px solid hsl(213,30%,88%)' }
              }
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="mb-5">
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'hsl(220,60%,15%)' }}>Address</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-3.5 h-3.5" style={{ color: 'hsl(220,15%,60%)' }} />
          <textarea
            rows={2}
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Street, Barangay, City, Province"
            className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
            style={{ borderColor: 'hsl(213,30%,88%)', background: 'hsl(213,30%,97%)', color: 'hsl(220,30%,30%)' }}
          />
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: 'hsl(142,72%,94%)', color: 'hsl(142,72%,28%)' }}>
          <CheckCircle2 className="w-3.5 h-3.5" /> {success}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
          style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </ProfileSection>
  )
}