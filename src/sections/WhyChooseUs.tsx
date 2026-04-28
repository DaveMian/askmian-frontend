import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Zap, ShieldCheck, Banknote, Headphones } from 'lucide-react'
import { useLang } from '@/lib/lang'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: Zap, title: 'Fast Visa Processing', description: 'Get your UAE visa approved in as little as 24-48 hours with our streamlined process and direct immigration connections.' },
  { icon: ShieldCheck, title: 'High Approval Support', description: 'Our expert team reviews every application thoroughly to ensure the highest possible approval rate for your visa.' },
  { icon: Banknote, title: 'Transparent Fees', description: 'No hidden charges or surprise costs. We provide clear, upfront pricing so you know exactly what you are paying for.' },
  { icon: Headphones, title: 'Dedicated Support Team', description: 'Our multilingual support team is available to assist you at every step, from application to visa delivery.' },
]

export default function WhyChooseUs() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.wcu-card', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full py-20 lg:py-28 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Trusted by Thousands</h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
            We make UAE visa processing simple, fast, and hassle-free with professional support at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="wcu-card group p-6 lg:p-8 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold/40 card-lift transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
