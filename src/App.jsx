import { useState } from 'react'
import { ImagePlaceholder } from './components/ImagePlaceholder'
import { SiteLogo } from './components/SiteLogo'
import {
  contactConfig,
  navigationConfig,
  siteConfig,
  imageConfig,
} from './config/siteConfig'
import { useSiteSettings } from './context/SiteSettingsContext'
import { useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Account } from './pages/Account'
import './App.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, logout } = useAuth()
  const closeMenu = () => setMenuOpen(false)
  const firstName = (profile?.fullName || user?.displayName || 'User').split(' ')[0]

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#home" onClick={closeMenu}>
          <SiteLogo />
          <span className="brand-tagline">{siteConfig.tagline}</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="मेनू उघडा"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="मुख्य नेव्हिगेशन">
          {navigationConfig.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          {user ? <><a href="/account" onClick={closeMenu}>Welcome, {firstName}</a><button className="nav-auth-button" type="button" onClick={async () => { await logout(); closeMenu(); window.location.assign('/') }}>Logout</button></> : <><a href="/login" onClick={closeMenu}>Login</a><a href="/signup" onClick={closeMenu}>Sign Up</a></>}
        </nav>
      </div>
    </header>
  )
}

function Hero({ images }) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>{siteConfig.welcomeTitle}</h1>
          <p className="hero-download">{siteConfig.downloadLine}</p>
          <p className="hero-services">{siteConfig.serviceLine}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#services">आमच्या सेवा</a>
            <a className="button button-secondary" href="#contact">संपर्क साधा</a>
          </div>
        </div>
        <div className="hero-media" aria-label="मोबाईल अॅप डाउनलोड आणि QR कोड">
          <ImagePlaceholder name="googlePlay" source={images.googlePlayUrl} alt="Google Play वरून अॅप डाउनलोड करा" className="play-placeholder">
            <span className="play-icon">▶</span>
            <span><small>GET IT ON</small><strong>Google Play</strong></span>
          </ImagePlaceholder>
          <ImagePlaceholder name="qrCode" source={images.qrCodeUrl} alt="अॅप डाउनलोड करण्यासाठी QR कोड" className="qr-placeholder">
            <span className="qr-pattern" aria-hidden="true" />
            <span className="qr-label">SCAN ME</span>
          </ImagePlaceholder>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about-section content-section" id="about">
      <div className="section-heading">
        <h2>आमच्याबद्दल</h2>
        <span className="heading-rule" />
      </div>
      <p>{siteConfig.aboutText}</p>
    </section>
  )
}

function Services() {
  return (
    <section className="placeholder-section content-section" id="services">
      <div className="section-heading">
        <h2>सेवा</h2>
        <span className="heading-rule" />
      </div>
      <p>सर्व शासकीय आणि निमशासकीय सेवा लवकरच येथे उपलब्ध होतील.</p>
    </section>
  )
}

function Contact() {
  return (
    <section className="placeholder-section contact-section content-section" id="contact">
      <div className="section-heading">
        <h2>संपर्क</h2>
        <span className="heading-rule" />
      </div>
      <p>आपल्या सेवेसाठी आमच्याशी संपर्क साधा.</p>
    </section>
  )
}

function WhatsAppButton({ number }) {
  const href = number === 'REPLACE_WITH_NUMBER' || !number
    ? '#contact'
    : `https://wa.me/${number}`

  return (
    <a className="whatsapp-button" href={href} aria-label="WhatsApp वर संपर्क साधा">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 3.5A11.75 11.75 0 0 0 12.12 0C5.6 0 .3 5.3.3 11.82c0 2.08.54 4.1 1.56 5.88L.2 23.9l6.35-1.62a11.8 11.8 0 0 0 5.57 1.42h.01c6.52 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.45-8.38Zm-8.38 18.2h-.01a9.82 9.82 0 0 1-5-1.36l-.36-.21-3.77.96 1-3.68-.23-.38a9.8 9.8 0 0 1-1.5-5.21C2.25 6.4 6.68 1.97 12.13 1.97a9.76 9.76 0 0 1 6.95 2.88 9.77 9.77 0 0 1 2.87 6.96c0 5.45-4.43 9.89-9.87 9.89Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.96-.28-.1-.48-.15-.69.15-.2.3-.78.96-.96 1.16-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.06c-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.69-1.67-.94-2.29-.25-.6-.5-.52-.69-.53h-.58c-.2 0-.53.07-.81.38-.28.3-1.06 1.04-1.06 2.54s1.09 2.95 1.24 3.15c.15.2 2.14 3.27 5.18 4.58.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35Z" />
      </svg>
    </a>
  )
}

function App() {
  const remoteSettings = useSiteSettings()
  const route = window.location.pathname

  if (route === '/login') return <Login />
  if (route === '/signup') return <Signup />
  if (route === '/account') return <Account />

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
        <Services />
        <Contact />
      </main>
      <WhatsAppButton number={whatsappNumber} />
    </>
  )
}

export default App
