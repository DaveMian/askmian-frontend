import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useLang } from '@/lib/lang'

export default function CTABanner() {
  const { t } = useLang()
  return (
    <section className="w-full py-16 lg:py-20 bg-gold/5 border-y border-gold/20">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('cta_title').split('UAE')[0]}<span className="text-gold">UAE{t('cta_title').split('UAE')[1]}</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            {t('cta_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/apply"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-bold text-base rounded-lg hover:bg-gold-dark transition-colors shadow-gold">
              {t('cta_apply')} <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/971558689543" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold text-base rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <MessageCircle size={18} /> {t('cta_whatsapp')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
