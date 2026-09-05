import { getSiteSettings, saveSiteSettings } from '../firebase/firestore'

export const emptySettings = {
  logoUrl: '',
  qrCodeUrl: '',
  googlePlayUrl: '',
  whatsappNumber: '',
}

export async function loadSettings() {
  const settings = await getSiteSettings()
  return { ...emptySettings, ...(settings || {}) }
}

export async function updateSettings(settings) {
  await saveSiteSettings(settings)
  return settings
}
