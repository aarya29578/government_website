import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'website-5e7e3',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
console.log('Firebase config check:', {
  apiKey: Boolean(firebaseConfig.apiKey),
  authDomain: Boolean(firebaseConfig.authDomain),
  projectId: Boolean(firebaseConfig.projectId),
  messagingSenderId: Boolean(firebaseConfig.messagingSenderId),
  appId: Boolean(firebaseConfig.appId),
})

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean)

const app = firebaseConfigured ? initializeApp(firebaseConfig) : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null