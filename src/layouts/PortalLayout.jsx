import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, Shield, Activity, ListOrdered, 
  DollarSign, LifeBuoy, LayoutTemplate, Key, BarChart2 
} from 'lucide-react'
import Cursor from '../components/Cursor'

import { useEffect } from 'react'

export default function PortalLayout({ role }) {
  const location = useLocation()

  useEffect(() => {
    const saved = localStorage.getItem(`adnexa-dashboard-settings-${role}`)
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        if (settings.accentColor && settings.accentColor2) {
          document.documentElement.style.setProperty('--accent', settings.accentColor)
          document.documentElement.style.setProperty('--accent2', settings.accentColor2)
        }
      } catch (e) {
        console.error("Error applying stored theme settings:", e)
      }
    } else {
      document.documentElement.style.removeProperty('--accent')
      document.documentElement.style.removeProperty('--accent2')
    }
  }, [role])

  const superAdminLinks = [
    { name: 'Platform Overview', path: '/superadmin', icon: <Activity size={20} /> },
    { name: 'User Management', path: '/superadmin/users', icon: <Users size={20} /> },
    { name: 'Vendor Payouts', path: '/superadmin/payouts', icon: <DollarSign size={20} /> },
    { name: 'Support Tickets', path: '/superadmin/support', icon: <LifeBuoy size={20} /> },
    { name: 'Storefront CMS', path: '/superadmin/content', icon: <LayoutTemplate size={20} /> },
    { name: 'Integrations', path: '/superadmin/integrations', icon: <Key size={20} /> },
    { name: 'Reports & Exports', path: '/superadmin/reports', icon: <BarChart2 size={20} /> },
    { name: 'System Settings', path: '/superadmin/settings', icon: <Settings size={20} /> },
    { name: 'Audit Logs', path: '/superadmin/logs', icon: <ListOrdered size={20} /> },
  ]

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Vendors', path: '/admin/vendors', icon: <Users size={20} /> },
    { name: 'All Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Logistics', path: '/admin/logistics', icon: <Package size={20} /> },
  ]

  const vendorLinks = [
    { name: 'Dashboard', path: '/vendor', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/vendor/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/vendor/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Settings', path: '/vendor/settings', icon: <Settings size={20} /> },
  ]

  const links = role === 'superadmin' ? superAdminLinks : (role === 'admin' ? adminLinks : vendorLinks)
  const title = role === 'superadmin' ? 'Super Admin' : (role === 'admin' ? 'Admin Portal' : 'Vendor Portal')
  const avatarInitials = role === 'superadmin' ? 'SA' : (role === 'admin' ? 'AD' : 'VN')

  return (
    <>
      <Cursor />
      <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-logo">
          <Link to="/">BAZAAR<span>NET</span></Link>
          <div className="portal-badge">{title}</div>
        </div>
        
        <nav className="portal-nav">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`portal-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="portal-footer">
          <Link to="/" className="portal-nav-link">
            <LogOut size={20} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      <main className="portal-content">
        <header className="portal-header">
          <h2>{links.find(l => l.path === location.pathname)?.name || 'Dashboard'}</h2>
          <div className="portal-user">
            <div className="user-avatar">{avatarInitials}</div>
          </div>
        </header>
        
        <div className="portal-body">
          <Outlet />
        </div>
      </main>
    </div>
    </>
  )
}
