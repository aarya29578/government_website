import { useEffect, useState } from 'react'
import { imageTypes } from '../../config/adminConfig'
import { uploadImage, validateImage } from '../../services/imageUploadService'
import { useLanguage } from '../../i18n/LanguageContext'

export function ImageUploader({ type, value, onUploaded }) {
  const { t } = useLanguage()
  const config = imageTypes.find((item) => item.key === type)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(value || '')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [progress, setProgress] = useState(0)

  useEffect(() => { setPreview(value || '') }, [value])
  useEffect(() => () => file && URL.revokeObjectURL(preview), [file, preview])

  const chooseFile = (event) => {
    const selected = event.target.files?.[0]
    const error = validateImage(selected)
    if (error) { setStatus({ type: 'error', message: t(error) }); setFile(null); return }
    setStatus({ type: '', message: '' }); setFile(selected); setPreview(URL.createObjectURL(selected))
  }

  const handleUpload = async () => {
    try {
      setStatus({ type: '', message: '' }); setProgress(0)
      const response = await uploadImage(file, type, setProgress)
      console.info('[Image upload extracted publicUrl]', { publicUrl: response.publicUrl })
      await onUploaded(config.field, response.publicUrl)
      setFile(null); setProgress(100); setStatus({ type: 'success', message: t('images.uploadedAndSaved') })
    } catch (error) { setStatus({ type: 'error', message: t(error.message) }); setProgress(0) }
  }

  return (
    <article className="upload-card">
      <div className="upload-card-head"><div><h3>{t(config.labelKey)}</h3><p>{t(config.descriptionKey)}</p></div><span className="file-limit">{t('images.maxSize')}</span></div>
      <div className="preview-frame">{preview ? <img src={preview} alt={`${t(config.labelKey)} preview`} /> : <div className="empty-preview"><span>▧</span><small>{t('images.notConfigured')}</small></div>}</div>
      <div className="upload-actions">
        <label className="choose-button">{t('images.chooseImage')}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} /></label>
        <button className="primary-button" type="button" disabled={!file || progress > 0 && progress < 100} onClick={handleUpload}>{progress > 0 && progress < 100 ? t('images.uploading', { percent: progress }) : t('images.uploadImage')}</button>
      </div>
      {progress > 0 && progress < 100 && <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>}
      {file && <p className="selected-file">{t('images.selected', { name: file.name })}</p>}
      {status.message && <p className={`status-message ${status.type}`}>{status.message}</p>}
    </article>
  )
}
