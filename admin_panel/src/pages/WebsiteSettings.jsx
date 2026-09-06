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
        <div className="settings-card-head"><div><h3>{t('settings.aboutSection')}</h3><p>{t('settings.aboutSectionNote')}</p></div></div>
        <div className="settings-fields">
          <label>{t('settings.aboutDescriptionEn')}<textarea rows={4} value={form.aboutDescription} onChange={(event) => setForm({ ...form, aboutDescription: event.target.value })} placeholder="Welcome to the Citizen e-Service Center. Since 2022, we have been promptly providing customers with a variety of government and semi-government services. Our goal is to make it easy and convenient for ordinary citizens to benefit from all government schemes." /></label>
          <label>{t('settings.aboutDescriptionMr')}<textarea rows={4} value={form.aboutDescriptionMr} onChange={(event) => setForm({ ...form, aboutDescriptionMr: event.target.value })} placeholder="नागरिक ई-सेवा केंद्रामध्ये आपले स्वागत आहे. 2022 पासून आम्ही ग्राहकांना विविध शासकीय आणि निमशासकीय सेवा तत्परतेने पुरवत आहोत. आमचे उद्दिष्ट आहे की सामान्य नागरिकांना सर्व सरकारी योजनांचा लाभ सहज आणि सुलभतेने मिळावा." /></label>
        </div>
        <div className="settings-card-head"><div><h3>{t('settings.aboutStatsSection')}</h3><p>{t('settings.aboutStatsSectionNote')}</p></div></div>
        <div className="settings-fields">
          <label>{t('settings.aboutStat1ValueLabel')}<input type="text" value={form.aboutStat1Value} onChange={(event) => setForm({ ...form, aboutStat1Value: event.target.value })} placeholder="2022" /></label>
          <label>{t('settings.aboutStat1LabelEn')}<input type="text" value={form.aboutStat1Label} onChange={(event) => setForm({ ...form, aboutStat1Label: event.target.value })} placeholder="Working Since" /></label>
          <label>{t('settings.aboutStat1LabelMr')}<input type="text" value={form.aboutStat1LabelMr} onChange={(event) => setForm({ ...form, aboutStat1LabelMr: event.target.value })} placeholder="पासून कार्यरत" /></label>
          <label>{t('settings.aboutStat2ValueLabel')}<input type="text" value={form.aboutStat2Value} onChange={(event) => setForm({ ...form, aboutStat2Value: event.target.value })} placeholder="1000+" /></label>
          <label>{t('settings.aboutStat2LabelEn')}<input type="text" value={form.aboutStat2Label} onChange={(event) => setForm({ ...form, aboutStat2Label: event.target.value })} placeholder="Happy Customers" /></label>
          <label>{t('settings.aboutStat2LabelMr')}<input type="text" value={form.aboutStat2LabelMr} onChange={(event) => setForm({ ...form, aboutStat2LabelMr: event.target.value })} placeholder="समाधानी ग्राहक" /></label>
          <label>{t('settings.aboutStat3ValueLabel')}<input type="text" value={form.aboutStat3Value} onChange={(event) => setForm({ ...form, aboutStat3Value: event.target.value })} placeholder="100%" /></label>
          <label>{t('settings.aboutStat3LabelEn')}<input type="text" value={form.aboutStat3Label} onChange={(event) => setForm({ ...form, aboutStat3Label: event.target.value })} placeholder="Trusted Service" /></label>
          <label>{t('settings.aboutStat3LabelMr')}<input type="text" value={form.aboutStat3LabelMr} onChange={(event) => setForm({ ...form, aboutStat3LabelMr: event.target.value })} placeholder="विश्वासार्ह सेवा" /></label>
        </div>
        {state.message && <p className="status-message success">{state.message}</p>}
        {state.error && <p className="status-message error">{state.error}</p>}
        <div className="form-actions"><button className="primary-button" type="submit" disabled={state.loading}>{state.loading ? t('common.saving') : t('common.saveSettings')}</button></div>
      </form>
    </div>
  )
}
