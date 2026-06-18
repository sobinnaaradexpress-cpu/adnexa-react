import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { CheckCircle, Truck, CreditCard, ShieldCheck, QrCode, Loader, ArrowRight, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { addOrder } from '../api/driveApi'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { addToast } = useOutletContext()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [checkoutStep, setCheckoutStep] = useState('form') // 'form', 'payment', 'verified', 'success'
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user ? user.name : '',
    phone: '',
    address: '',
    city: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    if (cartItems.length === 0) {
      navigate('/')
    }
  }, [user, cartItems, navigate])

  const handleProceed = (e) => {
    e.preventDefault()
    setCheckoutStep('payment')
  }

  // Handle auto-verification flow
  useEffect(() => {
    let timer1, timer2;
    
    const submitOrder = async () => {
      const orderData = {
        id: `ORD-${Math.floor(Math.random() * 1000000)}`,
        customerEmail: user.email,
        customerName: shippingDetails.fullName,
        date: new Date().toISOString().split('T')[0],
        total: cartTotal,
        status: 'pending',
        paymentMethod: paymentMethod,
        shippingAddress: `${shippingDetails.address}, ${shippingDetails.city}`,
        phone: shippingDetails.phone,
        items: JSON.stringify(cartItems.map(i => `${i.quantity}x ${i.name}`).join(', '))
      }
      
      try {
        await addOrder(orderData)
        setCheckoutStep('success')
        clearCart()
      } catch (err) {
        addToast('Failed to place order', 'error')
        setCheckoutStep('form')
      }
    }

    if (checkoutStep === 'payment') {
      timer1 = setTimeout(() => {
        setCheckoutStep('verified')
      }, 3500) // 3.5 seconds to simulate payment processing
    }
    
    if (checkoutStep === 'verified') {
      timer2 = setTimeout(() => {
        submitOrder()
      }, 1500) // 1.5 seconds to show verified checkmark before success dialog
    }
    
    return () => {
      if (timer1) clearTimeout(timer1)
      if (timer2) clearTimeout(timer2)
    }
  }, [checkoutStep, clearCart, user.email, shippingDetails, cartTotal, paymentMethod, cartItems, addToast])

  const handleFinish = () => {
    navigate('/')
  }

  if (cartItems.length === 0 || !user) return null

  return (
    <div className="container" style={{ padding: '120px 0 60px', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <h1 style={{ marginBottom: '40px', fontSize: '32px', textAlign: 'center' }}>Secure Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
        
        {/* Left Side: Forms */}
        <div>
          <form id="checkout-form" onSubmit={handleProceed}>
            {/* Shipping Details */}
            <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Truck size={24} color="var(--accent)" />
                <h3 style={{ margin: 0 }}>Shipping Details</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingDetails.fullName}
                    onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={shippingDetails.phone}
                    onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <CreditCard size={24} color="var(--accent)" />
                <h3 style={{ margin: 0 }}>Payment Method</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                  border: `1px solid ${paymentMethod === 'cod' ? 'var(--accent)' : 'var(--border)'}`, 
                  borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'cod' ? 'rgba(255, 77, 0, 0.05)' : 'transparent'
                }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')} 
                    style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Pay with cash upon delivery.</div>
                  </div>
                </label>

                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                  border: `1px solid ${paymentMethod === 'ewallet' ? 'var(--accent)' : 'var(--border)'}`, 
                  borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'ewallet' ? 'rgba(255, 77, 0, 0.05)' : 'transparent'
                }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="ewallet" 
                    checked={paymentMethod === 'ewallet'} 
                    onChange={() => setPaymentMethod('ewallet')} 
                    style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>E-Wallet (eSewa / Khalti)</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Pay instantly using your digital wallet.</div>
                  </div>
                </label>

                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                  border: `1px solid ${paymentMethod === 'bank' ? 'var(--accent)' : 'var(--border)'}`, 
                  borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'bank' ? 'rgba(255, 77, 0, 0.05)' : 'transparent'
                }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank" 
                    checked={paymentMethod === 'bank'} 
                    onChange={() => setPaymentMethod('bank')} 
                    style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Bank Transfer</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Direct transfer from your bank account.</div>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div>
          <div className="card" style={{ padding: '32px', position: 'sticky', top: '120px' }}>
            <h3 style={{ margin: '0 0 24px 0', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <div style={{ display: 'flex', gap: '8px', color: 'var(--muted)' }}>
                    <span>{item.quantity}x</span>
                    <span style={{ color: 'var(--text)' }}>{item.name}</span>
                  </div>
                  <span>NPR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--muted)' }}>
                <span>Subtotal</span>
                <span>NPR {cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--muted)' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--success)' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>NPR {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              Proceed to Payment
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', color: 'var(--muted)', fontSize: '12px' }}>
              <ShieldCheck size={14} />
              Secure encrypted checkout
            </div>
          </div>
        </div>

      </div>

      {/* Payment & Success Modals Overlay */}
      {checkoutStep !== 'form' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(8px)',
          zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          
          {checkoutStep === 'payment' && (
            <div className="card" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
              {paymentMethod === 'cod' ? (
                <>
                  <Loader size={48} color="var(--accent)" style={{ animation: 'loaderPulse 1s infinite alternate', margin: '0 auto 24px' }} />
                  <h2 style={{ marginBottom: '8px' }}>Processing Order</h2>
                  <p style={{ color: 'var(--muted)' }}>Preparing your cash on delivery order...</p>
                </>
              ) : (
                <>
                  <h2 style={{ marginBottom: '8px' }}>Scan to Pay</h2>
                  <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
                    {paymentMethod === 'ewallet' ? 'Open eSewa or Khalti' : 'Open your Mobile Banking App'} to scan
                  </p>
                  <div style={{ 
                    background: '#fff', padding: '24px', borderRadius: '12px', display: 'inline-block', marginBottom: '24px',
                    boxShadow: '0 0 40px rgba(255, 77, 0, 0.1)'
                  }}>
                    <QrCode size={180} color="#000" />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '24px' }}>
                    NPR {cartTotal.toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--muted)' }}>
                    <Loader size={18} style={{ animation: 'spin 2s linear infinite' }} />
                    Waiting for payment verification...
                  </div>
                  <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </>
              )}
            </div>
          )}

          {checkoutStep === 'verified' && (
            <div className="card" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ 
                width: '80px', height: '80px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <Check size={40} />
              </div>
              <h2 style={{ marginBottom: '8px' }}>Payment Verified!</h2>
              <p style={{ color: 'var(--muted)' }}>Your transaction was successful.</p>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="card" style={{ padding: '40px', width: '100%', maxWidth: '440px', textAlign: 'center', animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ 
                width: '80px', height: '80px', background: 'rgba(255, 77, 0, 0.1)', color: 'var(--accent)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <CheckCircle size={40} />
              </div>
              <h2 style={{ marginBottom: '16px', fontSize: '28px' }}>Order Placed Successfully!</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '32px', lineHeight: '1.6' }}>
                Thank you for your purchase. Your order has been received and is being processed by the vendor. You will receive an email confirmation shortly.
              </p>
              <button className="btn-primary" onClick={handleFinish} style={{ width: '100%' }}>
                Continue Shopping
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
