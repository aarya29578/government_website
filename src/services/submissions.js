import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { publicDb } from '../firebase/firebaseConfig'

export async function submitServiceForm({ serviceId, serviceName, formData }) {
  if (!publicDb) throw new Error('Unable to submit right now. Please try again shortly.')
  try {
    await addDoc(collection(publicDb, 'serviceSubmissions'), {
      serviceId,
      serviceName,
      formData,
      submittedAt: serverTimestamp(),
      status: 'new',
    })
  } catch {
    throw new Error('Unable to submit right now. Please try again shortly.')
  }
}

export async function submitContactEnquiry({ fullName, mobileNumber, email, serviceId, serviceName, message }) {
  if (!publicDb) throw new Error('Unable to submit right now. Please try again shortly.')
  try {
    await addDoc(collection(publicDb, 'contactSubmissions'), {
      fullName,
      mobileNumber,
      email: email || '',
      serviceId: serviceId || '',
      serviceName: serviceName || '',
      message: message || '',
      submittedAt: serverTimestamp(),
      status: 'new',
    })
  } catch {
    throw new Error('Unable to submit right now. Please try again shortly.')
  }
}
