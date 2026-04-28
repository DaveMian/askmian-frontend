import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, Quote } from 'lucide-react'
import { useLang } from '@/lib/lang'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Sarah Al-Rashid',
    role: 'Business Consultant',
    image: '/img-person-1.jpg',
    text: 'Ask Mian made my visa process incredibly smooth. From the initial consultation to the final approval, their team was professional and responsive. I received my 60-day visa within 2 days.',
    rating: 5,
  },
  {
    name: 'Ahmed Hassan',
    role: 'Entrepreneur',
    image: '/img-person-2.jpg',
    text: 'The PRO services from Ask Mian saved my business countless hours. Their understanding of UAE regulations and prompt execution is outstanding. Highly recommended for any business owner.',
    rating: 5,
  },
  {
    name: 'Raj Patel',
    role: 'Marketing Director',
    image: '/img-person-3.jpg',
    text: 'I needed an urgent visa extension and Ask Mian delivered beyond expectations. Same-day processing and clear communication. They are now my go-to for all visa matters in the UAE.',
    rating: 5,
  },
]

export default function Testimonials() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-card', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="testimonials" className="w-full py-20 lg:py-28 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our <span className="text-gold">Clients</span> Say
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
            Real experiences from real clients who trusted us with their UAE visa needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card relative p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold/30 card-lift transition-all duration-300">
              <Quote size={32} className="text-gold/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
