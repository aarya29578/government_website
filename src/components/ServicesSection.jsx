import { useEffect, useState } from 'react'
import { subscribeToServices } from '../services/servicesData'
import { ServiceIcon } from './icons'
import { resolveServiceText } from '../i18n/contentText'
import { useLanguage } from '../i18n/LanguageContext'

export function ServicesSection() {
  const { t, language } = useLanguage()
  const [state, setState] = useState({ loading: true, error: '', services: [] })

  useEffect(() => {
    const unsubscribe = subscribeToServices(
      (services) => setState({ loading: false, error: '', services }),
      () => setState((current) => ({ loading: false, error: t('services.error'), services: current.services })),
    )
    return () => unsubscribe()
  }, [t])

  return (
    <section className="placeholder-section content-section" id="services">
      <div className="section-heading">
        <h2>{t('services.heading')}</h2>
        <span className="heading-rule" />
      </div>
      {state.loading && <p>{t('services.loading')}</p>}
      {!state.loading && state.error && <p>{state.error}</p>}
      {!state.loading && !state.error && state.services.length === 0 && (
        <p>{t('services.empty')}</p>
      )}
      {!state.loading && !state.error && state.services.length > 0 && (
        <div className="services-grid">
          {state.services.map((service) => {
            const { title, description } = resolveServiceText(service, language)
            return (
              <a key={service.id} className="service-card" href={`/services/${service.slug || service.id}`}>
                <span className="service-card-icon">
                  <ServiceIcon service={service} className="service-card-icon-svg" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
