import { ImagePreview } from '../components/images/ImagePreview'
import { useLanguage } from '../i18n/LanguageContext'

export function Dashboard({ settings, firebaseConfigured, onNavigate }) {
  const { t } = useLanguage()
  const configuredImages = [settings.logoUrl, settings.qrCodeUrl, settings.googlePlayUrl].filter(Boolean).length
  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div><span className="section-kicker">{t('dashboard.kicker')}</span><h2>{t('dashboard.title')}</h2><p>{t('dashboard.subtitle')}</p></div>
        <button className="primary-button" type="button" onClick={() => onNavigate('images')}>{t('dashboard.manageImages')}</button>
      </div>
      <div className="status-grid">
        <article className="status-card"><span className="status-icon blue">◉</span><div><span>{t('dashboard.websiteStatus')}</span><strong>{t('dashboard.readyToPublish')}</strong><small>{t('dashboard.websiteConnected')}</small></div></article>
        <article className="status-card"><span className={`status-icon ${firebaseConfigured ? 'green' : 'orange'}`}>⌁</span><div><span>{t('dashboard.firebaseStatus')}</span><strong>{firebaseConfigured ? t('dashboard.configured') : t('dashboard.needsSetup')}</strong><small>{firebaseConfigured ? t('dashboard.firebaseReady') : t('dashboard.addEnvVars')}</small></div></article>
        <article className="status-card"><span className="status-icon orange">▧</span><div><span>{t('dashboard.imageConfiguration')}</span><strong>{t('dashboard.imagesConfiguredCount', { count: configuredImages })}</strong><small>{t('dashboard.imageConfigNote')}</small></div></article>
      </div>
      <section className="dashboard-section">
        <div className="section-title-row">
          <div><h3>{t('dashboard.currentAssets')}</h3><p>{t('dashboard.currentAssetsNote')}</p></div>
          <button className="text-button" type="button" onClick={() => onNavigate('settings')}>{t('dashboard.editSettings')}</button>
        </div>
        <div className="preview-grid">
          <ImagePreview label={t('dashboard.logo')} url={settings.logoUrl} />
          <ImagePreview label={t('dashboard.qrCode')} url={settings.qrCodeUrl} />
          <ImagePreview label={t('dashboard.googlePlay')} url={settings.googlePlayUrl} />
        </div>
      </section>
    </div>
  )
}
