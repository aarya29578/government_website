import { useEffect, useState } from 'react'
import { SubmissionDetailModal } from '../components/services/SubmissionDetailModal'
import { contactSubmissionStatusOptions } from '../config/adminConfig'
import { emptyContactSettings, loadContactSettings, updateContactSettings } from '../services/contactService'
import { filterContactSubmissions, loadContactSubmissions, updateContactSubmissionStatus } from '../services/submissionsService'
import { useLanguage } from '../i18n/LanguageContext'

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '—'
  return timestamp.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function GetInTouch() {
  const { t } = useLanguage()
  const [form, setForm] = useState(emptyContactSettings)
  const [saveState, setSaveState] = useState({ saving: false, message: '', error: '' })
  const [submissions, setSubmissions] = useState([])
  const [search, setSearch] = useState('')
  const [listState, setListState] = useState({ loading: true, error: '' })
  const [selected, setSelected] = useState(null)

  const refreshSubmissions = async () => {
    setListState({ loading: true, error: '' })
    try {
      setSubmissions(await loadContactSubmissions())
      setListState({ loading: false, error: '' })
    } catch (error) {
      setListState({ loading: false, error: t(error.message) || t('getInTouch.loadError') })
    }
  }

  useEffect(() => {
    loadContactSettings().then(setForm).catch(() => {})
    refreshSubmissions()
  }, [])

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const save = async (event) => {
    event.preventDefault()
    setSaveState({ saving: true, message: '', error: '' })
    try {
      await updateContactSettings(form)
      setSaveState({ saving: false, message: t('getInTouch.saved'), error: '' })
    } catch (error) {
      setSaveState({ saving: false, message: '', error: t(error.message) || t('getInTouch.saveError') })
    }
  }

  const changeStatus = async (submissionId, status) => {
    await updateContactSubmissionStatus(submissionId, status)
    setSubmissions((current) => current.map((item) => (item.id === submissionId ? { ...item, status } : item)))
    setSelected((current) => (current && current.id === submissionId ? { ...current, status } : current))
  }

  const filtered = filterContactSubmissions(submissions, { search })

  return (
    <div className="get-in-touch-page">
      <div className="page-heading">
        <div>
          <span className="section-kicker">{t('getInTouch.kicker')}</span>
          <h2>{t('getInTouch.editTitle')}</h2>
          <p>{t('getInTouch.editSubtitle')}</p>
        </div>
      </div>

      <form className="settings-card" onSubmit={save}>
        <div className="settings-fields">
          <label>{t('getInTouch.sectionTitle')}<input type="text" value={form.sectionTitle} onChange={(event) => update('sectionTitle', event.target.value)} /></label>
          <label>{t('getInTouch.addressHeading')}<input type="text" value={form.addressHeading} onChange={(event) => update('addressHeading', event.target.value)} /></label>
          <label>{t('getInTouch.branch1Address')}<textarea rows={2} value={form.branch1Address} onChange={(event) => update('branch1Address', event.target.value)} /></label>
          <label>{t('getInTouch.branch2Address')}<textarea rows={2} value={form.branch2Address} onChange={(event) => update('branch2Address', event.target.value)} /></label>
          <label>{t('getInTouch.googleMapsUrl')}<input type="url" value={form.googleMapsUrl} onChange={(event) => update('googleMapsUrl', event.target.value)} /></label>
          <label>{t('getInTouch.phoneNumber')}<input type="text" value={form.phoneNumber} onChange={(event) => update('phoneNumber', event.target.value)} /></label>
          <label>{t('getInTouch.email')}<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
          <label>{t('getInTouch.whatsappNumber')}<input type="text" value={form.whatsappNumber} onChange={(event) => update('whatsappNumber', event.target.value)} /></label>
          <label>{t('getInTouch.enquiryFormTitle')}<input type="text" value={form.enquiryFormTitle} onChange={(event) => update('enquiryFormTitle', event.target.value)} /></label>
          <label>{t('getInTouch.fullNameLabel')}<input type="text" value={form.fullNameLabel} onChange={(event) => update('fullNameLabel', event.target.value)} /></label>
          <label>{t('getInTouch.mobileNumberLabel')}<input type="text" value={form.mobileNumberLabel} onChange={(event) => update('mobileNumberLabel', event.target.value)} /></label>
          <label>{t('getInTouch.emailLabel')}<input type="text" value={form.emailLabel} onChange={(event) => update('emailLabel', event.target.value)} /></label>
          <label>{t('getInTouch.serviceLabel')}<input type="text" value={form.serviceLabel} onChange={(event) => update('serviceLabel', event.target.value)} /></label>
          <label>{t('getInTouch.messageLabel')}<input type="text" value={form.messageLabel} onChange={(event) => update('messageLabel', event.target.value)} /></label>
          <label>{t('getInTouch.submitButtonText')}<input type="text" value={form.submitButtonText} onChange={(event) => update('submitButtonText', event.target.value)} /></label>
        </div>
        {saveState.message && <p className="status-message success">{saveState.message}</p>}
        {saveState.error && <p className="status-message error">{saveState.error}</p>}
        <div className="form-actions"><button className="primary-button" type="submit" disabled={saveState.saving}>{saveState.saving ? t('common.saving') : t('getInTouch.saveChanges')}</button></div>
      </form>

      <div className="page-heading section-title-row">
        <div><h3>{t('getInTouch.submittedEnquiries')}</h3><p>{t('getInTouch.submittedEnquiriesSubtitle')}</p></div>
      </div>

      <div className="filters-row">
        <input type="search" placeholder={t('formsData.searchPlaceholder')} value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {listState.error && <p className="status-message error">{listState.error}</p>}

      {listState.loading ? <p>{t('getInTouch.loadingEnquiries')}</p> : filtered.length === 0 ? (
        <p>{t('getInTouch.noEnquiries')}</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>{t('formsData.table.name')}</th><th>{t('formsData.table.mobile')}</th><th>{t('getInTouch.table.email')}</th><th>{t('formsData.table.service')}</th><th>{t('getInTouch.table.message')}</th><th>{t('getInTouch.table.date')}</th><th>{t('formsData.table.status')}</th><th>{t('formsData.table.actions')}</th></tr>
            </thead>
            <tbody>
              {filtered.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.fullName}</td>
                  <td>{submission.mobileNumber}</td>
                  <td>{submission.email || '—'}</td>
                  <td>{submission.serviceName || '—'}</td>
                  <td className="table-subtext">{(submission.message || '').slice(0, 40)}{(submission.message || '').length > 40 ? '...' : ''}</td>
                  <td>{formatDate(submission.submittedAt)}</td>
                  <td><span className={`status-badge status-${submission.status}`}>{t(`status.${submission.status}`)}</span></td>
                  <td><button className="text-button" type="button" onClick={() => setSelected(submission)}>{t('common.view')}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <SubmissionDetailModal
          submission={{ ...selected, serviceName: t('getInTouch.enquiryLabel'), formData: { fullName: selected.fullName, mobileNumber: selected.mobileNumber, email: selected.email, service: selected.serviceName, message: selected.message } }}
          statusOptions={contactSubmissionStatusOptions}
          onStatusChange={changeStatus}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
