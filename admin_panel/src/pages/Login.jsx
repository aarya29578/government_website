import { useState } from 'react'
import { loginAdmin } from '../firebase/auth'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useLanguage } from '../i18n/LanguageContext'

export function Login({ onLogin, initialError = '' }) {
  const { t } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState({ loading: false, error: initialError })

  const submit = async (event) => {
    event.preventDefault(); setState({ loading: true, error: '' })
    try { const user = await loginAdmin(form.email.trim(), form.password); onLogin(user) }
    catch (error) {
      const message = error.code === 'auth/invalid-credential' ? t('login.invalidCredential') : t(error.message) || t('login.generic')
      setState({ loading: false, error: message })
    }
  }

  return (
    <main className="login-page">
      <div className="login-brand"><div className="login-logo">J</div><div><strong>JENISHA</strong><span>ONLINE SERVICE</span></div></div>
      <div className="login-language-row"><LanguageSwitcher /></div>
      <section className="login-card">
        <div className="login-card-intro"><span className="section-kicker">{t('login.secureAccess')}</span><h1>{t('login.welcomeBack')}</h1><p>{t('login.subtitle')}</p></div>
        <form onSubmit={submit}>
          <label>{t('login.email')}<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="admin@example.com" /></label>
          <label>{t('login.password')}<div className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={t('login.passwordPlaceholder')} /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? t('common.hide') : t('common.show')}</button></div></label>
          {state.error && <div className="form-error" role="alert">{state.error}</div>}
          <button className="login-button" type="submit" disabled={state.loading}>{state.loading ? t('login.checkingAccess') : t('login.signIn')}</button>
        </form>
      </section>
      <p className="login-footer">{t('login.footer')}</p>
    </main>
  )
}
