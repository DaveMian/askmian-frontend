import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react'
import { useLang } from '@/lib/lang'

export default function ContactPage() {
  const { t } = useLang()
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{t('ap_success_title')}</h2>
          <p className="text-white/60 mb-8">{t('ap_success_team')}</p>
          <a href="https://wa.me/971558689543" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">{t('nav_contact')}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t('ct_title')}</h1>
          <p className="text-white/50 text-base max-w-xl mx-auto">{t('ct_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 lg:p-8">
            <h2 className="text-white font-semibold text-lg mb-6">{t('ct_form_title')}</h2>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-1.5">{t('ct_name')}</label>
                <input type="text" required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1.5">{t('ct_email')}</label>
                <input type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1.5">{t('ct_phone')}</label>
                <input type="tel"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1.5">{t('ct_message')}</label>
                <textarea rows={4} required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none transition-colors resize-none" />
              </div>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition-colors">
                <Send size={16} /> {t('ct_send')}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold text-lg mb-5">{t('ct_info_title')}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t('ct_address')}</p>
                    <p className="text-white/40 text-sm mt-0.5">{t('ct_address_val')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t('ct_hours')}</p>
                    <p className="text-white/40 text-sm mt-0.5">{t('ct_hours_val')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t('ct_phone_lbl')}</p>
                    <a href="tel:+971558689543" className="text-gold text-sm mt-0.5 hover:underline">+971 55 868 9543</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t('ct_email_lbl')}</p>
                    <a href="mailto:askmian.llc@gmail.com" className="text-gold text-sm mt-0.5 hover:underline">askmian.llc@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold text-xs font-bold">#</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t('ct_license')}</p>
                    <p className="text-white/40 text-sm mt-0.5">5038098</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a href="https://wa.me/971558689543" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                <MessageCircle size={18} /> {t('ct_whatsapp_btn')}
              </a>
              <a href="tel:+971558689543"
                className="flex items-center justify-center gap-2 py-3.5 bg-white/5 text-white font-medium rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <Phone size={18} /> {t('ct_call_btn')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
