import { deleteApp, initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, deleteUser, getAuth, signOut } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseConfig, db } from '../firebase/firebaseConfig'
import { getAuthenticatedUser } from '../firebase/auth'
import { getUserProfile } from '../firebase/firestore'

function mapAuthErrorCode(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use': return 'addAdmin.errors.emailExists'
    case 'auth/invalid-email': return 'addAdmin.errors.invalidEmail'
    case 'auth/weak-password': return 'addAdmin.errors.weakPassword'
    case 'auth/network-request-failed': return 'addAdmin.errors.networkError'
    case 'permission-denied': return 'addAdmin.errors.forbidden'
    default: return 'addAdmin.errors.serverError'
  }
}

export async function createAdminUser({ email, password }) {
  // Re-derive the caller's role from Firestore rather than trusting any cached/frontend
  // flag. This is only a fast-fail UX check — Firestore Security Rules are the real
  // enforcement (a non-admin cannot write role: "admin" regardless of this check).
  let currentUser
  try {
    currentUser = await getAuthenticatedUser()
  } catch {
    throw new Error('addAdmin.errors.forbidden')
  }
  const profile = await getUserProfile(currentUser.uid)
  if (profile?.role !== 'admin') throw new Error('addAdmin.errors.forbidden')

  // Create the new account on a secondary, isolated Firebase App instance so that
  // Firebase Auth's "sign in as the newly created user" behavior never touches the
  // primary app — the current admin's session stays untouched throughout.
  const secondaryApp = initializeApp(firebaseConfig, `add-admin-${Date.now()}`)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    let credential
    try {
      credential = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    } catch (error) {
      throw new Error(mapAuthErrorCode(error))
    }

    const newUid = credential.user.uid
    try {
      await setDoc(doc(db, 'users', newUid), {
        uid: newUid,
        email,
        role: 'admin',
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      // Roll back the orphaned Auth account if the Firestore write is rejected
      // (e.g. a stale/incorrect role check let this get further than it should have).
      await deleteUser(credential.user).catch(() => {})
      throw new Error(mapAuthErrorCode(error))
    }

    await signOut(secondaryAuth).catch(() => {})
    return { uid: newUid, email }
  } finally {
    await deleteApp(secondaryApp).catch(() => {})
  }
}
