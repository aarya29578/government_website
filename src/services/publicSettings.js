import { doc, getDoc } from 'firebase/firestore'
import { firebaseConfigured, publicDb } from '../firebase/firebaseConfig'

export async function loadPublicSettings() {
  console.info('[Public Firebase diagnostic]', { firebaseConfigured, firestoreAvailable: Boolean(publicDb) })
  if (!publicDb) return null
  const snapshot = await getDoc(doc(publicDb, 'siteSettings', 'general'))
  const settings = snapshot.exists() ? snapshot.data() : null
  console.info('[Public settings diagnostic]', {
    documentExists: snapshot.exists(),
    settingsReceived: settings !== null,
    logoUrl: settings?.logoUrl,
    qrCodeUrl: settings?.qrCodeUrl,
    googlePlayUrl: settings?.googlePlayUrl,
  })
  return settings
}
