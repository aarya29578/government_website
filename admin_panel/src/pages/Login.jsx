import { useState } from 'react'
import { loginAdmin } from '../firebase/auth'

export function Login({ onLogin, initialError = '' }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState({ loading: false, error: initialError })

  const submit = async (event) => {
    event.preventDefault(); setState({ loading: true, error: '' })
    try { const user = await loginAdmin(form.email.trim(), form.password); onLogin(user) }
    catch (error) {
      const message = error.code === 'auth/invalid-credential' ? 'Email or password is incorrect.' : error.message || 'Unable to sign in.'
      setState({ loading: false, error: message })
    }
  }

  return <main className="login-page"><div className="login-brand"><div className="login-logo">J</div><div><strong>JENISHA</strong><span>ONLINE SERVICE</span></div></div><section className="login-card"><div className="login-card-intro"><span className="section-kicker">SECURE ACCESS</span><h1>Welcome back</h1><p>Sign in to manage your public website.</p></div><form onSubmit={submit}><label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="admin@example.com" /></label><label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{state.error && <div className="form-error" role="alert">{state.error}</div>}<button className="login-button" type="submit" disabled={state.loading}>{state.loading ? 'Checking access...' : 'Sign in to Admin Panel'}</button></form></section><p className="login-footer">Authorized administrators only</p></main>
}
