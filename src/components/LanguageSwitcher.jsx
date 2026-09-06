import { useLanguage } from '../i18n/LanguageContext'

export function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguage()
  return (
    <div className={`language-switcher ${className}`} role="group" aria-label="Language selector / भाषा निवडक">
      <button
        type="button"
        aria-pressed={language === 'mr'}
        className={language === 'mr' ? 'active' : ''}
        onClick={() => setLanguage('mr')}
      >
        मराठी
      </button>
      <button
        type="button"
        aria-pressed={language === 'en'}
        className={language === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
      >
        English
      </button>
    </div>
  )
}
