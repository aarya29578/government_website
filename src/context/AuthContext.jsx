import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getUserProfile } from '../firebase/firestore'
import { logoutUser, subscribeToAuth } from '../firebase/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState({ loading: true, user: null, profile: null })

  useEffect(() => subscribeToAuth(async (user) => {
    if (!user) { setState({ loading: false, user: null, profile: null }); return }
    const profile = await getUserProfile(user.uid)
    setState({ loading: false, user, profile })
  }), [])

  const value = useMemo(() => ({
    ...state,
    isAuthenticated: Boolean(state.user),
    logout: logoutUser,
  }), [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
