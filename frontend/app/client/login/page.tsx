'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

type Tab = 'login' | 'register'

function AuthContent() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>(() => {
    return searchParams.get('tab') === 'register' ? 'register' : 'login'
  })

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (branding) ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white"
        style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-white font-serif text-xl font-bold">D</span>
          </div>
          <div>
            <span className="font-serif text-xl font-bold">DentaCare</span>
            <p className="text-xs leading-none -mt-0.5 text-white/60">Dental Clinic</p>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-snug">
            Your smile,<br />our priority.
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-xs">
            Book appointments, manage your dental records, and stay on top of your oral health — all in one place.
          </p>

          {/* Decorative trust badges */}
          <div className="flex flex-col gap-3 mt-8">
            {[
              { icon: '🦷', text: 'Easy online appointment booking' },
              { icon: '📋', text: 'Access your dental records anytime' },
              { icon: '🔒', text: 'Your data is safe & private' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  {icon}
                </div>
                <span className="text-sm text-white/80">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6 text-white/40 text-xs">
          <span>© {new Date().getFullYear()} DentaCare</span>
          <a href="#" className="hover:text-white/70 transition">Privacy</a>
          <a href="#" className="hover:text-white/70 transition">Terms</a>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
            >
              <span className="text-white font-serif text-lg font-bold">D</span>
            </div>
            <div>
              <span className="font-serif text-xl" style={{ color: 'hsl(220,60%,15%)' }}>
                Denta<span style={{ color: 'hsl(213,94%,44%)' }}>Care</span>
              </span>
              <p className="text-xs leading-none -mt-0.5" style={{ color: 'hsl(213,20%,50%)' }}>
                Dental Clinic
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-8"
            style={{ background: 'hsl(213,30%,95%)' }}
          >
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                style={
                  tab === t
                    ? {
                        background: 'white',
                        color: 'hsl(220,60%,15%)',
                        boxShadow: '0 1px 6px rgba(59,130,246,0.12)',
                      }
                    : { color: 'hsl(220,20%,55%)' }
                }
              >
                {t === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'hsl(220,60%,15%)' }}>
              {tab === 'login' ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'hsl(220,15%,55%)' }}>
              {tab === 'login'
                ? 'Sign in to your DentaCare account.'
                : 'Create your free account today.'}
            </p>
          </div>

          {/* Forms */}
          {tab === 'login'
            ? <LoginForm    onSwitch={() => setTab('register')} />
            : <RegisterForm onSwitch={() => setTab('login')}    />
          }
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}