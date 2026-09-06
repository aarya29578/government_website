import { useEffect, useState } from 'react'
import { ImagePlaceholderIcon } from '../components/icons/ImagePlaceholderIcon'
import { ServiceFormModal } from '../components/services/ServiceFormModal'
import { loadServiceSubmissions } from '../services/submissionsService'
import { useLanguage } from '../i18n/LanguageContext'
import {
  addService,
  deleteService,
  editService,
  loadServiceForm,
  loadServices,
  setServiceStatus,
} from '../services/servicesService'

export function Services({ onManageForm }) {
  const { t } = useLanguage()
  const [services, setServices] = useState([])
  const [submissionCounts, setSubmissionCounts] = useState({})
  const [fieldCounts, setFieldCounts] = useState({})
  const [state, setState] = useState({ loading: true, error: '', message: '' })
  const [modalService, setModalService] = useState(undefined)

  const refresh = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const [nextServices, submissions] = await Promise.all([loadServices(), loadServiceSubmissions()])
      setServices(nextServices)
      const counts = {}
      submissions.forEach((item) => { counts[item.serviceId] = (counts[item.serviceId] || 0) + 1 })
      setSubmissionCounts(counts)
      const fieldLists = await Promise.all(nextServices.map((service) => loadServiceForm(service.id)))
      const nextFieldCounts = {}
      nextServices.forEach((service, index) => { nextFieldCounts[service.id] = fieldLists[index].length })
      setFieldCounts(nextFieldCounts)
      setState({ loading: false, error: '', message: '' })
    } catch (error) {
      setState({ loading: false, error: t(error.message) || t('services.loadError'), message: '' })
    }
  }

  useEffect(() => { refresh() }, [])

  const saveService = async (form) => {
    const existingSlugs = services.filter((item) => item.id !== modalService?.id).map((item) => item.slug)
    if (modalService) await editService(modalService.id, form)
    else await addService(form, existingSlugs)
    setModalService(undefined)
    await refresh()
    setState((current) => ({ ...current, message: modalService ? t('services.updated') : t('services.created') }))
  }

  const toggleStatus = async (service) => {
    await setServiceStatus(service.id, service.status === 'active' ? 'inactive' : 'active')
    await refresh()
  }

  const removeService = async (service) => {
    const count = submissionCounts[service.id] || 0
    if (count > 0) { window.alert(t('services.cannotDeleteHasSubmissions')); return }
    if (!window.confirm(t('services.deleteConfirm', { name: service.name }))) return
    await deleteService(service.id)
    await refresh()
    setState((current) => ({ ...current, message: t('services.deleted') }))
  }

  return (
    <div className="services-page">
      <div className="page-heading">
        <div>
          <span className="section-kicker">{t('services.kicker')}</span>
          <h2>{t('services.title')}</h2>
          <p>{t('services.subtitle')}</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setModalService(null)}>{t('services.addService')}</button>
      </div>

      {state.message && <p className="status-message success">{state.message}</p>}
      {state.error && <p className="status-message error">{state.error}</p>}

      {state.loading ? <p>{t('services.loading')}</p> : services.length === 0 ? (
        <p>{t('services.empty')}</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('services.table.logo')}</th><th>{t('services.table.service')}</th><th>{t('services.table.status')}</th><th>{t('services.table.fields')}</th><th>{t('services.table.submissions')}</th><th>{t('services.table.order')}</th><th>{t('services.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.logoUrl ? <img className="table-logo" src={service.logoUrl} alt={service.name} /> : <span className="table-logo table-logo-fallback"><ImagePlaceholderIcon /></span>}</td>
                  <td>
                    <strong>{service.name}</strong>
                    <small className="table-subtext">{service.description}</small>
                  </td>
                  <td><span className={`status-badge ${service.status}`}>{service.status === 'active' ? t('common.active') : t('common.inactive')}</span></td>
                  <td>{fieldCounts[service.id] ?? '—'}</td>
                  <td>{submissionCounts[service.id] || 0}</td>
                  <td>{service.displayOrder}</td>
                  <td className="table-actions">
                    <button className="text-button" type="button" onClick={() => setModalService(service)}>{t('common.edit')}</button>
                    <button className="text-button" type="button" onClick={() => onManageForm(service.id)}>{t('services.manageForm')}</button>
                    <button className="text-button" type="button" onClick={() => toggleStatus(service)}>{service.status === 'active' ? t('common.deactivate') : t('common.activate')}</button>
                    <button className="text-button danger" type="button" onClick={() => removeService(service)}>{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalService !== undefined && (
        <ServiceFormModal service={modalService} onSave={saveService} onClose={() => setModalService(undefined)} />
      )}
    </div>
  )
}
