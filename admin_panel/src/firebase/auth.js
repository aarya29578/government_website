import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from './firebaseConfig'
import { getUserProfile } from './firestore'

export async function loginAdmin(email, password) {
  if (!auth) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values first.')
  await setPersistence(auth, browserLocalPersistence)
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const profile = await getUserProfile(credential.user.uid)
  const role = profile?.role
  console.info('[Admin auth diagnostic]', {
    uid: credential.user.uid,
    profileExists: profile !== null,
    role: JSON.stringify(role),
    roleLength: role?.length,
    roleCharCodes: typeof role === 'string' ? [...role].map((char) => char.charCodeAt(0)) : undefined,
    roleType: typeof role,
    isAdmin: role === 'admin',
  })
  if (role !== 'admin') {
    await signOut(auth)
    throw new Error('login.notAuthorized')
  }
  return credential.user
}

export function subscribeToAuth(callback) {
  return auth ? onAuthStateChanged(auth, callback) : () => {}
}

export function getAuthenticatedUser() {
  if (!auth) return Promise.reject(new Error('Firebase is not configured.'))
  if (auth.currentUser) return Promise.resolve(auth.currentUser)

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user) resolve(user)
      else reject(new Error('images.errors.notSignedIn'))
    })
  })
}

export async function logout() {
  if (auth) await signOut(auth)
}
