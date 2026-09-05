import { imageTypes } from '../config/adminConfig'
import { ImageUploader } from '../components/images/ImageUploader'
import { updateSettings } from '../services/settingsService'

export function ImageManagement({ settings, onSettingsChange }) {
  const saveUploadedUrl = async (field, publicUrl) => {
    const nextSettings = { ...settings, [field]: publicUrl }
    console.info('[Image settings update]', { field, publicUrl })
    await updateSettings(nextSettings)
    console.info('[Image settings saved]', { field, publicUrl: nextSettings[field] })
    onSettingsChange(nextSettings)
  }

  return <div className="images-page"><div className="page-heading"><div><span className="section-kicker">MEDIA LIBRARY</span><h2>Image management</h2><p>Upload a new asset first. The public site changes only after the URL is saved.</p></div></div><div className="upload-list">{imageTypes.map((item) => <ImageUploader key={item.key} type={item.key} value={settings[item.field]} onUploaded={saveUploadedUrl} />)}</div></div>
}
