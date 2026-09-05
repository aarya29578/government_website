import { useEffect, useState } from 'react'
import { subscribeToAuth } from '../../firebase/auth'
import { getUserProfile } from '../../firebase/firestore'
import { firebaseConfigured } from '../../firebase/firebaseConfig'

export function ProtectedAdminRoute({ children, onUnauthorized }) {
  const [state, setState] = useState({ loading: true, allowed: false })

  useEffect(() => {
    if (!firebaseConfigured) { setState({ loading: false, allowed: false }); return undefined }
    return subscribeToAuth(async (user) => {
      if (!user) { setState({ loading: false, allowed: false }); return }
      try {
        const profile = await getUserProfile(user.uid)
        if (profile?.role === 'admin') setState({ loading: false, allowed: true, user })
        else { setState({ loading: false, allowed: false }); onUnauthorized?.() }
      } catch { setState({ loading: false, allowed: false }); onUnauthorized?.() }
    })
  }, [onUnauthorized])

  if (state.loading) return <div className="auth-loading">Checking admin access...</div>
  if (!state.allowed) return null
  return children
}
