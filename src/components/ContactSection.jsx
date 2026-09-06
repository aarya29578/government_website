import { useEffect, useState } from 'react'
import { subscribeToServices } from '../services/servicesData'
import { defaultContactSettings, subscribeToContactSettings } from '../services/contactSettings'
import { submitContactEnquiry } from '../services/submissions'
import { EnvelopeIcon, ExternalLinkIcon, LocationIcon, PhoneIcon } from './icons'
import { resolveServiceText } from '../i18n/contentText'
import { useLanguage } from '../i18n/LanguageContext'

const emptyForm = { fullName: '', mobileNumber: '', email: '', serviceId: '', message: '' }

export function ContactSection() {
  const { t, language } = useLanguage()
  const [settings, setSettings] = useState(defaultContactSettings)
  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState({ submitting: false, success: false, error: '' })

  useEffect(() => {
    const unsubscribeSettings = subscribeToContactSettings(setSettings, () => setSettings(defaultContactSettings))
    const unsubscribeServices = subscribeToServices(setServices, () => setServices([]))
    return () => { unsubscribeSettings(); unsubscribeServices() }
  }, [])

  const validate = () => {
    const nextErrors = {}
    if (!form.fullName.trim()) nextErrors.fullName = t('contact.fullNameRequired')
    if (!/^[6-9]\d{9}$/.test(form.mobileNumber.trim())) nextErrors.mobileNumber = t('contact.mobileInvalid')
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = t('contact.emailInvalid')
    return nextErrors
  }

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    if (state.submitting) return
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const service = services.find((item) => item.id === form.serviceId)
    setState({ submitting: true, success: false, error: '' })
    try {
      await submitContactEnquiry({
        fullName: form.fullName.trim(),
        mobileNumber: form.mobileNumber.trim(),
        email: form.email.trim(),
        serviceId: form.serviceId,
        serviceName: service?.name || '',
        message: form.message.trim(),
      })
      setForm(emptyForm)
      setState({ submitting: false, success: true, error: '' })
    } catch (error) {
      setState({ submitting: false, success: false, error: error.message })
    }
  }

  const hasAddress = settings.branch1Address || settings.branch2Address

  return (
    <section className="placeholder-section contact-section content-section" id="contact">
      <div className="section-heading">
        <h2>{settings.sectionTitle || t('contact.headingFallback')}</h2>
        <span className="heading-rule" />
      </div>
      <div className="contact-layout">
        <div className="contact-details">
          {hasAddress && (
            <div className="contact-detail-block">
              <span className="contact-icon"><LocationIcon /></span>
              <div>
                <strong>{settings.addressHeading || t('contact.addressHeadingFallback')}</strong>
                {settings.branch1Address && <p>{t('contact.branch1')}: {settings.branch1Address}</p>}
                {settings.branch2Address && <p>{t('contact.branch2')}: {settings.branch2Address}</p>}
                {settings.googleMapsUrl && (
                  <a className="contact-maps-link" href={settings.googleMapsUrl} target="_blank" rel="noreferrer">
                    {t('contact.viewOnMaps')} <ExternalLinkIcon />
                  </a>
                )}
              </div>
            </div>
          )}
          {settings.phoneNumber && (
            <div className="contact-detail-block">
              <span className="contact-icon"><PhoneIcon /></span>
              <div><strong>{t('contact.phoneLabel')}</strong><p>{settings.phoneNumber}</p></div>
            </div>
          )}
          {settings.email && (
            <div className="contact-detail-block">
              <span className="contact-icon"><EnvelopeIcon /></span>
              <div><strong>{t('contact.emailLabel')}</strong><p>{settings.email}</p></div>
            </div>
          )}
        </div>
        <form className="contact-form" onSubmit={submit}>
          <h3>{settings.enquiryFormTitle || t('contact.enquiryFormTitleFallback')}</h3>
          <label>{settings.fullNameLabel || t('contact.fullNameFallback')}<input type="text" value={form.fullName} onChange={(event) => update('fullName', event.target.value)} /></label>
          {errors.fullName && <small className="field-error">{errors.fullName}</small>}
          <label>{settings.mobileNumberLabel || t('contact.mobileNumberFallback')}<input type="tel" value={form.mobileNumber} onChange={(event) => update('mobileNumber', event.target.value)} /></label>
          {errors.mobileNumber && <small className="field-error">{errors.mobileNumber}</small>}
          <label>{settings.emailLabel || t('contact.emailIdFallback')}<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
          {errors.email && <small className="field-error">{errors.email}</small>}
          <label>{settings.serviceLabel || t('contact.selectServiceFallback')}
            <select value={form.serviceId} onChange={(event) => update('serviceId', event.target.value)}>
              <option value="">{settings.serviceLabel || t('contact.selectServiceFallback')}</option>
              {services.map((service) => <option key={service.id} value={service.id}>{resolveServiceText(service, language).title}</option>)}
            </select>
          </label>
          <label>{settings.messageLabel || t('contact.messageFallback')}<textarea rows={4} value={form.message} onChange={(event) => update('message', event.target.value)} /></label>
          {state.error && <p className="field-error">{state.error}</p>}
          {state.success && <p className="status-message success">{t('contact.thankYou')}</p>}
          <button className="button button-primary" type="submit" disabled={state.submitting}>
            {state.submitting ? t('contact.sending') : (settings.submitButtonText || t('contact.submitFallback'))}
          </button>
        </form>
      </div>
    </section>
  )
}
