import { useState } from 'react'
import { loginUser } from '../firebase/auth'
import { SiteLogo } from '../components/SiteLogo'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useLanguage } from '../i18n/LanguageContext'

function authMessageKey(error) {
  if (error?.code === 'auth/too-many-requests') return 'login.errors.tooManyRequests'
  if (error?.code === 'auth/network-request-failed') return 'login.errors.network'
  if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(error?.code)) return 'login.errors.invalidCredential'
  return 'login.errors.generic'
}

function redirectTarget() {
  const target = new URLSearchParams(window.location.search).get('redirect')
  return target && target.startsWith('/') ? target : '/'
}

export function Login() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState({ loading: false, error: '' })

  const submit = async (event) => {
    event.preventDefault(); setState({ loading: true, error: '' })
    try { await loginUser(form.email.trim(), form.password); window.location.assign(redirectTarget()) }
    catch (error) { setState({ loading: false, error: t(authMessageKey(error)) }) }
  }

  return (
    <AuthShell eyebrow={t('login.eyebrow')} title={t('login.title')} description={t('login.description')}>
      <form className="auth-form" onSubmit={submit}>
        <label>{t('auth.emailAddress')}<input type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder={t('login.emailPlaceholder')} /></label>
        <label>{t('auth.password')}<div className="auth-password"><input type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={t('login.passwordPlaceholder')} /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? t('auth.hide') : t('auth.show')}</button></div></label>
        {state.error && <p className="auth-error">{state.error}</p>}
        <button className="button button-primary auth-submit" disabled={state.loading} type="submit">{state.loading ? t('login.loading') : t('login.button')}</button>
        <p className="auth-switch">{t('login.noAccount')} <a href="/signup">{t('login.signupLink')}</a></p>
        <a className="auth-home-link" href="/">{t('auth.backToHome')}</a>
      </form>
    </AuthShell>
  )
}

export function AuthShell({ eyebrow, title, description, children }) {
  return (
    <main className="auth-page">
      <a className="auth-brand" href="/"><SiteLogo className="auth-site-logo logo-placeholder" /></a>
      <div className="auth-language-row"><LanguageSwitcher /></div>
      <section className="auth-card">
        <span className="auth-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="auth-description">{description}</p>
        {children}
      </section>
    </main>
  )
}
