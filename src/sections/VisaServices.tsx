import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CalendarDays, FileText, Clock, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '@/lib/lang'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    title: '30-Day Visit Visa',
    icon: CalendarDays,
    price: 'AED 1,200',
    processing: '5 business days',
    requirements: ['Passport Copy', 'Passport Photo', 'Bank Statement'],
    popular: false,
  },
  {
    title: '60-Day Visit Visa',
    icon: FileText,
    price: 'AED 1,800',
    processing: '5 business days',
    requirements: ['Passport Copy', 'Passport Photo', 'Bank Statement'],
    popular: true,
  },
  {
    title: 'Visa Extension',
    icon: RotateCcw,
    price: 'AED 1,100',
    processing: '5 business days',
    requirements: ['Current Visa Copy', 'Passport Copy'],
    popular: false,
  },
  {
    title: 'Inside Country Status Change',
    icon: Clock,
    price: 'Price on Request',
    processing: '5 business days',
    requirements: ['Passport Copy', 'Current Visa Copy'],
    popular: false,
  },
]

export default function VisaServices() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.visa-card', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="w-full py-20 lg:py-28 bg-neutral-950">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">Our Services</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">UAE Visa Services</h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
            Choose from our range of visa services designed to meet your travel and stay requirements in the UAE.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.title} className={`visa-card relative p-6 rounded-xl border transition-all duration-300 card-lift ${
                service.popular ? 'bg-gold/5 border-gold/40' : 'bg-white/[0.02] border-white/10 hover:border-gold/30'
              }`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Most Popular
                  </div>
                )}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.popular ? 'bg-gold/20' : 'bg-white/5'}`}>
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                <div className="mb-4">
                  <p className="text-gold font-bold text-lg">{service.price}</p>
                  <p className="text-white/40 text-xs mt-1">Processing: {service.processing}</p>
                </div>
                <div className="border-t border-white/10 pt-4 mb-5">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Requirements</p>
                  <ul className="space-y-1.5">
                    {service.requirements.map((req) => (
                      <li key={req} className="flex items-center gap-2 text-white/70 text-sm">
                        <CheckCircle2 size={14} className="text-gold flex-shrink-0" />{req}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/apply" className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-colors ${
                  service.popular ? 'bg-gold text-black hover:bg-gold-dark' : 'bg-white/10 text-white hover:bg-white/20'
                }`}>
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
