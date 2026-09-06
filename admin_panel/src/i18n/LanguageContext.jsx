import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const STORAGE_KEY = 'jenisha_language'
const LanguageContext = createContext(null)

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'mr' ? 'mr' : 'en'
  } catch {
    return 'en'
  }
}

function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] ?? ''))
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, language) } catch { /* storage unavailable */ }
  }, [language])

  const setLanguage = (next) => setLanguageState(next === 'mr' ? 'mr' : 'en')

  const t = useMemo(() => {
    return (key, vars) => {
      const dict = translations[language] || translations.en
      const value = dict[key] ?? translations.en[key] ?? translations.mr[key] ?? key
      return interpolate(value, vars)
    }
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
