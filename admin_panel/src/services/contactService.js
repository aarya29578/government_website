import { getContactSettings, saveContactSettings } from '../firebase/firestore'

export const emptyContactSettings = {
  sectionTitle: 'Get in touch',
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
  const settings = await getContactSettings()
  return { ...emptyContactSettings, ...(settings || {}) }
}

export async function updateContactSettings(settings) {
  await saveContactSettings(settings)
  return settings
}
