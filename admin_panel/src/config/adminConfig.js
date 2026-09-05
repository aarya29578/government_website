export const adminConfig = {
  brandName: 'Jenisha Online Service',
  apiBaseUrl: import.meta.env.VITE_HOSTINGER_API_BASE_URL || '',
  maxImageSize: 5 * 1024 * 1024,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
}

export const imageTypes = [
  { key: 'logo', label: 'Website Logo', field: 'logoUrl', description: 'The logo shown in the public website header.' },
  { key: 'qr-code', label: 'Scan Me / QR Code', field: 'qrCodeUrl', description: 'The QR code shown beside the app download badge.' },
  { key: 'google-play', label: 'Google Play Image', field: 'googlePlayUrl', description: 'The download graphic shown in the public hero.' },
]
