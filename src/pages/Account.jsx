import { useAuth } from '../context/AuthContext'
import { SiteLogo } from '../components/SiteLogo'
import { useLanguage } from '../i18n/LanguageContext'

export function Account() {
  const { user, profile, loading, logout } = useAuth()
  const { t } = useLanguage()
  if (loading) return <main className="account-page"><p>{t('account.loading')}</p></main>
  if (!user) { window.location.replace('/login'); return null }
  const name = profile?.fullName || user.displayName || t('account.userValue')
  return (
    <main className="account-page">
      <a className="auth-brand account-brand" href="/"><SiteLogo className="auth-site-logo logo-placeholder" /></a>
      <section className="account-card">
        <span className="auth-eyebrow">{t('account.eyebrow')}</span>
        <h1>{t('account.welcome', { name: name.split(' ')[0] })}</h1>
        <div className="account-details">
          <div><span>{t('account.fullName')}</span><strong>{name}</strong></div>
          <div><span>{t('account.email')}</span><strong>{profile?.email || user.email}</strong></div>
          <div><span>{t('account.mobileNumber')}</span><strong>{profile?.mobileNumber || t('account.notProvided')}</strong></div>
          <div><span>{t('account.accountType')}</span><strong>{t('account.userValue')}</strong></div>
        </div>
        <button className="button button-secondary auth-submit" type="button" onClick={async () => { await logout(); window.location.assign('/login') }}>{t('account.logout')}</button>
        <a className="auth-home-link" href="/">{t('auth.backToHome')}</a>
      </section>
    </main>
  )
}
