import { resolveFieldText } from '../i18n/contentText'
import { useLanguage } from '../i18n/LanguageContext'

export function FormField({ field, value, error, onChange }) {
  const { t, language } = useLanguage()
  const { key, type, required, options = [] } = field
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
