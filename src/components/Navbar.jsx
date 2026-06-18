import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, LogOut, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const location = useLocation()
  const { cartCount, toggleCart } = useCart()
  const { user, logout } = useAuth()
  
  const isMarketingPage = location.pathname === '/become-vendor'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      if (isMarketingPage) {
        const sections = ['services', 'pricing', 'contact']
        let current = ''
        
        for (const section of sections) {
          const el = document.getElementById(section)
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
              current = section
            }
          }
        }
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
          current = 'contact'
        }
        setActiveSection(current)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMarketingPage])

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav id="mainNav" className={isScrolled ? 'scrolled' : ''}>
        <Link to="/" className="logo">BAZAAR<span>NET</span></Link>
        <ul className="nav-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Shop</Link></li>
          {isMarketingPage ? (
            <>
              <li><a href="#services" className={activeSection === 'services' ? 'active' : ''}>Platform Features</a></li>
              <li><a href="#pricing" className={activeSection === 'pricing' ? 'active' : ''}>Pricing</a></li>
              <li><a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact Us</a></li>
            </>
          ) : (
            <li><Link to="/become-vendor" className={location.pathname === '/become-vendor' ? 'active' : ''}>Become a Vendor</Link></li>
          )}
        </ul>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="btn-ghost" 
            onClick={toggleCart}
            style={{ position: 'relative', padding: '8px', color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '0', right: '0', background: 'var(--accent)', color: '#000',
                fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                <User size={16} color="var(--accent)" />
                {user.name}
              </Link>
              <button onClick={logout} className="btn-ghost" style={{ padding: '6px', color: 'var(--muted)', display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none' }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 24px' }}>Login</Link>
          )}
        </div>
        <div 
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
          id="hamburger" 
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </div>
      </nav>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <Link to="/" onClick={closeMenu} className={location.pathname === '/' ? 'active' : ''}>Shop</Link>
        {isMarketingPage ? (
          <>
            <a href="#services" onClick={closeMenu} className={activeSection === 'services' ? 'active' : ''}>Platform Features</a>
            <a href="#pricing" onClick={closeMenu} className={activeSection === 'pricing' ? 'active' : ''}>Pricing</a>
            <a href="#contact" onClick={closeMenu} className={activeSection === 'contact' ? 'active' : ''}>Contact Us</a>
          </>
        ) : (
          <Link to="/become-vendor" onClick={closeMenu} className={location.pathname === '/become-vendor' ? 'active' : ''}>Become a Vendor</Link>
        )}
        {user ? (
          <button onClick={() => { logout(); closeMenu(); }} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', padding: '15px 0' }}>
            <LogOut size={20} /> Logout
          </button>
        ) : (
          <Link to="/login" onClick={closeMenu} style={{ color: 'var(--accent)' }}>Login</Link>
        )}
      </div>
    </>
  )
}
