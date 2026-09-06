import { useEffect, useState } from 'react'
import { FormField, validateFields } from '../components/FormField'
import { ServiceIcon } from '../components/icons'
import { subscribeToServiceBySlug, subscribeToServiceForm } from '../services/servicesData'
import { submitServiceForm } from '../services/submissions'
import { SiteLogo } from '../components/SiteLogo'
import { resolveServiceText } from '../i18n/contentText'
import { useLanguage } from '../i18n/LanguageContext'

export function ServiceDetail({ slug }) {
  const { t, language } = useLanguage()
  const [service, setService] = useState(null)
  const [fields, setFields] = useState([])
  const [state, setState] = useState({ loading: true, error: '' })
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [submitState, setSubmitState] = useState({ submitting: false, success: false, error: '' })

  useEffect(() => {
    setState({ loading: true, error: '' })
    setService(null)
    setFields([])
    const unsubscribe = subscribeToServiceBySlug(
      slug,
      (nextService) => {
        setService(nextService)
        setState({ loading: false, error: nextService ? '' : t('serviceDetail.notAvailable') })
        if (!nextService) setFields([])
      },
      () => setState({ loading: false, error: t('serviceDetail.loadError') }),
    )
    return () => unsubscribe()
  }, [slug, t])

  useEffect(() => {
    if (!service?.id) return undefined
    const unsubscribe = subscribeToServiceForm(
      service.id,
      setFields,
      () => setState((current) => (current.error ? current : { ...current, error: t('serviceDetail.formError') })),
    )
    return () => unsubscribe()
  }, [service?.id, t])

  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    if (submitState.submitting) return
    const nextErrors = validateFields(fields, values, t, language)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSubmitState({ submitting: true, success: false, error: '' })
    try {
      await submitServiceForm({ serviceId: service.id, serviceName: service.name, fields, formData: values })
      setValues({})
      setSubmitState({ submitting: false, success: true, error: '' })
    } catch (error) {
      setSubmitState({ submitting: false, success: false, error: error.message })
    }
  }

  const { title, description } = resolveServiceText(service, language)

  return (
    <main className="service-detail-page">
      <a className="auth-brand" href="/"><SiteLogo className="auth-site-logo logo-placeholder" /></a>
      {state.loading && <p className="service-detail-status">{t('serviceDetail.loading')}</p>}
      {!state.loading && state.error && <p className="service-detail-status">{state.error}</p>}
      {!state.loading && service && (
        <section className="service-detail-card">
          <div className="service-detail-head">
            <span className="service-detail-icon">
              <ServiceIcon service={service} className="service-detail-icon-svg" />
            </span>
            <div className="section-heading service-detail-heading">
              <h1>{title}</h1>
              <span className="heading-rule" />
            </div>
            <p className="service-detail-description">{description}</p>
          </div>
          {fields.length === 0 ? (
            <p>{t('serviceDetail.formNotReady')}</p>
          ) : (
            <form className="service-detail-form" onSubmit={submit}>
              {fields.map((field) => (
                <FormField key={field.id} field={field} value={values[field.key]} error={errors[field.key]} onChange={update} />
              ))}
              {submitState.error && <p className="field-error">{submitState.error}</p>}
              {submitState.success && <p className="status-message success">{t('serviceDetail.success')}</p>}
              <button className="button button-primary" type="submit" disabled={submitState.submitting}>
                {submitState.submitting ? t('serviceDetail.submitting') : t('serviceDetail.submit')}
              </button>
            </form>
          )}
        </section>
      )}
      <a className="auth-home-link" href="/">{t('serviceDetail.backToHome')}</a>
    </main>
  )
}
