import { useEffect, useState } from 'react'
import { updateSettings } from '../services/settingsService'
import { normalizeWhatsAppNumber } from '../utils/whatsapp'
import { useLanguage } from '../i18n/LanguageContext'

export function WhatsAppNumber({ settings, onSettingsChange }) {
  const { t } = useLanguage()
  const [value, setValue] = useState(settings.whatsappNumber || '')
  const [state, setState] = useState({ loading: false, message: '', error: '' })
  useEffect(() => setValue(settings.whatsappNumber || ''), [settings])

  const save = async (event) => {
    event.preventDefault()
    const normalized = normalizeWhatsAppNumber(value)
    if (!normalized) { setState({ loading: false, message: '', error: t('whatsapp.invalidNumber') }); return }
    setState({ loading: true, message: '', error: '' })
    try {
      const next = await updateSettings({ ...settings, whatsappNumber: normalized })
      onSettingsChange(next)
      setValue(normalized)
      setState({ loading: false, message: t('whatsapp.saved'), error: '' })
    } catch (error) {
      setState({ loading: false, message: '', error: t(error.message) || t('settings.saveError') })
    }
  }

  return (
    <div className="settings-page">
      <div className="page-heading"><div><span className="section-kicker">{t('whatsapp.kicker')}</span><h2>{t('whatsapp.title')}</h2><p>{t('whatsapp.subtitle')}</p></div></div>
      <form className="settings-card" onSubmit={save}>
        <div className="settings-card-head"><div><h3>{t('whatsapp.title')}</h3><p>{t('whatsapp.subtitle')}</p></div><span className="firestore-note">Firestore · siteSettings/general</span></div>
        <div className="settings-fields">
          <label>{t('whatsapp.numberLabel')}<input type="text" value={value} onChange={(event) => setValue(event.target.value)} placeholder="+91 98765 43210" /></label>
        </div>
        {state.message && <p className="status-message success">{state.message}</p>}
        {state.error && <p className="status-message error">{state.error}</p>}
        <div className="form-actions"><button className="primary-button" type="submit" disabled={state.loading}>{state.loading ? t('common.saving') : t('whatsapp.saveButton')}</button></div>
      </form>
    </div>
  )
}
