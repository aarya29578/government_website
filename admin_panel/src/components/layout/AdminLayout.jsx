import { useState } from 'react'
import { logout } from '../../firebase/auth'
import { Header, Sidebar } from './Sidebar'

export function AdminLayout({ user, page, onNavigate, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleLogout = async () => { await logout(); onLogout() }
  return <div className="admin-shell"><Sidebar page={page} onNavigate={onNavigate} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="admin-main"><Header email={user?.email} onMenu={() => setSidebarOpen(true)} onLogout={handleLogout} /><div className="page-content">{children}</div></div></div>
}
