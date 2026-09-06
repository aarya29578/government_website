import { useEffect, useState } from 'react'
import { SubmissionDetailModal } from '../components/services/SubmissionDetailModal'
import { serviceSubmissionStatusOptions } from '../config/adminConfig'
import { loadServices } from '../services/servicesService'
import { filterServiceSubmissions, loadServiceSubmissions, updateServiceSubmissionStatus } from '../services/submissionsService'
import { useLanguage } from '../i18n/LanguageContext'

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '—'
  return timestamp.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function FormsData() {
  const { t } = useLanguage()
  const [services, setServices] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [serviceId, setServiceId] = useState('')
  const [search, setSearch] = useState('')
  const [state, setState] = useState({ loading: true, error: '' })
  const [selected, setSelected] = useState(null)

  const refresh = async () => {
    setState({ loading: true, error: '' })
    try {
      const [nextServices, nextSubmissions] = await Promise.all([loadServices(), loadServiceSubmissions()])
      setServices(nextServices)
      setSubmissions(nextSubmissions)
      setState({ loading: false, error: '' })
    } catch (error) {
      setState({ loading: false, error: t(error.message) || t('formsData.loadError') })
    }
  }

  useEffect(() => { refresh() }, [])

  const changeStatus = async (submissionId, status) => {
    await updateServiceSubmissionStatus(submissionId, status)
    setSubmissions((current) => current.map((item) => (item.id === submissionId ? { ...item, status } : item)))
    setSelected((current) => (current && current.id === submissionId ? { ...current, status } : current))
  }

  const filtered = filterServiceSubmissions(submissions, { serviceId, search })

  return (
    <div className="forms-data-page">
      <div className="page-heading">
        <div>
          <span className="section-kicker">{t('formsData.kicker')}</span>
          <h2>{t('formsData.title')}</h2>
          <p>{t('formsData.subtitle')}</p>
        </div>
      </div>

      <div className="filters-row">
        <select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
          <option value="">{t('formsData.allServices')}</option>
          {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
        </select>
        <input type="search" placeholder={t('formsData.searchPlaceholder')} value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {state.error && <p className="status-message error">{state.error}</p>}

      {state.loading ? <p>{t('formsData.loading')}</p> : filtered.length === 0 ? (
        <p>{t('formsData.empty')}</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>{t('formsData.table.service')}</th><th>{t('formsData.table.name')}</th><th>{t('formsData.table.mobile')}</th><th>{t('formsData.table.submitted')}</th><th>{t('formsData.table.status')}</th><th>{t('formsData.table.actions')}</th></tr>
            </thead>
            <tbody>
              {filtered.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.serviceName}</td>
                  <td>{submission.formData?.fullName || submission.formData?.name || '—'}</td>
                  <td>{submission.formData?.mobileNumber || submission.formData?.phone || '—'}</td>
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
          submission={selected}
          statusOptions={serviceSubmissionStatusOptions}
          onStatusChange={changeStatus}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
