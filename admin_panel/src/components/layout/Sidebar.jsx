const links = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'settings', label: 'Website Settings', icon: '⚙' },
  { id: 'images', label: 'Image Management', icon: '▧' },
]

export function Sidebar({ page, onNavigate, onLogout, open, onClose }) {
  return (
    <>
      {open && <button className="drawer-backdrop" type="button" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">J</div>
          <div><strong>JENISHA</strong><small>ONLINE SERVICE</small></div>
        </div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          {links.map((link) => <button key={link.id} className={page === link.id ? 'active' : ''} type="button" onClick={() => { onNavigate(link.id); onClose() }}><span>{link.icon}</span>{link.label}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-label">ACCOUNT</div>
          <button type="button" onClick={onLogout}><span>↪</span>Logout</button>
        </div>
      </aside>
    </>
  )
}

export function Header({ email, onMenu, onLogout }) {
  return <header className="app-header"><button className="mobile-menu" type="button" aria-label="Open navigation" onClick={onMenu}>☰</button><div><div className="eyebrow">JENISHA ONLINE SERVICE</div><h1>Admin Panel</h1></div><div className="header-account"><span>{email || 'Administrator'}</span><button type="button" onClick={onLogout}>Logout</button></div></header>
}
