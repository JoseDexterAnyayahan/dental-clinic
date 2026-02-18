'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home',     href: '#home'     },
  { label: 'Services', href: '#services' },
  { label: 'Our Team', href: '#team'     },
  { label: 'Contact',  href: '#contact'  },
]

export default function Navbar() {
  const [isOpen,     setIsOpen]     = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        right:      0,
        zIndex:     50,
        transition: 'all 0.3s ease',
        padding:    isScrolled ? '12px 0' : '20px 0',
        background: isScrolled
          ? 'rgba(255,255,255,0.9)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        boxShadow: isScrolled ? '0 1px 20px rgba(59,130,246,0.08)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(59,130,246,0.12)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)',
              }}
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
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: 'hsl(220,30%,35%)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color      = 'hsl(213,94%,44%)'
                  e.currentTarget.style.background = 'hsl(213,60%,97%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color      = 'hsl(220,30%,35%)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/client/login"
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: 'hsl(213,94%,44%)' }}
            >
              Sign In
            </Link>
            <Link
              href="/client/register"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-lg transition-all hover:scale-105"
              style={{
                background:  'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)',
                boxShadow:   '0 4px 15px rgba(59,130,246,0.3)',
              }}
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen
              ? <X    className="w-5 h-5" style={{ color: 'hsl(213,94%,44%)' }} />
              : <Menu className="w-5 h-5" style={{ color: 'hsl(220,30%,35%)' }} />
            }
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden mt-4 pb-4"
            style={{ borderTop: '1px solid hsl(213,30%,90%)' }}
          >
            <nav className="flex flex-col gap-1 mt-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: 'hsl(220,30%,35%)' }}
                >
                  {link.label}
                </a>
              ))}

              <div className="flex flex-col gap-2 mt-4 px-1">
                <Link
                  href="/client/login"
                  className="px-4 py-2.5 text-sm font-medium rounded-xl text-center border transition-colors"
                  style={{
                    borderColor: 'hsl(213,94%,44%)',
                    color:       'hsl(213,94%,44%)',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/client/register"
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl text-center text-white"
                  style={{
                    background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)',
                  }}
                >
                  Book Appointment
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}