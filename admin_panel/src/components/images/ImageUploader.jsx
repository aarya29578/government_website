import { useEffect, useState } from 'react'
import { imageTypes } from '../../config/adminConfig'
import { uploadImage, validateImage } from '../../services/imageUploadService'

export function ImageUploader({ type, value, onUploaded }) {
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
    if (error) { setStatus({ type: 'error', message: error }); setFile(null); return }
    setStatus({ type: '', message: '' }); setFile(selected); setPreview(URL.createObjectURL(selected))
  }

  const handleUpload = async () => {
    try {
      setStatus({ type: '', message: '' }); setProgress(0)
      const response = await uploadImage(file, type, setProgress)
      console.info('[Image upload extracted publicUrl]', { publicUrl: response.publicUrl })
      await onUploaded(config.field, response.publicUrl)
      setFile(null); setProgress(100); setStatus({ type: 'success', message: 'Image uploaded and settings updated.' })
    } catch (error) { setStatus({ type: 'error', message: error.message }); setProgress(0) }
  }

  return <article className="upload-card"><div className="upload-card-head"><div><h3>{config.label}</h3><p>{config.description}</p></div><span className="file-limit">MAX 5 MB</span></div><div className="preview-frame">{preview ? <img src={preview} alt={`${config.label} preview`} /> : <div className="empty-preview"><span>▧</span><small>No image configured</small></div>}</div><div className="upload-actions"><label className="choose-button">Choose image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} /></label><button className="primary-button" type="button" disabled={!file || progress > 0 && progress < 100} onClick={handleUpload}>{progress > 0 && progress < 100 ? `Uploading ${progress}%` : 'Upload image'}</button></div>{progress > 0 && progress < 100 && <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>}{file && <p className="selected-file">Selected: {file.name}</p>}{status.message && <p className={`status-message ${status.type}`}>{status.message}</p>}</article>
}
