import { useState } from 'react'
import { registerUser } from '../firebase/auth'
import { AuthShell } from './Login'

const initialForm = { fullName: '', email: '', mobileNumber: '', password: '', confirmPassword: '' }

function validate(form) {
  const errors = {}
  if (form.fullName.trim().length < 2) errors.fullName = 'Please enter your full name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email address'
  if (!/^[6-9]\d{9}$/.test(form.mobileNumber.replace(/\s/g, ''))) errors.mobileNumber = 'Please enter a valid 10-digit mobile number'
  if (form.password.length < 6) errors.password = 'Password must be at least 6 characters'
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}

export function Signup() {
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
      const message = error.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' : error.code === 'auth/network-request-failed' ? 'Network error. Please check your internet connection.' : 'Unable to create your account. Please try again.'
      setState({ loading: false, errors: {}, error: message })
    }
  }
  const field = (name, label, type = 'text', placeholder = '') => <label>{label}<input type={type} required value={form[name]} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} />{state.errors[name] && <span className="field-error">{state.errors[name]}</span>}</label>

  return <AuthShell eyebrow="CREATE ACCOUNT" title="Join Jenisha Online" description="Create your account to stay connected with our services."><form className="auth-form" onSubmit={submit}>{field('fullName', 'Full name', 'text', 'Your full name')}{field('email', 'Email address', 'email', 'you@example.com')}{field('mobileNumber', 'Mobile number', 'tel', '10-digit mobile number')}<label>Password<div className="auth-password"><input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div>{state.errors.password && <span className="field-error">{state.errors.password}</span>}</label><label>Confirm password<div className="auth-password"><input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} placeholder="Repeat your password" /><button type="button" onClick={() => setShowConfirm((value) => !value)}>{showConfirm ? 'Hide' : 'Show'}</button></div>{state.errors.confirmPassword && <span className="field-error">{state.errors.confirmPassword}</span>}</label>{state.error && <p className="auth-error">{state.error}</p>}<button className="button button-primary auth-submit" disabled={state.loading} type="submit">{state.loading ? 'Creating account...' : 'Sign Up'}</button><p className="auth-switch">Already have an account? <a href="/login">Login</a></p><a className="auth-home-link" href="/">Back to Home</a></form></AuthShell>
}
