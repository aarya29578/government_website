import { useState } from 'react'
import { serviceIconOptions } from '../../config/adminConfig'
import { ServiceLogoUploader } from './ServiceLogoUploader'
import { useLanguage } from '../../i18n/LanguageContext'

const emptyForm = { name: '', description: '', titleMr: '', descriptionMr: '', logoUrl: '', icon: 'default', status: 'active', displayOrder: 1 }

export function ServiceFormModal({ service, onSave, onClose }) {
  const { t } = useLanguage()
  const [form, setForm] = useState(service ? {
    name: service.name || '',
    description: service.description || '',
    titleMr: service.titleMr || '',
    descriptionMr: service.descriptionMr || '',
    logoUrl: service.logoUrl || '',
    icon: service.icon || 'default',
    status: service.status || 'active',
    displayOrder: service.displayOrder ?? 1,
  } : emptyForm)
  const [state, setState] = useState({ saving: false, error: '' })

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) { setState({ saving: false, error: t('services.nameRequired') }); return }
    setState({ saving: true, error: '' })
    try {
      await onSave(form)
    } catch (error) {
      setState({ saving: false, error: t(error.message) || t('services.saveError') })
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-head">
          <h3>{service ? t('services.editService') : t('services.addService')}</h3>
          <button className="modal-close" type="button" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={submit}>
          <label>{t('services.serviceName')}
            <input type="text" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Passport Service" />
          </label>
          <label>{t('services.shortDescription')}
            <textarea rows={3} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="New passport application, renewal and appointment." />
          </label>
          <label>{t('services.nameMarathi')}
            <input type="text" value={form.titleMr} onChange={(event) => update('titleMr', event.target.value)} placeholder="पासपोर्ट सेवा" />
          </label>
          <label>{t('services.descriptionMarathi')}
            <textarea rows={3} value={form.descriptionMr} onChange={(event) => update('descriptionMr', event.target.value)} placeholder="नवीन पासपोर्ट अर्ज, नूतनीकरण आणि भेट." />
          </label>
          <label>{t('services.serviceLogo')}</label>
          <ServiceLogoUploader value={form.logoUrl} onChange={(url) => update('logoUrl', url)} />
          <label>{t('services.icon')}
            <select value={form.icon} onChange={(event) => update('icon', event.target.value)}>
              {serviceIconOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
            </select>
          </label>
          <div className="modal-form-row">
            <label>{t('services.status')}
              <select value={form.status} onChange={(event) => update('status', event.target.value)}>
                <option value="active">{t('common.active')}</option>
                <option value="inactive">{t('common.inactive')}</option>
              </select>
            </label>
            <label>{t('services.displayOrder')}
              <input type="number" min="1" value={form.displayOrder} onChange={(event) => update('displayOrder', event.target.value)} />
            </label>
          </div>
          {state.error && <p className="status-message error">{state.error}</p>}
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>{t('common.cancel')}</button>
            <button className="primary-button" type="submit" disabled={state.saving}>{state.saving ? t('common.saving') : t('common.save')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
