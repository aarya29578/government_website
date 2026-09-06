import { useLanguage } from '../../i18n/LanguageContext'

export function ImagePreview({ label, url }) {
  const { t } = useLanguage()
  return <div className="compact-preview"><span>{label}</span>{url ? <img src={url} alt={`${label} preview`} /> : <small>{t('images.notConfigured')}</small>}</div>
}
