'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CalendarDays, Shield, Star, Clock } from 'lucide-react'

const stats = [
  { label: 'Happy Patients',    value: '5,000+' },
  { label: 'Years Experience',  value: '15+'    },
  { label: 'Expert Dentists',   value: '8'      },
  { label: 'Services Offered',  value: '20+'    },
]

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 brand-gradient-light -z-10" />
      <div className="absolute top-0 right-0 w-150 h-150 rounded-full bg-blue-400/10 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-150 h-150  rounded-full bg-sky-400/10 blur-3xl -z-10" />

      {/* Decorative circles */}
      <div className="absolute top-32 right-10 w-64 h-64 rounded-full border border-blue-200/40 -z-10" />
      <div className="absolute top-48 right-20 w-40 h-40 rounded-full border border-blue-300/30 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 border border-blue-200 rounded-full px-4 py-2 text-sm shadow-sm">
              <Star className="w-4 h-4 text-brand-blue fill-brand-blue" />
              <span className="text-brand-navy font-medium">Trusted Dental Care Since 2009</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl leading-tight text-brand-navy">
                Your Smile,{' '}
                <span className="italic text-brand-gradient">
                  Our Passion
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Experience world-class dental care in a comfortable, modern environment.
                Book your appointment online in minutes — we'll take care of the rest.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="brand-gradient text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all px-8"
              >
                <Link href="/client/register">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Book Appointment
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-brand-blue text-brand-blue hover:bg-blue-50 px-8"
              >
                <Link href="#services">Explore Services</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: Shield, text: 'Safe & Sterile' },
                { icon: Clock,  text: 'Easy Scheduling' },
                { icon: Star,   text: '5-Star Rated'    },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-brand-blue" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Stats Card */}
          <div className="relative animate-fade-in">
            <div className="relative glass-light rounded-3xl p-8 shadow-2xl shadow-blue-200/50 border border-blue-100">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-5 bg-white/70 rounded-2xl border border-blue-100 hover:border-brand-blue/30 hover:shadow-md transition-all"
                  >
                    <p className="text-3xl font-serif text-brand-blue font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Floating appointment card */}
              <div className="mt-6 p-4 brand-gradient rounded-2xl text-white">
                <p className="text-sm font-medium opacity-90">Next Available Slot</p>
                <p className="text-xl font-serif mt-1">Today at 2:00 PM</p>
                <p className="text-sm opacity-75 mt-0.5">General Checkup · Dr. Santos</p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg shadow-blue-200/50 border border-blue-100 px-4 py-3">
              <p className="text-xs text-muted-foreground">Satisfaction Rate</p>
              <p className="text-2xl font-serif text-brand-blue font-bold">98%</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}