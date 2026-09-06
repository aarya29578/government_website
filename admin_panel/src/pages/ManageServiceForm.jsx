import { useEffect, useState } from 'react'
import { FieldEditorModal } from '../components/services/FieldEditorModal'
import { loadServices, loadServiceForm, moveField, saveServiceForm } from '../services/servicesService'
import { fieldTypeOptions } from '../config/adminConfig'
import { useLanguage } from '../i18n/LanguageContext'

let fieldIdCounter = 0
function nextFieldId() { fieldIdCounter += 1; return `field-${Date.now()}-${fieldIdCounter}` }

export function ManageServiceForm({ serviceId, onBack }) {
  const { t } = useLanguage()
  const [service, setService] = useState(null)
  const [fields, setFields] = useState([])
  const [state, setState] = useState({ loading: true, error: '', message: '' })
  const [editingField, setEditingField] = useState(undefined)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [services, formFields] = await Promise.all([loadServices(), loadServiceForm(serviceId)])
        if (!active) return
        setService(services.find((item) => item.id === serviceId) || null)
        setFields(formFields)
        setState({ loading: false, error: '', message: '' })
      } catch (error) {
        if (active) setState({ loading: false, error: t(error.message) || t('manageForm.loadError'), message: '' })
      }
    }
    load()
    return () => { active = false }
  }, [serviceId, t])

  const save = async (nextFields) => {
    const ordered = await saveServiceForm(serviceId, nextFields)
    setFields(ordered)
    setState((current) => ({ ...current, message: t('manageForm.saved') }))
  }

  const addField = (field) => { setFields((current) => [...current, { ...field, id: nextFieldId() }]); setEditingField(undefined) }
  const updateField = (field) => { setFields((current) => current.map((item) => (item.id === editingField.id ? { ...item, ...field } : item))); setEditingField(undefined) }
  const deleteField = (fieldId) => { if (window.confirm(t('manageForm.deleteFieldConfirm'))) setFields((current) => current.filter((item) => item.id !== fieldId)) }
  const move = (index, direction) => setFields((current) => moveField(current, index, direction))

  if (state.loading) return <p>{t('manageForm.loading')}</p>
  if (state.error) return <p className="status-message error">{state.error}</p>
  if (!service) return <p className="status-message error">{t('manageForm.notFound')}</p>

  const fieldTypeLabel = (type) => t(fieldTypeOptions.find((option) => option.value === type)?.labelKey || type)

  return (
    <div className="manage-form-page">
      <div className="page-heading">
        <div>
          <span className="section-kicker">{t('manageForm.kicker')}</span>
          <h2>{service.name}</h2>
          <p>{service.description}</p>
        </div>
        <button className="text-button" type="button" onClick={onBack}>{t('manageForm.backToServices')}</button>
      </div>

      {state.message && <p className="status-message success">{state.message}</p>}

      {fields.length === 0 ? (
        <p>{t('manageForm.noFields')}</p>
      ) : (
        <div className="field-list">
          {fields.map((field, index) => (
            <article key={field.id} className="field-card">
              <div>
                <strong>{field.label}</strong>
                <span className="field-card-type">{fieldTypeLabel(field.type)}{field.required ? ` · ${t('manageForm.required')}` : ''}</span>
              </div>
              <div className="field-card-actions">
                <button className="text-button" type="button" disabled={index === 0} onClick={() => move(index, -1)}>{t('manageForm.moveUp')}</button>
                <button className="text-button" type="button" disabled={index === fields.length - 1} onClick={() => move(index, 1)}>{t('manageForm.moveDown')}</button>
                <button className="text-button" type="button" onClick={() => setEditingField(field)}>{t('common.edit')}</button>
                <button className="text-button danger" type="button" onClick={() => deleteField(field.id)}>{t('common.delete')}</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="form-actions manage-form-actions">
        <button className="secondary-button" type="button" onClick={() => setEditingField(null)}>{t('manageForm.addField')}</button>
        <button className="primary-button" type="button" onClick={() => save(fields)}>{t('manageForm.saveForm')}</button>
      </div>

      {editingField !== undefined && (
        <FieldEditorModal
          field={editingField}
          onSave={editingField ? updateField : addField}
          onClose={() => setEditingField(undefined)}
        />
      )}
    </div>
  )
}
