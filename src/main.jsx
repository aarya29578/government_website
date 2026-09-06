import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { LanguageProvider } from './i18n/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider><AuthProvider><SiteSettingsProvider><App /></SiteSettingsProvider></AuthProvider></LanguageProvider>
  </StrictMode>,
)
