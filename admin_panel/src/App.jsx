import { useEffect, useState } from 'react'
import { AdminLayout } from './components/layout/AdminLayout'
import { subscribeToAuth, logout } from './firebase/auth'
import { getUserProfile } from './firebase/firestore'
import { firebaseConfigured } from './firebase/firebaseConfig'
import { AddAdminUser } from './pages/AddAdminUser'
import { Dashboard } from './pages/Dashboard'
import { FormsData } from './pages/FormsData'
import { GetInTouch } from './pages/GetInTouch'
import { ImageManagement } from './pages/ImageManagement'
import { Login } from './pages/Login'
import { LoadingScreen } from './pages/LoadingScreen'
import { ManageServiceForm } from './pages/ManageServiceForm'
import { Services } from './pages/Services'
import { WebsiteSettings } from './pages/WebsiteSettings'
import { WhatsAppNumber } from './pages/WhatsAppNumber'
import { emptySettings, loadSettings } from './services/settingsService'
import { useLanguage } from './i18n/LanguageContext'
import './App.css'

function getPage() {
  const route = window.location.pathname.replace(/^\//, '') || window.location.hash.replace(/^#\/?/, '')
  if (route === 'admin/login' || route === 'login') return 'login'
  if (route === 'images' || window.location.hash === '#images') return 'images'
  if (route === 'settings' || window.location.hash === '#settings') return 'settings'
  if (route === 'services') return 'services'
  if (/^services\/[^/]+\/form$/.test(route)) return 'service-form'
  if (route === 'forms-data') return 'forms-data'
  if (route === 'get-in-touch') return 'get-in-touch'
  if (route === 'add-admin') return 'add-admin'
  if (route === 'whatsapp-number') return 'whatsapp-number'
  return 'dashboard'
}

function getServiceIdFromPath() {
  const match = window.location.pathname.match(/^\/services\/([^/]+)\/form$/)
  return match ? match[1] : null
}

function App() {
  const { t } = useLanguage()
  const [page, setPage] = useState(getPage)
  const [serviceFormId, setServiceFormId] = useState(getServiceIdFromPath)
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState(emptySettings)
  const [state, setState] = useState({ loading: true, error: '' })

  useEffect(() => {
    if (!firebaseConfigured) {
      setState({ loading: false, error: 'app.firebaseNotConfigured' })
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
          setState({ loading: false, error: 'login.notAuthorized' })
          return
        }
        setUser(nextUser)
        setSettings(await loadSettings())
        setState({ loading: false, error: '' })
      } catch (error) { setState({ loading: false, error: error.message || 'app.loadAccessError' }) }
    })
    const handlePopState = () => { setPage(getPage()); setServiceFormId(getServiceIdFromPath()) }
    window.addEventListener('popstate', handlePopState)
    return () => { unsubscribe(); window.removeEventListener('popstate', handlePopState) }
  }, [])

  const navigate = (nextPage, params) => {
    setPage(nextPage)
    if (nextPage === 'service-form') {
      setServiceFormId(params?.serviceId)
      window.history.pushState({}, '', `/services/${params?.serviceId}/form`)
      return
    }
    window.history.pushState({}, '', nextPage === 'dashboard' ? '/admin' : `/${nextPage}`)
  }

  const handleLogin = (nextUser) => { setUser(nextUser); setState({ loading: false, error: '' }); navigate('dashboard') }
  const handleLogout = () => { setUser(null); navigate('login') }
  const handleSettingsChange = (nextSettings) => setSettings(nextSettings)

  if (state.loading) return <LoadingScreen message={t('app.checkingAccess')} />
  if (!user || page === 'login') return <Login onLogin={handleLogin} initialError={t(state.error)} />

  return <AdminLayout user={user} page={page} onNavigate={navigate} onLogout={handleLogout}>
    {state.error && <div className="page-alert error">{t(state.error)}</div>}
    {page === 'settings' && <WebsiteSettings settings={settings} onSettingsChange={handleSettingsChange} />}
    {page === 'whatsapp-number' && <WhatsAppNumber settings={settings} onSettingsChange={handleSettingsChange} />}
    {page === 'images' && <ImageManagement settings={settings} onSettingsChange={handleSettingsChange} />}
    {page === 'services' && <Services onManageForm={(serviceId) => navigate('service-form', { serviceId })} />}
    {page === 'service-form' && <ManageServiceForm serviceId={serviceFormId} onBack={() => navigate('services')} />}
    {page === 'forms-data' && <FormsData />}
    {page === 'get-in-touch' && <GetInTouch />}
    {page === 'add-admin' && <AddAdminUser onNavigate={navigate} />}
    {page === 'dashboard' && <Dashboard settings={settings} firebaseConfigured={firebaseConfigured} onNavigate={navigate} />}
  </AdminLayout>
}

export default App
