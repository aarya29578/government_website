import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { publicDb } from '../firebase/firebaseConfig'

export const defaultContactSettings = {
  sectionTitle: 'Get in touch',
  sectionDescription: '',
  addressHeading: 'Our address',
  branch1Address: '',
  branch2Address: '',
  googleMapsUrl: '',
  phoneNumber: '',
  email: '',
  whatsappNumber: '',
  enquiryFormTitle: 'Enquiry Form',
  fullNameLabel: 'Full Name',
  mobileNumberLabel: 'Mobile Number',
  emailLabel: 'Email ID',
  serviceLabel: 'Select Service',
  messageLabel: 'Message',
  submitButtonText: 'Send message',
}

export async function loadContactSettings() {
  if (!publicDb) return defaultContactSettings
  const snapshot = await getDoc(doc(publicDb, 'siteSettings', 'contact'))
  if (!snapshot.exists()) return defaultContactSettings
  return { ...defaultContactSettings, ...snapshot.data() }
}

export function subscribeToContactSettings(onChange, onError) {
  if (!publicDb) { onChange(defaultContactSettings); return () => {} }
  return onSnapshot(
    doc(publicDb, 'siteSettings', 'contact'),
    (snapshot) => onChange(snapshot.exists() ? { ...defaultContactSettings, ...snapshot.data() } : defaultContactSettings),
    (error) => onError?.(error),
  )
}
