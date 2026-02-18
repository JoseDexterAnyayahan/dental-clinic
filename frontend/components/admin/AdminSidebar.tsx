'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, CalendarDays, Users, UserCog,
  Stethoscope, Settings, LogOut, Menu, X,
  ChevronRight, ChevronLeft, Wrench,
} from 'lucide-react'
import { adminLogout } from '@/lib/auth'

const navItems = [
  { label: 'Dashboard',    href: '/admin/dashboard',              icon: LayoutDashboard, description: 'Overview & stats',    exact: true  },
  { label: 'Appointments', href: '/admin/dashboard/appointments', icon: CalendarDays,    description: 'Manage all visits',   exact: false },
  { label: 'Clients',      href: '/admin/dashboard/clients',      icon: Users,           description: 'Patient records',     exact: false },
  { label: 'Dentists',     href: '/admin/dashboard/dentists',     icon: UserCog,         description: 'Staff management',    exact: false },
  { label: 'Services',     href: '/admin/dashboard/services',     icon: Stethoscope,     description: 'Procedures & pricing',exact: false },
  { label: 'Schedules',    href: '/admin/dashboard/schedules',    icon: Wrench,          description: 'Availability slots',  exact: false },
]

export default function AdminSidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [open,       setOpen]       = useState(false)
  const [collapsed,  setCollapsed]  = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [hovered,    setHovered]    = useState<string | null>(null)

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const handleLogout = async () => {
    setLoggingOut(true)
    await adminLogout()
    router.push('/admin/login')
  }

  const NavLinks = () => (
    <div className="space-y-0.5">
      {navItems.map(({ label, href, icon: Icon, description, exact }) => {
        const active  = isActive(href, exact)
        const isHover = hovered === href
        return (
          <div key={href} className="relative">
            <Link
              href={href}
              onMouseEnter={() => setHovered(href)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setOpen(false)}
              className="flex items-center rounded-xl transition-all duration-200 relative overflow-hidden"
              style={{
                gap:            collapsed ? 0 : '10px',
                padding:        collapsed ? '10px 0' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background:     active
                  ? 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)'
                  : isHover ? 'hsl(213,40%,96%)' : 'transparent',
                boxShadow: active ? '0 4px 12px rgba(59,130,246,0.2)' : 'none',
              }}
            >
              {/* Left accent bar when hovered but not active */}
              {isHover && !active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: 'hsl(213,94%,44%)' }}
                />
              )}

              <Icon
                style={{
                  width: '17px', height: '17px', flexShrink: 0,
                  color: active ? 'white' : isHover ? 'hsl(213,94%,44%)' : 'hsl(220,15%,58%)',
                }}
              />

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <span
                    className="block text-sm leading-tight truncate"
                    style={{
                      fontWeight: active ? 600 : 500,
                      color:      active ? 'white' : isHover ? 'hsl(220,60%,20%)' : 'hsl(220,20%,40%)',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="block text-xs truncate mt-0.5"
                    style={{ color: active ? 'rgba(255,255,255,0.65)' : 'hsl(220,15%,65%)' }}
                  >
                    {description}
                  </span>
                </div>
              )}

              {!collapsed && active && (
                <ChevronRight style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
              )}
            </Link>

            {/* Collapsed tooltip */}
            {collapsed && isHover && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-xl
                           text-xs font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none"
                style={{ background: 'hsl(220,60%,15%)', color: 'white' }}
              >
                {label}
                <div
                  className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                  style={{ borderRightColor: 'hsl(220,60%,15%)' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      {/* ── Desktop ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 border-r bg-white h-screen sticky top-0 transition-all duration-300"
        style={{ width: collapsed ? '72px' : '240px', borderColor: 'hsl(213,30%,90%)' }}
      >
        {/* Logo */}
        <div
          className="flex items-center border-b transition-all duration-300"
          style={{
            borderColor:    'hsl(213,30%,90%)',
            padding:        collapsed ? '20px 0' : '20px 20px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            minHeight:      '72px',
          }}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0
                         transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
            >
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-serif text-lg block leading-tight" style={{ color: 'hsl(220,60%,15%)' }}>
                  Denta<span style={{ color: 'hsl(213,94%,44%)' }}>Care</span>
                </span>
                <p className="text-xs leading-none" style={{ color: 'hsl(213,20%,55%)' }}>
                  Admin Portal
                </p>
              </div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: collapsed ? '16px 8px' : '16px 10px' }}>
          {!collapsed && (
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-3"
              style={{ color: 'hsl(213,20%,65%)' }}>
              Navigation
            </p>
          )}
          <NavLinks />
        </nav>

        {/* Bottom */}
        <div className="border-t" style={{ borderColor: 'hsl(213,30%,90%)', padding: collapsed ? '12px 8px' : '12px 10px' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center rounded-xl transition-all hover:bg-gray-50 mb-1"
            style={{ gap: collapsed ? 0 : '10px', padding: collapsed ? '8px 0' : '8px 12px', justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'hsl(213,30%,94%)' }}>
              {collapsed
                ? <ChevronRight className="w-3.5 h-3.5" style={{ color: 'hsl(220,30%,45%)' }} />
                : <ChevronLeft  className="w-3.5 h-3.5" style={{ color: 'hsl(220,30%,45%)' }} />
              }
            </div>
            {!collapsed && <span className="text-xs font-medium" style={{ color: 'hsl(220,20%,50%)' }}>Collapse</span>}
          </button>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center rounded-xl transition-all hover:bg-red-50 disabled:opacity-50"
            style={{ gap: collapsed ? 0 : '10px', padding: collapsed ? '8px 0' : '8px 12px', justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(0,65%,52%)' }} />
            {!collapsed && (
              <span className="text-sm font-medium" style={{ color: 'hsl(0,65%,52%)' }}>
                {loggingOut ? 'Signing out…' : 'Sign out'}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b"
        style={{ borderColor: 'hsl(213,30%,90%)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
          >
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-base" style={{ color: 'hsl(220,60%,15%)' }}>
            Denta<span style={{ color: 'hsl(213,94%,44%)' }}>Care</span>
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'hsl(213,30%,95%)' }}
        >
          <Menu className="w-4 h-4" style={{ color: 'hsl(220,30%,35%)' }} />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`lg:hidden fixed inset-0 z-50 flex transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className="relative w-72 bg-white h-full shadow-2xl flex flex-col transition-transform duration-300"
          style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: 'hsl(213,30%,90%)' }}>
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)' }}
              >
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-serif text-lg" style={{ color: 'hsl(220,60%,15%)' }}>
                  Denta<span style={{ color: 'hsl(213,94%,44%)' }}>Care</span>
                </span>
                <p className="text-xs" style={{ color: 'hsl(213,20%,55%)' }}>Admin Portal</p>
              </div>
            </Link>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(213,30%,95%)' }}>
              <X className="w-4 h-4" style={{ color: 'hsl(220,30%,40%)' }} />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <NavLinks />
          </nav>
          <div className="px-3 py-4 border-t" style={{ borderColor: 'hsl(213,30%,90%)' }}>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" style={{ color: 'hsl(0,65%,52%)' }} />
              <span className="text-sm font-medium" style={{ color: 'hsl(0,65%,52%)' }}>
                {loggingOut ? 'Signing out…' : 'Sign out'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}