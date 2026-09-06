import { useState } from 'react'
import { registerUser } from '../firebase/auth'
import { AuthShell } from './Login'
import { useLanguage } from '../i18n/LanguageContext'

const initialForm = { fullName: '', email: '', mobileNumber: '', password: '', confirmPassword: '' }

function validate(form) {
  const errors = {}
  if (form.fullName.trim().length < 2) errors.fullName = 'signup.errors.fullName'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'signup.errors.email'
  if (!/^[6-9]\d{9}$/.test(form.mobileNumber.replace(/\s/g, ''))) errors.mobileNumber = 'signup.errors.mobileNumber'
  if (form.password.length < 6) errors.password = 'signup.errors.password'
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'signup.errors.confirmPassword'
  return errors
}

export function Signup() {
  const { t } = useLanguage()
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [state, setState] = useState({ loading: false, errors: {}, error: '' })

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const submit = async (event) => {
    event.preventDefault(); const errors = validate(form)
    if (Object.keys(errors).length) { setState({ loading: false, errors, error: '' }); return }
    setState({ loading: true, errors: {}, error: '' })
    try { await registerUser(form); window.location.assign('/') }
    catch (error) {
      const messageKey = error.code === 'auth/email-already-in-use' ? 'signup.errors.emailInUse' : error.code === 'auth/network-request-failed' ? 'signup.errors.network' : 'signup.errors.generic'
      setState({ loading: false, errors: {}, error: t(messageKey) })
    }
  }
  const field = (name, label, type = 'text', placeholder = '') => (
    <label>
      {label}
      <input type={type} required value={form[name]} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} />
      {state.errors[name] && <span className="field-error">{t(state.errors[name])}</span>}
    </label>
  )

  return (
    <AuthShell eyebrow={t('signup.eyebrow')} title={t('signup.title')} description={t('signup.description')}>
      <form className="auth-form" onSubmit={submit}>
        {field('fullName', t('signup.fullName'), 'text', t('signup.fullNamePlaceholder'))}
        {field('email', t('signup.email'), 'email', t('signup.emailPlaceholder'))}
        {field('mobileNumber', t('signup.mobileNumber'), 'tel', t('signup.mobileNumberPlaceholder'))}
        <label>
          {t('signup.password')}
          <div className="auth-password">
            <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(event) => update('password', event.target.value)} placeholder={t('signup.passwordPlaceholder')} />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? t('auth.hide') : t('auth.show')}</button>
          </div>
          {state.errors.password && <span className="field-error">{t(state.errors.password)}</span>}
        </label>
        <label>
          {t('signup.confirmPassword')}
          <div className="auth-password">
            <input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} placeholder={t('signup.confirmPasswordPlaceholder')} />
            <button type="button" onClick={() => setShowConfirm((value) => !value)}>{showConfirm ? t('auth.hide') : t('auth.show')}</button>
          </div>
          {state.errors.confirmPassword && <span className="field-error">{t(state.errors.confirmPassword)}</span>}
        </label>
        {state.error && <p className="auth-error">{state.error}</p>}
        <button className="button button-primary auth-submit" disabled={state.loading} type="submit">{state.loading ? t('signup.loading') : t('signup.button')}</button>
        <p className="auth-switch">{t('signup.haveAccount')} <a href="/login">{t('signup.loginLink')}</a></p>
        <a className="auth-home-link" href="/">{t('auth.backToHome')}</a>
      </form>
    </AuthShell>
  )
}
