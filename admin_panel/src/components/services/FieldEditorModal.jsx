import { useState } from 'react'
import { fieldTypeOptions } from '../../config/adminConfig'
import { useLanguage } from '../../i18n/LanguageContext'

function slugify(label) {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '')
}

const emptyField = { label: '', labelMr: '', key: '', type: 'text', required: false, placeholder: '', placeholderMr: '', options: [] }

export function FieldEditorModal({ field, onSave, onClose }) {
  const { t } = useLanguage()
  const [form, setForm] = useState(field ? { ...emptyField, ...field, options: field.options || [] } : emptyField)
  const [optionsText, setOptionsText] = useState((field?.options || []).join('\n'))
  const [keyEdited, setKeyEdited] = useState(Boolean(field))
  const [error, setError] = useState('')

  const updateLabel = (label) => {
    setForm((current) => ({ ...current, label, key: keyEdited ? current.key : slugify(label) }))
  }

  const submit = (event) => {
    event.preventDefault()
    if (!form.label.trim()) { setError(t('manageForm.labelRequired')); return }
    if (!form.key.trim()) { setError(t('manageForm.keyRequired')); return }
    const options = optionsText.split('\n').map((option) => option.trim()).filter(Boolean)
    if (['select', 'radio'].includes(form.type) && options.length === 0) { setError(t('manageForm.optionsRequired')); return }
    onSave({ ...form, key: form.key.trim(), label: form.label.trim(), options })
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-head">
          <h3>{field ? t('manageForm.editField') : t('manageForm.addFieldTitle')}</h3>
          <button className="modal-close" type="button" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={submit}>
          <label>{t('manageForm.label')}
            <input type="text" value={form.label} onChange={(event) => updateLabel(event.target.value)} placeholder="Full Name" />
          </label>
          <label>{t('manageForm.labelMarathi')}
            <input type="text" value={form.labelMr} onChange={(event) => setForm((current) => ({ ...current, labelMr: event.target.value }))} placeholder="पूर्ण नाव" />
          </label>
          <label>{t('manageForm.fieldKey')}
            <input type="text" value={form.key} onChange={(event) => { setKeyEdited(true); setForm((current) => ({ ...current, key: event.target.value })) }} placeholder="fullName" />
          </label>
          <label>{t('manageForm.type')}
            <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
              {fieldTypeOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
            </select>
          </label>
          {['select', 'radio'].includes(form.type) && (
            <label>{t('manageForm.options')}
              <textarea rows={4} value={optionsText} onChange={(event) => setOptionsText(event.target.value)} placeholder={'Male\nFemale\nOther'} />
            </label>
          )}
          <label>{t('manageForm.placeholder')}
            <input type="text" value={form.placeholder} onChange={(event) => setForm((current) => ({ ...current, placeholder: event.target.value }))} placeholder="Enter your full name" />
          </label>
          <label>{t('manageForm.placeholderMarathi')}
            <input type="text" value={form.placeholderMr} onChange={(event) => setForm((current) => ({ ...current, placeholderMr: event.target.value }))} placeholder="तुमचे पूर्ण नाव टाका" />
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={form.required} onChange={(event) => setForm((current) => ({ ...current, required: event.target.checked }))} />
            {t('manageForm.required')}
          </label>
          {error && <p className="status-message error">{error}</p>}
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>{t('common.cancel')}</button>
            <button className="primary-button" type="submit">{t('manageForm.saveField')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
