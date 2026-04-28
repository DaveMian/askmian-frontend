import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Globe } from 'lucide-react'
import { useLang } from '@/lib/lang'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang, setLang, t } = useLang()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    if (href.startsWith('/#')) return location.pathname === '/'
    return location.pathname === href
  }

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      if (location.pathname === '/') {
        e.preventDefault()
        const el = document.getElementById(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setMobileOpen(false)
  }

  const navLinks = [
    { label: t('nav_home'), href: '/' },
    { label: t('nav_services'), href: '/#services' },
    { label: t('nav_apply'), href: '/apply' },
    { label: t('nav_how'), href: '/#how-it-works' },
    { label: t('nav_faq'), href: '/#faq' },
    { label: t('nav_contact'), href: '/contact' },
    { label: t('nav_admin'), href: '/admin' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-white font-bold text-lg lg:text-xl tracking-tight">
              Ask <span className="text-gold">Mian</span>
            </span>
            <span className="hidden sm:inline text-white/40 text-[10px] lg:text-xs font-light tracking-wide border-l border-white/20 pl-2 ml-1">
              Visa & PRO Services
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} onClick={(e) => handleNavClick(e, link.href)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href) ? 'text-gold' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white/70 hover:text-gold hover:bg-white/5 rounded-md transition-colors"
              title={lang === 'en' ? 'Switch to Amharic' : 'Switch to English'}
            >
              <Globe size={14} />
              <span className="text-xs">{lang === 'en' ? 'EN' : 'አማ'}</span>
            </button>
            <a href="https://wa.me/971558689543" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gold text-black font-semibold text-sm rounded-md hover:bg-gold-dark transition-colors">
              <Phone size={14} /> WhatsApp
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-white/70 hover:text-gold transition-colors"
            >
              <Globe size={14} />
              {lang === 'en' ? 'EN' : 'አማ'}
            </button>
            <button className="text-white p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-black/98 border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} onClick={(e) => handleNavClick(e, link.href)}
                className={`block px-4 py-3 rounded-md text-sm font-medium ${
                  isActive(link.href) ? 'text-gold bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}>
                {link.label}
              </Link>
            ))}
            <a href="https://wa.me/971558689543" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-gold text-black font-semibold text-sm rounded-md">
              <Phone size={16} /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
