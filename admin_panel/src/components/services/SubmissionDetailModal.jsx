import { useEffect, useState } from 'react'
import { loadServiceForm } from '../../services/servicesService'
import { generateApplicantPdf } from '../../utils/generateApplicantPdf'
import { useLanguage } from '../../i18n/LanguageContext'

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  )
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '—'
  return timestamp.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function labelize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
}

function SubmissionImagePreview({ value }) {
  const { t } = useLanguage()
  const [broken, setBroken] = useState(false)
  const url = value?.url
  if (!url || broken) return <span className="submission-image-fallback">{t('formsData.imageUnavailable')}</span>
  return (
    <a href={url} target="_blank" rel="noreferrer" className="submission-image-link">
      <img src={url} alt="" className="submission-image-thumb" onError={() => setBroken(true)} />
    </a>
  )
}

export function SubmissionDetailModal({ submission, statusOptions, onStatusChange, onClose }) {
  const { t, language } = useLanguage()
  const [fields, setFields] = useState([])
  const [pdfState, setPdfState] = useState({ generating: false, error: '' })

  useEffect(() => {
    let active = true
    loadServiceForm(submission.serviceId)
      .then((result) => { if (active) setFields(result) })
      .catch(() => { if (active) setFields([]) })
    return () => { active = false }
  }, [submission.serviceId])

  const fieldByKey = Object.fromEntries(fields.map((field) => [field.key, field]))
  const fieldLabel = (key) => {
    const field = fieldByKey[key]
    if (!field) return labelize(key)
    return (language === 'mr' && field.labelMr) || field.label || labelize(key)
  }

  const downloadPdf = async () => {
    if (pdfState.generating) return
    setPdfState({ generating: true, error: '' })
    try {
      await generateApplicantPdf({ submission, fields, language, t })
      setPdfState({ generating: false, error: '' })
    } catch {
      setPdfState({ generating: false, error: t('formsData.pdfError') })
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-head">
          <h3>{submission.serviceName}</h3>
          <button className="modal-close" type="button" onClick={onClose}>&times;</button>
        </div>
        <div className="submission-detail">
          <h4>{t('formsData.applicantInformation')}</h4>
          <dl>
            {Object.entries(submission.formData || {}).map(([key, value]) => {
              const isImage = fieldByKey[key]?.type === 'image' || (value && typeof value === 'object' && value.type === 'image')
              return (
                <div key={key} className={isImage ? 'submission-image-row' : ''}>
                  <dt>{fieldLabel(key)}</dt>
                  <dd>
                    {isImage
                      ? <SubmissionImagePreview value={value} />
                      : (typeof value === 'boolean' ? (value ? t('common.yes') : t('common.no')) : String(value ?? '—'))}
                  </dd>
                </div>
              )
            })}
          </dl>
          <div className="submission-meta">
            <span><strong>{t('formsData.submitted')}:</strong> {formatDate(submission.submittedAt)}</span>
            <label>{t('formsData.status')}
              <select value={submission.status} onChange={(event) => onStatusChange(submission.id, event.target.value)}>
                {statusOptions.map((option) => <option key={option} value={option}>{t(`status.${option}`)}</option>)}
              </select>
            </label>
          </div>
          <div className="submission-footer">
            {pdfState.error && <p className="status-message error">{pdfState.error}</p>}
            <button className="secondary-button pdf-download-button" type="button" onClick={downloadPdf} disabled={pdfState.generating}>
              <DownloadIcon />
              {pdfState.generating ? t('formsData.generatingPdf') : t('formsData.downloadPdf')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
