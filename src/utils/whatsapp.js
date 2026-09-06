export function normalizeWhatsAppNumber(input) {
  const digits = (input || '').replace(/\D/g, '')
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) return digits
  return ''
}

export function buildWhatsAppUrl(rawNumber) {
  const normalized = normalizeWhatsAppNumber(rawNumber)
  return normalized ? `https://wa.me/${normalized}` : ''
}
