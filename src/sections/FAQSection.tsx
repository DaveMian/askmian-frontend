import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus, MessageCircle } from 'lucide-react'
import { useLang } from '@/lib/lang'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  { question: 'How long does visa processing take?', answer: 'Standard visa processing takes 5 business days from the date we receive all required documents and payment. This allows time for document verification, application submission to immigration authorities, and approval processing.' },
  { question: 'What documents are required?', answer: 'For a UAE visit visa, you need three documents: (1) A clear passport copy with minimum 6 months validity, (2) A passport-sized photograph with white background, and (3) A 6-month bank statement. Upload these via WhatsApp or our Telegram bot after submitting your application.' },
  { question: 'Can I extend my visa inside the UAE?', answer: 'Yes, you can extend your visit visa while inside the UAE without leaving the country. We offer visa extension services starting from AED 1,100. We recommend starting the extension process at least 5 days before your current visa expires.' },
  { question: 'What happens if my visa is rejected?', answer: 'In the rare event of a visa rejection, we will first analyze the reason and guide you on the best course of action. Depending on the rejection reason and processing stage, a partial refund may be issued. This may include reapplying with corrected documents or exploring alternative visa options.' },
  { question: 'Can I apply from inside the UAE?', answer: 'Yes, you can apply for a new visa or extend your existing visa while inside the UAE. We offer inside-country status change services that allow you to switch visa types without leaving the country.' },
  { question: 'What payment methods do you accept?', answer: 'We accept four payment methods: (1) Card payment via Stripe, (2) Bank transfer to our FAB account, (3) Cash payment at our Abu Dhabi office, and (4) Payment via WhatsApp. Choose your preferred method during the application process.' },
  { question: 'Is there a refund policy?', answer: 'Yes. If your visa application is rejected by immigration authorities, we offer a partial refund based on the processing stage. Refunds for bank transfers and card payments are processed within 7-14 business days. Contact us for specific refund terms based on your situation.' },
]

export default function FAQSection() {
  const { t } = useLang()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-item', { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section ref={sectionRef} id="faq" className="w-full py-20 lg:py-28 bg-neutral-950">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">Got Questions?</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Frequently Asked</h2>
            <p className="text-white/50 text-base sm:text-lg">
              Find answers to common questions about our visa and PRO services.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <div key={i} className="faq-item rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden transition-colors duration-300 hover:border-white/20">
                  <button onClick={() => toggle(i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                    <span className={`font-medium text-sm sm:text-base transition-colors ${isOpen ? 'text-gold' : 'text-white'}`}>{faq.question}</span>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-gold text-black rotate-45' : 'bg-white/5 text-white/60'}`}>
                      <Plus size={16} />
                    </div>
                  </button>
                  <div className="overflow-hidden transition-all duration-300 ease-out" style={{ maxHeight: isOpen ? '400px' : '0', opacity: isOpen ? 1 : 0 }}>
                    <div className="px-5 pb-5">
                      <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-10 text-center p-6 rounded-xl bg-gold/5 border border-gold/20">
            <p className="text-white font-medium mb-2">Still have questions?</p>
            <p className="text-white/50 text-sm mb-4">Our team is here to help you.</p>
            <a href="https://wa.me/971558689543" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black font-semibold text-sm rounded-lg hover:bg-gold-dark transition-colors">
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
