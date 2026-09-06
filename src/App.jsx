import { useState } from 'react'
import { ImagePlaceholder } from './components/ImagePlaceholder'
import { SiteLogo } from './components/SiteLogo'
import { CalendarIcon, UsersIcon, CheckCircleIcon } from './components/icons'
import { ServicesSection } from './components/ServicesSection'
import { ContactSection } from './components/ContactSection'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import {
  contactConfig,
  navigationConfig,
  imageConfig,
} from './config/siteConfig'
import { useSiteSettings } from './context/SiteSettingsContext'
import { useAuth } from './context/AuthContext'
import { useLanguage } from './i18n/LanguageContext'
import { resolveSiteText } from './i18n/contentText'
import { buildWhatsAppUrl } from './utils/whatsapp'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Account } from './pages/Account'
import { ServiceDetail } from './pages/ServiceDetail'
import './App.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, logout } = useAuth()
  const { t } = useLanguage()
  const closeMenu = () => setMenuOpen(false)
  const firstName = (profile?.fullName || user?.displayName || 'User').split(' ')[0]

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#home" onClick={closeMenu}>
          <SiteLogo />
          <span className="brand-tagline">{t('hero.tagline')}</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={t('nav.openMenu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label={t('nav.mainNavigation')}>
          {navigationConfig.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {t(`nav.${item.key}`)}
            </a>
          ))}
          {user ? <><a className="nav-account-link" href="/account" onClick={closeMenu} title={t('nav.welcome', { name: firstName })}>{t('nav.welcome', { name: firstName })}</a><button className="nav-auth-button" type="button" onClick={async () => { await logout(); closeMenu(); window.location.assign('/login') }}>{t('nav.logout')}</button></> : <><a href="/login" onClick={closeMenu}>{t('nav.login')}</a><a href="/signup" onClick={closeMenu}>{t('nav.signup')}</a></>}
          <LanguageSwitcher className="nav-language-switcher" />
        </nav>
      </div>
    </header>
  )
}

function Hero({ images }) {
  const { t } = useLanguage()
  return (
    <section className="hero-section" id="home">
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>{t('hero.welcomeTitle')}</h1>
          <p className="hero-download">{t('hero.downloadLine')}</p>
          <p className="hero-services">{t('hero.serviceLine')}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#services">{t('hero.ourServices')}</a>
            <a className="button button-secondary" href="#contact">{t('hero.contactUs')}</a>
          </div>
        </div>
        <div className="hero-media" aria-label={t('hero.mediaAriaLabel')}>
          <ImagePlaceholder name="qrCode" source={images.qrCodeUrl} alt={t('hero.qrAlt')} className="qr-placeholder">
            <span className="qr-pattern" aria-hidden="true" />
            <span className="qr-label">SCAN ME</span>
          </ImagePlaceholder>
          <ImagePlaceholder name="googlePlay" source={images.googlePlayUrl} alt={t('hero.googlePlayAlt')} className="play-placeholder">
            <span className="play-icon">▶</span>
            <span><small>GET IT ON</small><strong>Google Play</strong></span>
          </ImagePlaceholder>
        </div>
      </div>
    </section>
  )
}

function About() {
  const { t, language } = useLanguage()
  const remoteSettings = useSiteSettings()
  const description = resolveSiteText(remoteSettings.aboutDescription, remoteSettings.aboutDescriptionMr, language, t('about.text'))
  return (
    <section className="about-section content-section" id="about">
      <div className="section-heading">
        <h2>{t('about.heading')}</h2>
        <span className="heading-rule" />
      </div>
      <p>{description}</p>
    </section>
  )
}

