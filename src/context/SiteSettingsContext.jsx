import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadPublicSettings } from '../services/publicSettings'

const SiteSettingsContext = createContext(null)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    loadPublicSettings().then((nextSettings) => {
      if (nextSettings) setSettings(nextSettings)
    }).catch((error) => {
      console.info('[Public settings diagnostic]', { readSucceeded: false, message: error.message })
    })
  }, [])

  const value = useMemo(() => settings, [settings])
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  const settings = useContext(SiteSettingsContext)
  if (!settings) throw new Error('useSiteSettings must be used inside SiteSettingsProvider')
  return settings
}
