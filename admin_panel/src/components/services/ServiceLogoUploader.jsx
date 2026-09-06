import { useState } from 'react'
import { SERVICE_LOGO_UPLOAD_TYPE } from '../../config/adminConfig'
import { uploadImage, validateImage } from '../../services/imageUploadService'
import { ImagePlaceholderIcon } from '../icons/ImagePlaceholderIcon'
import { useLanguage } from '../../i18n/LanguageContext'

export function ServiceLogoUploader({ value, onChange }) {
  const { t } = useLanguage()
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState({ type: '', message: '' })

  const chooseFile = (event) => {
    const selected = event.target.files?.[0]
    const error = validateImage(selected)
    if (error) { setStatus({ type: 'error', message: t(error) }); setFile(null); return }
    setStatus({ type: '', message: '' })
    setFile(selected)
  }

  const upload = async () => {
    try {
      setStatus({ type: '', message: '' }); setProgress(0)
      const response = await uploadImage(file, SERVICE_LOGO_UPLOAD_TYPE, setProgress)
      onChange(response.publicUrl)
      setFile(null); setProgress(100)
      setStatus({ type: 'success', message: t('services.logoUploaded') })
    } catch (error) {
      setProgress(0)
      setStatus({ type: 'error', message: `${t(error.message)} ${t('services.pasteUrlInstead')}` })
    }
  }

  return (
    <div className="logo-uploader">
      <div className="logo-uploader-preview">
        {value ? <img src={value} alt="Service logo preview" /> : <span className="logo-uploader-fallback"><ImagePlaceholderIcon /></span>}
      </div>
      <div className="logo-uploader-controls">
        <label className="choose-button">{t('images.chooseImage')}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} />
        </label>
        <button className="primary-button" type="button" disabled={!file || (progress > 0 && progress < 100)} onClick={upload}>
          {progress > 0 && progress < 100 ? t('images.uploading', { percent: progress }) : t('services.uploadLogo')}
        </button>
      </div>
      <label className="logo-url-field">{t('services.logoUrl')}
        <input type="url" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="https://your-domain.com/services/logo/..." />
      </label>
      {status.message && <p className={`status-message ${status.type}`}>{status.message}</p>}
    </div>
  )
}
