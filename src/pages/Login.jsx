import { useState } from 'react'
import { loginUser } from '../firebase/auth'
import { SiteLogo } from '../components/SiteLogo'

function authMessage(error) {
  if (error?.code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.'
  if (error?.code === 'auth/network-request-failed') return 'Network error. Please check your internet connection.'
  if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(error?.code)) return 'Incorrect email or password.'
  return 'Unable to sign in. Please check your details and try again.'
}

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState({ loading: false, error: '' })

  const submit = async (event) => {
    event.preventDefault(); setState({ loading: true, error: '' })
    try { await loginUser(form.email.trim(), form.password); window.location.assign('/') }
    catch (error) { setState({ loading: false, error: authMessage(error) }) }
  }

  return <AuthShell eyebrow="ACCOUNT ACCESS" title="Welcome back" description="Sign in to access your Jenisha Online Service account."><form className="auth-form" onSubmit={submit}><label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<div className="auth-password"><input type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{state.error && <p className="auth-error">{state.error}</p>}<button className="button button-primary auth-submit" disabled={state.loading} type="submit">{state.loading ? 'Signing in...' : 'Login'}</button><p className="auth-switch">Don't have an account? <a href="/signup">Sign Up</a></p><a className="auth-home-link" href="/">Back to Home</a></form></AuthShell>
}

export function AuthShell({ eyebrow, title, description, children }) {
  return <main className="auth-page"><a className="auth-brand" href="/"><SiteLogo className="auth-site-logo logo-placeholder" /></a><section className="auth-card"><span className="auth-eyebrow">{eyebrow}</span><h1>{title}</h1><p className="auth-description">{description}</p>{children}</section></main>
}
