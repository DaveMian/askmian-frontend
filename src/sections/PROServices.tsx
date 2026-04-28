import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Building2, FileCheck, Users, Briefcase, CreditCard, FileText, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '@/lib/lang'

gsap.registerPlugin(ScrollTrigger)

const proServices = [
  { icon: Building2, title: 'Business Setup', description: 'Complete company formation services including mainland, free zone, and offshore setups.' },
  { icon: FileCheck, title: 'Trade License Renewals', description: 'Hassle-free renewal of your trade license with timely reminders and document handling.' },
  { icon: FileText, title: 'Document Clearing', description: 'Efficient document attestation, translation, and government approval processing.' },
  { icon: Users, title: 'Family Visa Assistance', description: 'Sponsor your family members with our complete family visa processing services.' },
  { icon: Briefcase, title: 'Immigration Services', description: 'Full immigration support including entry permits, residence visas, and Emirates ID.' },
  { icon: CreditCard, title: 'Emirates ID Assistance', description: 'Quick and efficient Emirates ID application, renewal, and replacement services.' },
]

export default function PROServices() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pro-card', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="pro-services" className="w-full py-20 lg:py-28 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">Professional Services</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">PRO Services</h2>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive business and government services tailored to your needs in the UAE.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {proServices.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.title} className="pro-card group p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold/30 card-lift transition-all duration-300">
                  <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon size={22} className="text-gold" />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{service.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{service.description}</p>
                  <Link to="/contact" className="inline-flex items-center gap-1.5 text-gold text-sm font-medium hover:text-gold-light transition-colors">
                    Get Quote <ArrowRight size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
