'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import ClientHeader from '@/components/client/ClientHeader'
import ProfileBanner from '@/components/client/profile/ProfileBanner'
import PersonalInfoForm from '@/components/client/profile/PersonalInfoForm'
import ChangePasswordForm from '@/components/client/profile/ChangePasswordForm'

interface ProfileData {
  name: string
  email: string
  client?: {
    phone?: string
    birthdate?: string
    gender?: string
    address?: string
  }
}

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/client/profile')
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
        <ClientHeader title="My Profile" subtitle="Manage your personal information" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border h-48 animate-pulse"
              style={{ borderColor: 'hsl(213,30%,91%)' }} />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      <ClientHeader title="My Profile" subtitle="Manage your personal information" />
      <div className="space-y-5">
        <ProfileBanner
          name={profile?.name ?? ''}
          email={profile?.email ?? ''}
        />
        <PersonalInfoForm
          initial={{
            name:      profile?.name      ?? '',
            email:     profile?.email     ?? '',
            phone:     profile?.client?.phone     ?? '',
            birthdate: profile?.client?.birthdate ?? '',
            gender:    profile?.client?.gender    ?? '',
            address:   profile?.client?.address   ?? '',
          }}
          onUpdated={(name, email) =>
            setProfile((p) => p ? { ...p, name, email } : p)
          }
        />
        <ChangePasswordForm />
      </div>
    </main>
  )
}