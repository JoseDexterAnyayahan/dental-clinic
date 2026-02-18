import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg">
                <span className="text-white font-serif text-lg font-bold">D</span>
              </div>
              <span className="font-serif text-xl">
                Denta<span className="text-brand-sky">Care</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Providing exceptional dental care with a gentle touch since 2009.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Services', 'Our Team', 'About'].map((item) => (
                <li key={item}>
                <a  
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-white/60 text-sm hover:text-brand-sky transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/client/login" className="text-white/60 text-sm hover:text-brand-sky transition-colors">
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg">Contact Us</h4>
            <ul className="space-y-3">
              {[
                { icon: Phone,  text: '+63 912 345 6789'         },
                { icon: Mail,   text: 'hello@dentacare.com'       },
                { icon: MapPin, text: '123 Dental St., Manila'    },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-white/60 text-sm">
                  <Icon className="w-4 h-4 text-brand-sky shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg">Clinic Hours</h4>
            <ul className="space-y-2">
              {[
                { day: 'Mon – Fri',  time: '8:00 AM – 6:00 PM' },
                { day: 'Saturday',   time: '9:00 AM – 4:00 PM' },
                { day: 'Sunday',     time: 'Closed'             },
              ].map(({ day, time }) => (
                <li key={day} className="flex items-start gap-3 text-sm">
                  <Clock className="w-4 h-4 text-brand-sky shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/90 font-medium">{day}</span>
                    <span className="text-white/50 ml-2">{time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} DentaCare Clinic. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 text-sm hover:text-brand-sky transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 text-sm hover:text-brand-sky transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}