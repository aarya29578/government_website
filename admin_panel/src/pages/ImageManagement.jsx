import { imageTypes } from '../config/adminConfig'
import { ImageUploader } from '../components/images/ImageUploader'
import { updateSettings } from '../services/settingsService'
import { useLanguage } from '../i18n/LanguageContext'

export function ImageManagement({ settings, onSettingsChange }) {
  const { t } = useLanguage()
  const saveUploadedUrl = async (field, publicUrl) => {
    const nextSettings = { ...settings, [field]: publicUrl }
    console.info('[Image settings update]', { field, publicUrl })
    await updateSettings(nextSettings)
    console.info('[Image settings saved]', { field, publicUrl: nextSettings[field] })
    onSettingsChange(nextSettings)
  }

  return (
    <div className="images-page">
      <div className="page-heading"><div><span className="section-kicker">{t('images.kicker')}</span><h2>{t('images.title')}</h2><p>{t('images.subtitle')}</p></div></div>
      <div className="upload-list">{imageTypes.map((item) => <ImageUploader key={item.key} type={item.key} value={settings[item.field]} onUploaded={saveUploadedUrl} />)}</div>
    </div>
  )
}
