'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Stethoscope, ShieldCheck } from 'lucide-react'
import { adminLogin } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await adminLogin(form)
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.message ||
        'Invalid credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white"
        style={{ background: 'linear-gradient(135deg, hsl(220,60%,12%) 0%, hsl(220,60%,22%) 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold">DentaCare</span>
            <p className="text-xs text-white/60">Admin Portal</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold leading-snug">Clinic Management<br />Dashboard</h1>
          <p className="text-white/70 max-w-xs leading-relaxed">
            Manage appointments, patients, dentists and clinic operations from one place.
          </p>
          <div className="flex flex-col gap-3 mt-6">
            {['Full appointment management','Patient & dentist records','Real-time status updates'].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'hsl(213,94%,60%)' }} />
                <span className="text-sm text-white/75">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} DentaCare. Staff access only.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}>
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl" style={{ color: 'hsl(220,60%,15%)' }}>
              Denta<span style={{ color: 'hsl(213,94%,44%)' }}>Care</span>
            </span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold" style={{ color: 'hsl(220,60%,15%)' }}>Admin sign in</h2>
            <p className="text-sm mt-1" style={{ color: 'hsl(220,15%,55%)' }}>Restricted to clinic staff only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'email',    label: 'Email address', type: 'email',    placeholder: 'admin@dentacare.com' },
              { name: 'password', label: 'Password',      type: 'password', placeholder: '••••••••'           },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1" style={{ color: 'hsl(220,30%,35%)' }}>{label}</label>
                <input
                  type={type} name={name} required
                  value={form[name as keyof typeof form]}
                  onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400 transition placeholder-gray-400"
                  style={{ borderColor: 'hsl(213,30%,88%)' }}
                />
              </div>
            ))}

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all
                         disabled:opacity-60 active:scale-[.98] mt-1"
              style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}