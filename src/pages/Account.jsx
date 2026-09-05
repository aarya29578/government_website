import { useAuth } from '../context/AuthContext'
import { SiteLogo } from '../components/SiteLogo'

export function Account() {
  const { user, profile, loading, logout } = useAuth()
  if (loading) return <main className="account-page"><p>Loading account...</p></main>
  if (!user) { window.location.replace('/login'); return null }
  const name = profile?.fullName || user.displayName || 'User'
  return <main className="account-page"><a className="auth-brand account-brand" href="/"><SiteLogo className="auth-site-logo logo-placeholder" /></a><section className="account-card"><span className="auth-eyebrow">MY ACCOUNT</span><h1>Welcome, {name.split(' ')[0]}</h1><div className="account-details"><div><span>Full Name</span><strong>{name}</strong></div><div><span>Email</span><strong>{profile?.email || user.email}</strong></div><div><span>Mobile Number</span><strong>{profile?.mobileNumber || 'Not provided'}</strong></div><div><span>Account type</span><strong>User</strong></div></div><button className="button button-secondary auth-submit" type="button" onClick={async () => { await logout(); window.location.assign('/') }}>Logout</button><a className="auth-home-link" href="/">Back to Home</a></section></main>
}
