import { useEffect, useState } from 'react'
import { updateSettings } from '../services/settingsService'
import { useLanguage } from '../i18n/LanguageContext'

export function WebsiteSettings({ settings, onSettingsChange }) {
  const { t } = useLanguage()
  const [form, setForm] = useState(settings)
  const [state, setState] = useState({ loading: false, message: '', error: '' })
  useEffect(() => setForm(settings), [settings])
  const save = async (event) => {
    event.preventDefault(); setState({ loading: true, message: '', error: '' })
    try { const next = await updateSettings(form); onSettingsChange(next); setState({ loading: false, message: t('settings.saved'), error: '' }) }
    catch (error) { setState({ loading: false, message: '', error: t(error.message) || t('settings.saveError') }) }
  }
  return (
    <div className="settings-page">
      <div className="page-heading"><div><span className="section-kicker">{t('settings.kicker')}</span><h2>{t('settings.title')}</h2><p>{t('settings.subtitle')}</p></div></div>
      <form className="settings-card" onSubmit={save}>
        <div className="settings-card-head"><div><h3>{t('settings.generalConfig')}</h3><p>{t('settings.generalConfigNote')}</p></div><span className="firestore-note">Firestore · siteSettings/general</span></div>
        <div className="settings-fields">
          <label>{t('settings.logoUrl')}<input type="url" value={form.logoUrl} onChange={(event) => setForm({ ...form, logoUrl: event.target.value })} placeholder="https://your-domain.com/website/logo/..." /></label>
          <label>{t('settings.qrCodeUrl')}<input type="url" value={form.qrCodeUrl} onChange={(event) => setForm({ ...form, qrCodeUrl: event.target.value })} placeholder="https://your-domain.com/website/qr-code/..." /></label>
          <label>{t('settings.googlePlayUrl')}<input type="url" value={form.googlePlayUrl} onChange={(event) => setForm({ ...form, googlePlayUrl: event.target.value })} placeholder="https://your-domain.com/website/google-play/..." /></label>
          <label>{t('settings.whatsappNumber')}<input type="text" value={form.whatsappNumber} onChange={(event) => setForm({ ...form, whatsappNumber: event.target.value })} placeholder="919876543210" /></label>
        </div>
        {state.message && <p className="status-message success">{state.message}</p>}
        {state.error && <p className="status-message error">{state.error}</p>}
        <div className="form-actions"><button className="primary-button" type="submit" disabled={state.loading}>{state.loading ? t('common.saving') : t('common.saveSettings')}</button></div>
      </form>
    </div>
  )
}
