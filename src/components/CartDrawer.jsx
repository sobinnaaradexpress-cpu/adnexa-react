import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CartDrawer({ addToast }) {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart()

  const { user } = useAuth()
  const navigate = useNavigate()

  if (!isCartOpen) return null

  const handleCheckout = () => {
    setIsCartOpen(false)
    if (!user) {
      addToast('Please sign up or log in to checkout', 'error')
      navigate('/signup')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <>
      <div 
        className="cart-drawer"
        style={{
          position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '340px',
          height: '100vh', background: 'var(--surface)', borderLeft: '1px solid var(--border)',
          zIndex: 999999, display: 'flex', flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="cart-header" style={{
          padding: '24px', borderBottom: '1px solid var(--border)', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ShoppingBag size={20} color="var(--accent)" />
            Your Cart
          </h3>
          <button 
            className="btn-ghost" 
            onClick={() => setIsCartOpen(false)}
            style={{ padding: '8px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '40px' }}>
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)', 
                  padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' 
                }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.name}</h4>
                      <div style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '14px' }}>
                        NPR {Number(item.price).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px 8px' }}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 0, display: 'flex' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '13px', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 0, display: 'flex' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer" style={{ padding: '24px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--accent)' }}>NPR {cartTotal.toLocaleString()}</span>
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
