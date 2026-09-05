import { useEffect, useState } from 'react'
import { AdminLayout } from './components/layout/AdminLayout'
import { subscribeToAuth, logout } from './firebase/auth'
import { getUserProfile } from './firebase/firestore'
import { firebaseConfigured } from './firebase/firebaseConfig'
import { Dashboard } from './pages/Dashboard'
import { ImageManagement } from './pages/ImageManagement'
import { Login } from './pages/Login'
import { LoadingScreen } from './pages/LoadingScreen'
import { WebsiteSettings } from './pages/WebsiteSettings'
import { emptySettings, loadSettings } from './services/settingsService'
import './App.css'

function getPage() {
  const route = window.location.pathname.replace(/^\//, '') || window.location.hash.replace(/^#\/?/, '')
  if (route === 'admin/login' || route === 'login') return 'login'
  return window.location.hash === '#settings' ? 'settings' : window.location.hash === '#images' ? 'images' : 'dashboard'
}

function App() {
  const [page, setPage] = useState(getPage)
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState(emptySettings)
  const [state, setState] = useState({ loading: true, error: '' })

  useEffect(() => {
    if (!firebaseConfigured) {
      setState({ loading: false, error: 'Firebase is not configured. Add the values from .env.example to sign in.' })
      return undefined
    }
    const unsubscribe = subscribeToAuth(async (nextUser) => {
      if (!nextUser) { setUser(null); setState({ loading: false, error: '' }); return }
      try {
        const profile = await getUserProfile(nextUser.uid)
        const role = profile?.role
        console.info('[Admin auth-state diagnostic]', {
          uid: nextUser.uid,
          profileExists: profile !== null,
          role: JSON.stringify(role),
          roleLength: role?.length,
          roleCharCodes: typeof role === 'string' ? [...role].map((char) => char.charCodeAt(0)) : undefined,
          roleType: typeof role,
          isAdmin: role === 'admin',
        })
        if (role !== 'admin') {
          await logout()
          setUser(null)
          setState({ loading: false, error: 'This account is not authorized to access the Admin Panel.' })
          return
        }
        setUser(nextUser)
        setSettings(await loadSettings())
        setState({ loading: false, error: '' })
      } catch (error) { setState({ loading: false, error: error.message || 'Unable to load admin access.' }) }
    })
    const handlePopState = () => setPage(getPage())
    window.addEventListener('popstate', handlePopState)
    return () => { unsubscribe(); window.removeEventListener('popstate', handlePopState) }
  }, [])

  const navigate = (nextPage) => {
    setPage(nextPage)
    window.history.pushState({}, '', nextPage === 'dashboard' ? '/admin' : `#${nextPage}`)
  }

  const handleLogin = (nextUser) => { setUser(nextUser); setState({ loading: false, error: '' }); navigate('dashboard') }
  const handleLogout = () => { setUser(null); navigate('login') }
  const handleSettingsChange = (nextSettings) => setSettings(nextSettings)

  if (state.loading) return <LoadingScreen message="Checking admin access..." />
  if (!user || page === 'login') return <Login onLogin={handleLogin} initialError={state.error} />

  return <AdminLayout user={user} page={page} onNavigate={navigate} onLogout={handleLogout}>
    {state.error && <div className="page-alert error">{state.error}</div>}
    {page === 'settings' && <WebsiteSettings settings={settings} onSettingsChange={handleSettingsChange} />}
    {page === 'images' && <ImageManagement settings={settings} onSettingsChange={handleSettingsChange} />}
    {page === 'dashboard' && <Dashboard settings={settings} firebaseConfigured={firebaseConfigured} onNavigate={navigate} />}
  </AdminLayout>
}

export default App
