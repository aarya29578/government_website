import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebaseConfig'

export async function getUserProfile(uid) {
  if (!db) return null
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? snapshot.data() : null
}

export async function getSiteSettings() {
  if (!db) return null
  const snapshot = await getDoc(doc(db, 'siteSettings', 'general'))
  return snapshot.exists() ? snapshot.data() : null
}

export async function saveSiteSettings(settings) {
  if (!db) throw new Error('Firebase is not configured.')
  await setDoc(doc(db, 'siteSettings', 'general'), { ...settings, updatedAt: serverTimestamp() }, { merge: true })
}

export async function saveUserProfile(uid, email) {
  if (!db) throw new Error('Firebase is not configured.')
  await setDoc(doc(db, 'users', uid), { email, role: 'user', createdAt: serverTimestamp() }, { merge: false })
}

export async function listServices() {
  if (!db) return []
  const snapshot = await getDocs(collection(db, 'services'))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function createService(service) {
  if (!db) throw new Error('Firebase is not configured.')
  const ref = doc(collection(db, 'services'))
  await setDoc(ref, { ...service, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return ref.id
}

export async function updateService(serviceId, service) {
  if (!db) throw new Error('Firebase is not configured.')
  await updateDoc(doc(db, 'services', serviceId), { ...service, updatedAt: serverTimestamp() })
}

export async function deleteService(serviceId) {
  if (!db) throw new Error('Firebase is not configured.')
  await deleteDoc(doc(db, 'services', serviceId))
  await deleteDoc(doc(db, 'serviceForms', serviceId)).catch(() => {})
}

export async function getServiceForm(serviceId) {
  if (!db) return []
  const snapshot = await getDoc(doc(db, 'serviceForms', serviceId))
  return snapshot.exists() ? (snapshot.data().fields || []) : []
}

export async function saveServiceForm(serviceId, fields) {
  if (!db) throw new Error('Firebase is not configured.')
  await setDoc(doc(db, 'serviceForms', serviceId), { serviceId, fields, updatedAt: serverTimestamp() })
}

export async function listServiceSubmissions() {
  if (!db) return []
  const snapshot = await getDocs(collection(db, 'serviceSubmissions'))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function updateServiceSubmissionStatus(submissionId, status) {
  if (!db) throw new Error('Firebase is not configured.')
  await updateDoc(doc(db, 'serviceSubmissions', submissionId), { status })
}

export async function listContactSubmissions() {
  if (!db) return []
  const snapshot = await getDocs(collection(db, 'contactSubmissions'))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function updateContactSubmissionStatus(submissionId, status) {
  if (!db) throw new Error('Firebase is not configured.')
  await updateDoc(doc(db, 'contactSubmissions', submissionId), { status })
}

export async function getContactSettings() {
  if (!db) return null
  const snapshot = await getDoc(doc(db, 'siteSettings', 'contact'))
  return snapshot.exists() ? snapshot.data() : null
}

export async function saveContactSettings(settings) {
  if (!db) throw new Error('Firebase is not configured.')
  await setDoc(doc(db, 'siteSettings', 'contact'), { ...settings, updatedAt: serverTimestamp() }, { merge: true })
}
