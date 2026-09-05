import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth } from './authConfig'
import { publicDb } from './firebaseConfig'

export function subscribeToAuth(callback) {
  return auth ? onAuthStateChanged(auth, callback) : () => {}
}

export async function loginUser(email, password) {
  if (!auth) throw new Error('Firebase is not configured.')
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function registerUser({ fullName, email, mobileNumber, password }) {
  if (!auth || !publicDb) throw new Error('Firebase is not configured.')
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: fullName })
  await setDoc(doc(publicDb, 'users', credential.user.uid), {
    uid: credential.user.uid,
    fullName,
    email,
    mobileNumber,
    role: 'user',
    createdAt: serverTimestamp(),
  })
  return credential.user
}

export function logoutUser() {
  if (auth) return signOut(auth)
  return Promise.resolve()
}
