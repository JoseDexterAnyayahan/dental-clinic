'use client'

import { useState } from 'react'
import { Shield, Loader2, CheckCircle2 } from 'lucide-react'
import api from '@/lib/api'
import ProfileField from './ProfileField'
import ProfileSection from './ProfileSection'

interface PasswordForm {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

const INITIAL: PasswordForm = {
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
}

export default function ChangePasswordForm() {
  const [form,    setForm]    = useState<PasswordForm>(INITIAL)
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState('')
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  const handleSave = async () => {
    setSaving(true)
    setErrors({})
    setSuccess('')
    try {
      await api.put('/client/profile', form)
      setForm(INITIAL)
      setSuccess('Password changed successfully.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      const data = err?.response?.data
      if (data?.message) setErrors({ current_password: data.message })
      else setErrors(data?.errors ?? {})
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProfileSection title="Change Password" subtitle="Keep your account secure with a strong password">
      <div className="space-y-4 mb-5">
        <ProfileField
          label="Current Password" type="password" icon={Shield}
          value={form.current_password}
          onChange={(v) => setForm((p) => ({ ...p, current_password: v }))}
          placeholder="Enter current password"
          error={errors.current_password}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <ProfileField
            label="New Password" type="password" icon={Shield}
            value={form.new_password}
            onChange={(v) => setForm((p) => ({ ...p, new_password: v }))}
            placeholder="Min. 8 characters"
            error={errors.new_password}
          />
          <ProfileField
            label="Confirm New Password" type="password" icon={Shield}
            value={form.new_password_confirmation}
            onChange={(v) => setForm((p) => ({ ...p, new_password_confirmation: v }))}
            placeholder="Repeat new password"
            error={errors.new_password_confirmation}
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
          disabled={saving || !form.current_password || !form.new_password}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
          style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </ProfileSection>
  )
}