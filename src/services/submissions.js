import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { publicDb } from '../firebase/firebaseConfig'
import { uploadSubmissionImage } from './submissionImageUpload'

export async function submitServiceForm({ serviceId, serviceName, fields = [], formData }) {
  if (!publicDb) throw new Error('Unable to submit right now. Please try again shortly.')

  const imageFields = fields.filter((field) => field.type === 'image' && formData[field.key] instanceof File)
  const submissionRef = doc(collection(publicDb, 'serviceSubmissions'))

  let uploadedImages = []
  if (imageFields.length > 0) {
    try {
      uploadedImages = await Promise.all(
        imageFields.map(async (field) => {
          const file = formData[field.key]
          const result = await uploadSubmissionImage({ serviceId, submissionId: submissionRef.id, fieldKey: field.key, file })
          return [field.key, { type: 'image', url: result.publicUrl, filename: result.filename, originalName: file.name, mimeType: file.type }]
        }),
      )
    } catch {
      throw new Error('Some images could not be uploaded. Please try again.')
    }
  }

  const nextFormData = { ...formData, ...Object.fromEntries(uploadedImages) }

  try {
    await setDoc(submissionRef, {
      serviceId,
      serviceName,
      formData: nextFormData,
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
