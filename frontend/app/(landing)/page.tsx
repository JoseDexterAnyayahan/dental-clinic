import Navbar          from '@/components/landing/Navbar'
import HeroSection     from '@/components/landing/HeroSection'
import ServicesSection from '@/components/landing/ServicesSection'
import TeamSection     from '@/components/landing/TeamSection'
import Footer          from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <TeamSection />
      <Footer />
    </main>
  )
}