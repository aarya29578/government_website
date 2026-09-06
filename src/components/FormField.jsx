import { useEffect, useMemo, useState } from 'react'
import { resolveFieldText } from '../i18n/contentText'
import { useLanguage } from '../i18n/LanguageContext'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function isValidImageFile(file) {
  return Boolean(file) && ALLOWED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE
}

function ImageFieldInput({ field, value, error, onChange }) {
  const { t, language } = useLanguage()
  const { label } = resolveFieldText(field, language)
  const [localError, setLocalError] = useState('')
  const previewUrl = useMemo(() => (value instanceof File ? URL.createObjectURL(value) : ''), [value])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!isValidImageFile(file)) { setLocalError(t('serviceDetail.errors.imageInvalid')); return }
    setLocalError('')
    onChange(field.key, file)
  }

  return (
    <div className="form-field form-field-image">
      <span>{label}{field.required && <em>*</em>}</span>
      <small className="field-hint">{t('serviceDetail.imageHint')}</small>
      {previewUrl && (
        <span className="image-field-preview">
          <img src={previewUrl} alt="" />
        </span>
      )}
      <label className="image-field-choose">
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} hidden />
        <span className="button button-secondary image-field-choose-button">{value instanceof File ? t('serviceDetail.changeImage') : t('serviceDetail.chooseImage')}</span>
      </label>
      {(localError || error) && <small className="field-error">{localError || error}</small>}
    </div>
  )
}

export function FormField({ field, value, error, onChange }) {
  const { t, language } = useLanguage()
  const { key, type, required, options = [] } = field

  if (type === 'image') {
    return <ImageFieldInput field={field} value={value} error={error} onChange={onChange} />
  }

  const { label, placeholder } = resolveFieldText(field, language)
  const commonProps = {
    id: `field-${key}`,
    name: key,
    required,
    placeholder,
  }

  const handleChange = (event) => {
    const nextValue = type === 'checkbox' ? event.target.checked : event.target.value
    onChange(key, nextValue)
  }

  if (type === 'radio') {
    return (
      <fieldset className="form-field form-field-radio">
        <legend>{label}{required && <em>*</em>}</legend>
        <div className="radio-options">
          {options.map((option) => (
            <label key={option} className="radio-option">
              <input
                type="radio"
                name={key}
                required={required}
                checked={value === option}
                onChange={() => onChange(key, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {error && <small className="field-error">{error}</small>}
      </fieldset>
    )
  }

  return (
    <label className={`form-field ${type === 'checkbox' ? 'form-field-checkbox' : ''}`} htmlFor={commonProps.id}>
      {type !== 'checkbox' && <span>{label}{required && <em>*</em>}</span>}
      {type === 'textarea' && (
        <textarea {...commonProps} rows={4} value={value || ''} onChange={handleChange} />
      )}
      {type === 'select' && (
        <select {...commonProps} value={value || ''} onChange={handleChange}>
          <option value="">{t('serviceDetail.selectPlaceholder', { label })}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      )}
      {type === 'checkbox' && (
        <span className="checkbox-row">
          <input {...commonProps} type="checkbox" checked={Boolean(value)} onChange={handleChange} />
          <span>{label}{required && <em>*</em>}</span>
        </span>
      )}
      {!['textarea', 'select', 'checkbox'].includes(type) && (
        <input
          {...commonProps}
          type={type === 'phone' ? 'tel' : type}
          value={value || ''}
          onChange={handleChange}
        />
      )}
      {error && <small className="field-error">{error}</small>}
    </label>
  )
}

export function validateFields(fields, values, t, language) {
  const errors = {}
  fields.forEach((field) => {
    const value = values[field.key]
    const { label } = resolveFieldText(field, language)
    if (field.type === 'image') {
      if (field.required && !(value instanceof File)) { errors[field.key] = t('serviceDetail.errors.required', { label }); return }
      if (value instanceof File && !isValidImageFile(value)) { errors[field.key] = t('serviceDetail.errors.imageInvalid') }
      return
    }
    if (field.required) {
      const empty = field.type === 'checkbox' ? !value : !String(value ?? '').trim()
      if (empty) { errors[field.key] = t('serviceDetail.errors.required', { label }); return }
    }
    if (!value) return
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field.key] = t('serviceDetail.errors.email')
    }
    if (field.type === 'phone' && !/^[6-9]\d{9}$/.test(String(value).trim())) {
      errors[field.key] = t('serviceDetail.errors.phone')
    }
  })
  return errors
}
