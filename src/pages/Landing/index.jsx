import HeroSection from './sections/HeroSection'
import HowItWorks from './sections/HowItWorks'
import Benefits from './sections/Benefits'
import CTASection from './sections/CTASection'
import Navbar from './sections/Navbar'
import Footer from './sections/Footer'

function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Benefits />
      <CTASection />
      <Footer />
    </main>
  )
}

export default LandingPage