function AboutStats() {
  const { t, language } = useLanguage()
  const remoteSettings = useSiteSettings()
  const stats = [
    {
      Icon: CalendarIcon,
      value: remoteSettings.aboutStat1Value || t('aboutStats.stat1Value'),
      label: resolveSiteText(remoteSettings.aboutStat1Label, remoteSettings.aboutStat1LabelMr, language, t('aboutStats.stat1Label')),
    },
    {
      Icon: UsersIcon,
      value: remoteSettings.aboutStat2Value || t('aboutStats.stat2Value'),
      label: resolveSiteText(remoteSettings.aboutStat2Label, remoteSettings.aboutStat2LabelMr, language, t('aboutStats.stat2Label')),
    },
    {
      Icon: CheckCircleIcon,
      value: remoteSettings.aboutStat3Value || t('aboutStats.stat3Value'),
      label: resolveSiteText(remoteSettings.aboutStat3Label, remoteSettings.aboutStat3LabelMr, language, t('aboutStats.stat3Label')),
    },
  ]
  return (
    <section className="about-stats-section">
      <div className="about-stats-card">
        {stats.map(({ Icon, value, label }, index) => (
          <div className="about-stat" key={index}>
            <span className="about-stat-icon"><Icon className="about-stat-icon-svg" /></span>
            <strong className="about-stat-value">{value}</strong>
            <span className="about-stat-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ServicesWhatsAppCta() {
  const { t } = useLanguage()
  const remoteSettings = useSiteSettings()
  const whatsappUrl = buildWhatsAppUrl(remoteSettings.whatsappNumber)

  const handleClick = () => {
    if (!whatsappUrl) return
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="whatsapp-cta-section">
      <button
        type="button"
        className="whatsapp-cta-button"
        onClick={handleClick}
        disabled={!whatsappUrl}
        title={whatsappUrl ? undefined : t('whatsappCta.unavailable')}
      >
        {t('whatsappCta.buttonText')}
      </button>
    </section>
  )
}

function WhatsAppButton({ number }) {
  const { t } = useLanguage()
  const href = buildWhatsAppUrl(number) || '#contact'

  return (
    <a className="whatsapp-button" href={href} aria-label={t('whatsapp.ariaLabel')}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 3.5A11.75 11.75 0 0 0 12.12 0C5.6 0 .3 5.3.3 11.82c0 2.08.54 4.1 1.56 5.88L.2 23.9l6.35-1.62a11.8 11.8 0 0 0 5.57 1.42h.01c6.52 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.45-8.38Zm-8.38 18.2h-.01a9.82 9.82 0 0 1-5-1.36l-.36-.21-3.77.96 1-3.68-.23-.38a9.8 9.8 0 0 1-1.5-5.21C2.25 6.4 6.68 1.97 12.13 1.97a9.76 9.76 0 0 1 6.95 2.88 9.77 9.77 0 0 1 2.87 6.96c0 5.45-4.43 9.89-9.87 9.89Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.96-.28-.1-.48-.15-.69.15-.2.3-.78.96-.96 1.16-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.06c-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.69-1.67-.94-2.29-.25-.6-.5-.52-.69-.53h-.58c-.2 0-.53.07-.81.38-.28.3-1.06 1.04-1.06 2.54s1.09 2.95 1.24 3.15c.15.2 2.14 3.27 5.18 4.58.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35Z" />
      </svg>
    </a>
  )
}

function SiteLoadingScreen() {
  const { t } = useLanguage()
  return <main className="site-loading"><p>{t('site.loading')}</p></main>
}

function App() {
  const remoteSettings = useSiteSettings()
  const { user, loading: authLoading } = useAuth()
  const route = window.location.pathname

  if (route === '/login' || route === '/signup') {
    if (authLoading) return <SiteLoadingScreen />
    if (user) { window.location.replace('/'); return null }
    return route === '/login' ? <Login /> : <Signup />
  }

  if (authLoading) return <SiteLoadingScreen />
  if (!user) { window.location.replace(`/login?redirect=${encodeURIComponent(route)}`); return null }

  if (route === '/account') return <Account />
  if (route.startsWith('/services/')) return <ServiceDetail slug={route.slice('/services/'.length)} />

  const images = {
    logoUrl: remoteSettings.logoUrl || imageConfig.logo,
    qrCodeUrl: remoteSettings.qrCodeUrl || imageConfig.qrCode,
    googlePlayUrl: remoteSettings.googlePlayUrl || imageConfig.googlePlay,
  }
  const whatsappNumber = remoteSettings.whatsappNumber || contactConfig.whatsappNumber

  return (
    <>
      <Header />
      <main>
        <Hero images={images} />
        <About />
        <AboutStats />
        <ServicesSection />
        <ServicesWhatsAppCta />
        <ContactSection />
      </main>
      <WhatsAppButton number={whatsappNumber} />
    </>
  )
}

export default App
