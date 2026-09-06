import { useState } from 'react'
import { createAdminUser } from '../services/adminUsersService'
import { useLanguage } from '../i18n/LanguageContext'

const emptyForm = { email: '', password: '', confirmPassword: '' }

export function AddAdminUser({ onNavigate }) {
  const { t } = useLanguage()
  const [step, setStep] = useState('create')
  const [form, setForm] = useState(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [createState, setCreateState] = useState({ saving: false, error: '' })
  const [createdEmail, setCreatedEmail] = useState('')

  const resetAll = () => {
    setStep('create')
    setForm(emptyForm)
    setFieldErrors({})
    setCreateState({ saving: false, error: '' })
    setCreatedEmail('')
  }

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const validateCreateForm = () => {
    const errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = t('addAdmin.errors.invalidEmail')
    if (form.password.length < 6) errors.password = t('addAdmin.errors.weakPassword')
    if (form.password !== form.confirmPassword) errors.confirmPassword = t('addAdmin.errors.passwordMismatch')
    return errors
  }

  const submitCreate = async (event) => {
    event.preventDefault()
    if (createState.saving) return
    const errors = validateCreateForm()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setCreateState({ saving: true, error: '' })
    try {
      const result = await createAdminUser({ email: form.email.trim(), password: form.password })
      setCreatedEmail(result.email)
      setForm(emptyForm)
      setFieldErrors({})
      setCreateState({ saving: false, error: '' })
      setStep('success')
    } catch (error) {
      setCreateState({ saving: false, error: t(error.message) })
      setForm((current) => ({ ...current, password: '', confirmPassword: '' }))
    }
  }

  return (
    <div className="add-admin-page">
      <div className="page-heading">
        <div>
          <span className="section-kicker">{t('addAdmin.kicker')}</span>
          <h2>{t('addAdmin.title')}</h2>
          <p>{t('addAdmin.subtitle')}</p>
        </div>
      </div>

      {step === 'create' && (
        <form className="settings-card add-admin-card" onSubmit={submitCreate}>
          <label>{t('addAdmin.newAdminEmail')}
            <input type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="admin@example.com" />
          </label>
          {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
          <label>{t('addAdmin.newAdminPassword')}
            <div className="password-field">
              <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder={t('addAdmin.passwordPlaceholder')} />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? t('common.hide') : t('common.show')}</button>
            </div>
          </label>
          {fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
          <label>{t('addAdmin.confirmPassword')}
            <div className="password-field">
              <input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} placeholder={t('addAdmin.confirmPasswordPlaceholder')} />
              <button type="button" onClick={() => setShowConfirm((value) => !value)}>{showConfirm ? t('common.hide') : t('common.show')}</button>
            </div>
          </label>
          {fieldErrors.confirmPassword && <small className="field-error">{fieldErrors.confirmPassword}</small>}
          {createState.error && <p className="status-message error">{createState.error}</p>}
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => onNavigate('dashboard')}>{t('common.cancel')}</button>
            <button className="primary-button" type="submit" disabled={createState.saving}>
              {createState.saving ? t('addAdmin.creating') : t('addAdmin.createAdminUser')}
            </button>
          </div>
        </form>
      )}

      {step === 'success' && (
        <div className="settings-card add-admin-card add-admin-success">
          <p className="status-message success">{t('addAdmin.createdSuccessfully')}</p>
          <div className="add-admin-success-email">
            <span>{t('addAdmin.emailLabel')}</span>
            <strong>{createdEmail}</strong>
          </div>
          <p>{t('addAdmin.newAdminCanLogin')}</p>
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={resetAll}>{t('addAdmin.createAnother')}</button>
            <button className="primary-button" type="button" onClick={() => onNavigate('dashboard')}>{t('addAdmin.goToDashboard')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
