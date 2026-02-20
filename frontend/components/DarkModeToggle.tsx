'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/DarkModeProvider'

export default function DarkModeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
      style={{
        background: theme === 'dark' ? 'hsl(220,30%,20%)' : 'hsl(213,30%,95%)',
      }}
      title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    >
      {theme === 'dark'
        ? <Sun  className="w-4 h-4" style={{ color: 'hsl(38,92%,65%)' }} />
        : <Moon className="w-4 h-4" style={{ color: 'hsl(220,30%,45%)' }} />
      }
    </button>
  )
}