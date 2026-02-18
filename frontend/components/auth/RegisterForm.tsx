'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientRegister } from '@/lib/auth'
import { CheckCircle } from 'lucide-react'

interface Props {
  onSwitch: () => void
}

export default function RegisterForm({ onSwitch }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)   // ← new

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[e.target.name]
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await clientRegister(form)

      // 1. Show success toast
      setSuccess(true)

      // 2. After 2s, switch to Sign in tab
      setTimeout(() => {
        setSuccess(false)
        onSwitch()           // goes back to login tab
      }, 2000)

    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors
      if (apiErrors) {
        const flat: Record<string, string> = {}
        Object.entries(apiErrors).forEach(([key, val]) => {
          flat[key] = Array.isArray(val) ? (val as string[])[0] : String(val)
        })
        setErrors(flat)
      } else {
        setErrors({
          general:
            err?.response?.data?.message || 'Registration failed. Please try again.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const fields: {
    name: keyof typeof form
    label: string
    type: string
    placeholder: string
    autoComplete: string
  }[] = [
    { name: 'name',                  label: 'Full name',        type: 'text',     placeholder: 'Juan dela Cruz', autoComplete: 'name'         },
    { name: 'email',                 label: 'Email address',    type: 'email',    placeholder: 'you@example.com', autoComplete: 'email'       },
    { name: 'password',              label: 'Password',         type: 'password', placeholder: '••••••••',        autoComplete: 'new-password' },
    { name: 'password_confirmation', label: 'Confirm password', type: 'password', placeholder: '••••••••',        autoComplete: 'new-password' },
  ]

  return (
    <>
      {/* ── Success Toast ── */}
      <div
        className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl transition-all duration-500"
        style={{
          background:  'hsl(220,60%,15%)',
          color:       'white',
          transform:   success ? 'translateY(0)' : 'translateY(-120%)',
          opacity:     success ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Account created!</p>
          <p className="text-xs text-white/60">Redirecting you to sign in…</p>
        </div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, label, type, placeholder, autoComplete }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              autoComplete={autoComplete}
              required
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50
                          focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                          transition placeholder-gray-400
                          ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors[name] && (
              <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
            )}
          </div>
        ))}

        {errors.general && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
            {errors.general}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all
                     disabled:opacity-60 disabled:cursor-not-allowed mt-1 active:scale-[.98]"
          style={{
            background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)',
          }}
        >
          {loading ? 'Creating account…' : success ? '✓ Account created!' : 'Create account'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium hover:underline transition"
            style={{ color: 'hsl(213,94%,44%)' }}
          >
            Sign in
          </button>
        </p>
      </form>
    </>
  )
}