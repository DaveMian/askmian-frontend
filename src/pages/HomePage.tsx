import HeroSection from '../sections/HeroSection'
import WhyChooseUs from '../sections/WhyChooseUs'
import VisaServices from '../sections/VisaServices'
import PROServices from '../sections/PROServices'
import HowItWorks from '../sections/HowItWorks'
import CTABanner from '../sections/CTABanner'
import Testimonials from '../sections/Testimonials'
import FAQSection from '../sections/FAQSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <VisaServices />
      <CTABanner />
      <PROServices />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
    </>
  )
}
