export function resolveServiceText(service, language) {
  if (!service) return { title: '', description: '' }
  const title = language === 'mr'
    ? (service.titleMr || service.name || '')
    : (service.name || service.titleMr || '')
  const description = language === 'mr'
    ? (service.descriptionMr || service.description || '')
    : (service.description || service.descriptionMr || '')
  return { title, description }
}

export function resolveFieldText(field, language) {
  if (!field) return { label: '', placeholder: '' }
  const label = language === 'mr'
    ? (field.labelMr || field.label || '')
    : (field.label || field.labelMr || '')
  const placeholder = language === 'mr'
    ? (field.placeholderMr || field.placeholder || '')
    : (field.placeholder || field.placeholderMr || '')
  return { label, placeholder }
}
