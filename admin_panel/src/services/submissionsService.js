import {
  listContactSubmissions as listContactSubmissionsDocs,
  listServiceSubmissions as listServiceSubmissionsDocs,
  updateContactSubmissionStatus as updateContactSubmissionStatusDoc,
  updateServiceSubmissionStatus as updateServiceSubmissionStatusDoc,
} from '../firebase/firestore'

function toMillis(timestamp) {
  return timestamp?.toMillis ? timestamp.toMillis() : 0
}

function sortByNewest(list) {
  return [...list].sort((a, b) => toMillis(b.submittedAt) - toMillis(a.submittedAt))
}

export async function loadServiceSubmissions() {
  return sortByNewest(await listServiceSubmissionsDocs())
}

export async function updateServiceSubmissionStatus(submissionId, status) {
  await updateServiceSubmissionStatusDoc(submissionId, status)
}

export async function loadContactSubmissions() {
  return sortByNewest(await listContactSubmissionsDocs())
}

export async function updateContactSubmissionStatus(submissionId, status) {
  await updateContactSubmissionStatusDoc(submissionId, status)
}

export function filterServiceSubmissions(submissions, { serviceId, search }) {
  return submissions.filter((item) => {
    if (serviceId && item.serviceId !== serviceId) return false
    if (!search) return true
    const term = search.toLowerCase()
    const haystack = [item.formData?.fullName, item.formData?.name, item.formData?.mobileNumber, item.formData?.phone, item.formData?.email]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
}

export function filterContactSubmissions(submissions, { serviceId, search }) {
  return submissions.filter((item) => {
    if (serviceId && item.serviceId !== serviceId) return false
    if (!search) return true
    const term = search.toLowerCase()
    const haystack = [item.fullName, item.mobileNumber, item.email].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(term)
  })
}
