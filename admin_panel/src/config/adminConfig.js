export const adminConfig = {
  brandName: 'Jenisha Online Service',
  apiBaseUrl: import.meta.env.VITE_HOSTINGER_API_BASE_URL || '',
  maxImageSize: 5 * 1024 * 1024,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
}

export const imageTypes = [
  { key: 'logo', labelKey: 'images.type.logo.label', field: 'logoUrl', descriptionKey: 'images.type.logo.description' },
  { key: 'qr-code', labelKey: 'images.type.qrCode.label', field: 'qrCodeUrl', descriptionKey: 'images.type.qrCode.description' },
  { key: 'google-play', labelKey: 'images.type.googlePlay.label', field: 'googlePlayUrl', descriptionKey: 'images.type.googlePlay.description' },
]

export const SERVICE_LOGO_UPLOAD_TYPE = 'service-logo'

export const fieldTypeOptions = [
  { value: 'text', labelKey: 'fieldType.text' },
  { value: 'number', labelKey: 'fieldType.number' },
  { value: 'phone', labelKey: 'fieldType.phone' },
  { value: 'email', labelKey: 'fieldType.email' },
  { value: 'textarea', labelKey: 'fieldType.textarea' },
  { value: 'select', labelKey: 'fieldType.select' },
  { value: 'date', labelKey: 'fieldType.date' },
  { value: 'checkbox', labelKey: 'fieldType.checkbox' },
  { value: 'radio', labelKey: 'fieldType.radio' },
]

export const serviceIconOptions = [
  { value: 'default', labelKey: 'serviceIcon.default' },
  { value: 'passport', labelKey: 'serviceIcon.passport' },
  { value: 'id-card', labelKey: 'serviceIcon.idCard' },
  { value: 'id-card-check', labelKey: 'serviceIcon.idCardCheck' },
  { value: 'fingerprint', labelKey: 'serviceIcon.fingerprint' },
  { value: 'hard-hat', labelKey: 'serviceIcon.hardHat' },
  { value: 'heart-pulse', labelKey: 'serviceIcon.heartPulse' },
  { value: 'briefcase', labelKey: 'serviceIcon.briefcase' },
]

export const serviceStatusOptions = ['active', 'inactive']
export const serviceSubmissionStatusOptions = ['new', 'in_progress', 'completed', 'rejected']
export const contactSubmissionStatusOptions = ['new', 'in_progress', 'resolved', 'closed']
