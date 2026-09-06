import { LanguageSwitcher } from '../LanguageSwitcher'
import { useLanguage } from '../../i18n/LanguageContext'

const groups = [
  {
    labelKey: 'sidebar.workspace',
    links: [
      { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: '▦' },
      { id: 'settings', labelKey: 'sidebar.websiteSettings', icon: '⚙' },
      { id: 'images', labelKey: 'sidebar.imageManagement', icon: '▧' },
    ],
  },
  {
    labelKey: 'sidebar.servicesGroup',
    links: [
      { id: 'services', labelKey: 'sidebar.services', icon: '☰' },
      { id: 'forms-data', labelKey: 'sidebar.formsData', icon: '▤' },
    ],
  },
  {
    labelKey: 'sidebar.getInTouchGroup',
    links: [
      { id: 'get-in-touch', labelKey: 'sidebar.getInTouch', icon: '✆' },
    ],
  },
  {
    labelKey: 'sidebar.administrationGroup',
    links: [
      { id: 'whatsapp-number', labelKey: 'sidebar.whatsappNumber', icon: '💬' },
      { id: 'add-admin', labelKey: 'sidebar.addAdminUser', icon: '➕' },
    ],
  },
]

export function Sidebar({ page, onNavigate, onLogout, open, onClose }) {
  const { t } = useLanguage()
  const activePage = page === 'service-form' ? 'services' : page
  return (
    <>
      {open && <button className="drawer-backdrop" type="button" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">J</div>
          <div><strong>JENISHA</strong><small>ONLINE SERVICE</small></div>
        </div>
        {groups.map((group) => (
          <div key={group.labelKey}>
            <div className="sidebar-label">{t(group.labelKey)}</div>
            <nav className="sidebar-nav">
              {group.links.map((link) => <button key={link.id} className={activePage === link.id ? 'active' : ''} type="button" onClick={() => { onNavigate(link.id); onClose() }}><span>{link.icon}</span>{t(link.labelKey)}</button>)}
            </nav>
          </div>
        ))}
        <div className="sidebar-bottom">
          <div className="sidebar-label">{t('sidebar.account')}</div>
          <button type="button" onClick={onLogout}><span>↪</span>{t('sidebar.logout')}</button>
        </div>
      </aside>
    </>
  )
}

export function Header({ email, onMenu, onLogout }) {
  const { t } = useLanguage()
  return (
    <header className="app-header">
      <button className="mobile-menu" type="button" aria-label={t('header.openNavigation')} onClick={onMenu}>☰</button>
      <div><div className="eyebrow">{t('header.brand')}</div><h1>{t('header.title')}</h1></div>
      <div className="header-account">
        <LanguageSwitcher className="header-language-switcher" />
        <span className="header-account-email" title={email || t('header.administrator')}>{email || t('header.administrator')}</span>
        <button type="button" onClick={onLogout}>{t('sidebar.logout')}</button>
      </div>
    </header>
  )
}
