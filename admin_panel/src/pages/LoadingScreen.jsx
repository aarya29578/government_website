import { useLanguage } from '../i18n/LanguageContext'

export function LoadingScreen({ message }) {
  const { t } = useLanguage()
  return <div className="auth-loading"><div className="loading-mark">J</div><span>{message || t('loading.checkingAccess')}</span></div>
}
