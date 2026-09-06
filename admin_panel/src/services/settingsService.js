import { getSiteSettings, saveSiteSettings } from '../firebase/firestore'

export const emptySettings = {
  logoUrl: '',
  qrCodeUrl: '',
  googlePlayUrl: '',
  whatsappNumber: '',
  aboutDescription: '',
  aboutDescriptionMr: '',
  aboutStat1Value: '',
  aboutStat1Label: '',
  aboutStat1LabelMr: '',
  aboutStat2Value: '',
  aboutStat2Label: '',
  aboutStat2LabelMr: '',
  aboutStat3Value: '',
  aboutStat3Label: '',
  aboutStat3LabelMr: '',
}

export async function loadSettings() {
  const settings = await getSiteSettings()
  return { ...emptySettings, ...(settings || {}) }
}

export async function updateSettings(settings) {
  await saveSiteSettings(settings)
  return settings
}
