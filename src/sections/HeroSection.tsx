import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, MessageCircle, FileText, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { useLang } from '@/lib/lang'

export default function HeroSection() {
  const { t } = useLang()
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.hero-h1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 })
      gsap.fromTo('.hero-p', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.6 })
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.8 })
      gsap.fromTo('.hero-trust', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power3.out', delay: 1 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/hero-dubai.jpg" alt="Dubai skyline" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-gold/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-gold text-xs sm:text-sm font-medium tracking-wide">UAE Visa & PRO Services</span>
          </div>

          <h1 className="hero-h1 text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Your UAE Journey <span className="text-gold">Starts Here</span>
          </h1>

          <p className="hero-p text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Fast and reliable UAE visa processing and professional PRO services with transparent pricing and expert support.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link to="/apply"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-bold text-base rounded-lg hover:bg-gold-dark transition-colors shadow-gold">
              <FileText size={18} /> Apply Now <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/971558689543" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-base rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <MessageCircle size={18} /> WhatsApp Us
            </a>
          </div>

          <div className="hero-trust flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {['Fast Processing', 'Transparent Pricing', 'Secure Application', 'UAE Support'].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 text-white/60 text-sm">
                <CheckCircle size={14} className="text-gold" />{badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
