import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { publicDb } from './firebaseConfig'

export async function getUserProfile(uid) {
  if (!publicDb) return null
  const snapshot = await getDoc(doc(publicDb, 'users', uid))
  return snapshot.exists() ? snapshot.data() : null
}

export async function createUserProfile(uid, profile) {
  if (!publicDb) throw new Error('Firebase is not configured.')
  await setDoc(doc(publicDb, 'users', uid), { ...profile, uid, role: 'user', createdAt: serverTimestamp() })
}
