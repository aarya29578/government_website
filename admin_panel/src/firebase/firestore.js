import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
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
