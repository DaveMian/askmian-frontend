import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Upload, CreditCard, Search, BadgeCheck } from 'lucide-react'
import { useLang } from '@/lib/lang'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { number: '01', icon: Upload, title: 'Upload Documents', description: 'Submit your passport copy, passport photo, and 6-month bank statement via WhatsApp or Telegram.' },
  { number: '02', icon: CreditCard, title: 'Make Payment', description: 'Pay securely using card (Stripe), bank transfer, WhatsApp, or cash at our office.' },
  { number: '03', icon: Search, title: 'Processing & Verification', description: 'Our team reviews your documents and submits your application to immigration authorities.' },
  { number: '04', icon: BadgeCheck, title: 'Receive Your Visa', description: 'Get your approved visa delivered directly to your email or WhatsApp within 5 business days.' },
]

export default function HowItWorks() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.step-card', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="w-full py-20 lg:py-28 bg-neutral-950">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
            Four simple steps to get your UAE visa. Processing time: <span className="text-gold font-medium">5 business days</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="step-card relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] right-0 h-[2px] bg-gradient-to-r from-gold/40 to-transparent" />
                )}
                <div className="relative p-6 lg:p-8 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold/30 transition-all duration-300 text-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold text-black text-xs font-bold rounded-full">
                    {step.number}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-5 mt-3">
                    <Icon size={28} className="text-gold" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
