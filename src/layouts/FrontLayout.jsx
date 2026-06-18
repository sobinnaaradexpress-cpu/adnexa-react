import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import PageLoader from '../components/PageLoader'
import Cursor from '../components/Cursor'
import BackToTop from '../components/BackToTop'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'

export default function FrontLayout() {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type }])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id))
    }, 3000)
  }

  return (
    <>
      <PageLoader />
      <Cursor />
      <BackToTop />
      
      {/* Toast Container */}
      <div className="toast-container" id="toastContainer">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast show ${toast.type === 'error' ? 'error' : ''}`}>
            <span className="toast-icon">{toast.type === 'error' ? '❌' : '✅'}</span>
            {toast.message}
          </div>
        ))}
      </div>

      <Navbar />
      <CartDrawer addToast={addToast} />
      <main>
        {/* Render child routes, passing addToast to them */}
        <Outlet context={{ addToast }} />
      </main>
      <Footer />
    </>
  )
}
