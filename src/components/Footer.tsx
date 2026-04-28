import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react'
import { useLang } from '@/lib/lang'

export default function Footer() {
  const { t } = useLang()

  const quickLinks = [
    { label: t('nav_home'), href: '/' },
    { label: t('nav_apply'), href: '/apply' },
    { label: t('nav_how'), href: '/#how-it-works' },
    { label: t('nav_faq'), href: '/#faq' },
    { label: t('nav_contact'), href: '/contact' },
  ]

  return (
    <footer className="w-full bg-black border-t border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-white font-bold text-xl tracking-tight">
                Ask <span className="text-gold">Mian</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              {t('ft_tagline')}
            </p>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/971558689543" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center hover:bg-gold/20 transition-colors">
                <Phone size={16} className="text-gold" />
              </a>
              <a href="mailto:askmian.llc@gmail.com"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Mail size={16} className="text-white/50" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{t('ft_links')}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/40 text-sm hover:text-gold transition-colors flex items-center gap-1.5">
                    {link.label} <ExternalLink size={10} className="opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{t('ft_contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <MapPin size={15} className="mt-0.5 text-gold flex-shrink-0" />
                <span>Abu Dhabi, UAE</span>
              </li>
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <Phone size={15} className="mt-0.5 text-gold flex-shrink-0" />
                <span>+971 55 868 9543</span>
              </li>
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <Mail size={15} className="mt-0.5 text-gold flex-shrink-0" />
                <span>askmian.llc@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <Clock size={15} className="mt-0.5 text-gold flex-shrink-0" />
                <span>Mon - Fri: 9:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{t('ft_trade')}</h4>
            <p className="text-white/40 text-sm mb-2">Trade License: <span className="text-white/60">5038098</span></p>
            <p className="text-white/40 text-sm">ASK MIAN LLC</p>
            <p className="text-white/30 text-xs mt-4">Abu Dhabi, United Arab Emirates</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Ask Mian LLC. {t('ft_rights')}
          </p>
          <p className="text-white/20 text-xs">
            Trade License 5038098 | Abu Dhabi, UAE
          </p>
        </div>
      </div>
    </footer>
  )
}
