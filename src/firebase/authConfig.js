import { getAuth } from 'firebase/auth'
import { firebaseApp } from './firebaseConfig'

export const auth = firebaseApp ? getAuth(firebaseApp) : null
