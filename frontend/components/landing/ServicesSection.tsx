import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Search, Zap, Sparkles, Sun,
  Shield, Activity, AlignCenter
} from 'lucide-react'

const services = [
  { icon: Search,      name: 'General Checkup',  desc: 'Routine exam and professional cleaning.',        price: '₱500',  duration: '30 mins' },
  { icon: Zap,         name: 'Tooth Extraction', desc: 'Safe and painless tooth removal.',               price: '₱800',  duration: '45 mins' },
  { icon: Sparkles,    name: 'Dental Cleaning',  desc: 'Deep cleaning and polishing.',                   price: '₱1,000',duration: '60 mins' },
  { icon: Sun,         name: 'Teeth Whitening',  desc: 'Professional whitening for a brighter smile.',   price: '₱3,500',duration: '90 mins' },
  { icon: Shield,      name: 'Dental Filling',   desc: 'Composite filling for cavities.',                price: '₱1,200',duration: '45 mins' },
  { icon: Activity,    name: 'Root Canal',        desc: 'Treatment for infected tooth pulp.',             price: '₱5,000',duration: '2 hrs'   },
  { icon: AlignCenter, name: 'Orthodontics',      desc: 'Braces and aligners for straight teeth.',       price: '₱8,000',duration: '60 mins' },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block text-sm font-medium text-brand-blue bg-blue-50 dark:bg-blue-950/30 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
            What We Offer
          </span>
          <h2 className="text-4xl lg:text-5xl text-brand-navy dark:text-white">
            Our Dental Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            From routine checkups to advanced procedures — we provide complete dental care for your whole family.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.name}
                className="group p-6 bg-white dark:bg-card rounded-2xl border border-blue-100 dark:border-border hover:border-brand-blue/40 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-lg text-brand-navy dark:text-white mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {service.desc}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-blue-50 dark:border-border">
                  <span className="text-brand-blue font-semibold text-sm">{service.price}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{service.duration}</span>
                </div>
              </div>
            )
          })}

          {/* Book CTA Card */}
          <div className="p-6 brand-gradient rounded-2xl text-white flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl mb-2">Ready to Book?</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Schedule your appointment online in just a few clicks.
              </p>
            </div>
            <Button
              asChild
              className="mt-6 bg-white text-brand-blue hover:bg-blue-50 font-semibold border-0 shadow-none"
            >
              <Link href="/client/register">Book Now</Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}