'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientLogin } from '@/lib/auth'

interface Props {
  onSwitch: () => void
}

export default function LoginForm({ onSwitch }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { user } = await clientLogin(form)
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/client/portal')
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.message ||
        'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm
                     focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                     transition placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm
                     focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                     transition placeholder-gray-400"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[.98]
                   text-white font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-sky-500 font-medium hover:underline"
        >
          Create one
        </button>
      </p>
    </form>
  )
}