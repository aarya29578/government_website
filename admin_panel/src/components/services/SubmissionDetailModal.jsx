import { useLanguage } from '../../i18n/LanguageContext'

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '—'
  return timestamp.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function labelize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
}

export function SubmissionDetailModal({ submission, statusOptions, onStatusChange, onClose }) {
  const { t } = useLanguage()
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
            {Object.entries(submission.formData || {}).map(([key, value]) => (
              <div key={key}>
                <dt>{labelize(key)}</dt>
                <dd>{typeof value === 'boolean' ? (value ? t('common.yes') : t('common.no')) : String(value ?? '—')}</dd>
              </div>
            ))}
          </dl>
          <div className="submission-meta">
            <span><strong>{t('formsData.submitted')}:</strong> {formatDate(submission.submittedAt)}</span>
            <label>{t('formsData.status')}
              <select value={submission.status} onChange={(event) => onStatusChange(submission.id, event.target.value)}>
                {statusOptions.map((option) => <option key={option} value={option}>{t(`status.${option}`)}</option>)}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
