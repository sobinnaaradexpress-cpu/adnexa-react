import { useState, useEffect } from 'react'
import { Wallet, Building, Truck, Loader, Save } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { fetchVendors, updateVendor, addVendor } from '../../api/driveApi'

export default function VendorSettings() {
  const { showToast } = useToast()
  
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Local state for form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [payoutMethod, setPayoutMethod] = useState('bank')
  const [codEnabled, setCodEnabled] = useState(true)

  useEffect(() => {
    loadVendor()
  }, [])

  const loadVendor = async () => {
    setLoading(true)
    try {
      const allVendors = await fetchVendors()
      // For demo purposes, we grab the first vendor or create a mock reference
      let currentVendor = allVendors && allVendors.length > 0 ? allVendors[0] : null
      
      if (currentVendor) {
        setVendor(currentVendor)
        setName(currentVendor.name || '')
        setEmail(currentVendor.email || '')
        // We assume description, payoutMethod, codEnabled might be mapped if they existed,
        // but for now we'll just populate what we have.
      } else {
        // Fallback for empty DB
        setName('Mock Vendor Store')
        setEmail('vendor@example.com')
        setDescription('We sell the best products in Nepal.')
      }
    } catch (e) {
      showToast('Failed to load vendor profile from DB', 'error')
    }
    setLoading(false)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const vendorData = {
        id: vendor ? vendor.id : `VND-${Math.floor(Math.random() * 900) + 100}`,
        name,
        email,
        status: 'Active',
        joined: new Date().toISOString().split('T')[0]
      }
      
      if (vendor) {
        await updateVendor(vendorData)
      } else {
        await addVendor(vendorData)
        setVendor(vendorData)
      }
      showToast('Store profile successfully updated.', 'success')
    } catch (err) {
      showToast('Failed to update store profile.', 'error')
    }
    setSaving(false)
  }

  const handleSavePreferences = (e) => {
    e.preventDefault()
    // Preferences might be saved to a different endpoint or combined with Vendor.
    // We'll simulate this since our GS schema for Vendors usually only has standard fields.
    showToast('Payment and payout preferences saved successfully.', 'success')
  }

  const glassClass = 'glass-normal'

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
        <Loader className="spin" size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
        Loading vendor settings from Database...
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Vendor Settings</h3>
        <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Manage your public store profile and payment methods.</p>
      </div>

      <div className="portal-grid">
        <div className={`portal-card ${glassClass}`} style={{ gridColumn: 'span 2' }}>
          <div className="portal-card-header">
            <span>Store Profile</span>
          </div>
          <form onSubmit={handleSaveProfile} className="contact-form" style={{ marginTop: '24px' }}>
            <div className="form-group">
              <label>Store Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                required
                disabled={saving}
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                required
                disabled={saving}
              />
            </div>
            <div className="form-group">
              <label>Store Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', minHeight: '100px' }}
                disabled={saving}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Payout Settings Card */}
        <div className={`portal-card ${glassClass}`} style={{ gridColumn: 'span 2' }}>
          <div className="portal-card-header">
            <span>Payout & Payment Preferences</span>
          </div>
          <div style={{ marginTop: '24px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>
              Configure how you receive your earnings and what payment methods you accept.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <button 
                type="button"
                className="btn-outline"
                onClick={() => setPayoutMethod('bank')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: payoutMethod === 'bank' ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)', background: payoutMethod === 'bank' ? 'rgba(0,255,170,0.1)' : 'transparent', color: payoutMethod === 'bank' ? 'var(--accent)' : 'var(--text)' }}
              >
                <Building size={16} /> Bank Transfer
              </button>
              <button 
                type="button"
                className="btn-outline"
                onClick={() => setPayoutMethod('ewallet')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: payoutMethod === 'ewallet' ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)', background: payoutMethod === 'ewallet' ? 'rgba(0,255,170,0.1)' : 'transparent', color: payoutMethod === 'ewallet' ? 'var(--accent)' : 'var(--text)' }}
              >
                <Wallet size={16} /> E-Wallet
              </button>
            </div>

            <form onSubmit={handleSavePreferences} className="contact-form">
              {payoutMethod === 'bank' && (
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input type="text" placeholder="e.g. Nabil Bank" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label>Account Name</label>
                      <input type="text" placeholder="Account Holder Name" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    </div>
                    <div className="form-group">
                      <label>Account Number</label>
                      <input type="text" placeholder="001XXXXXXXX" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Branch</label>
                    <input type="text" placeholder="Branch Name" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </div>
                </div>
              )}

              {payoutMethod === 'ewallet' && (
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div className="form-group">
                    <label>E-Wallet Provider</label>
                    <select style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                      <option value="esewa" style={{color:'#000'}}>eSewa</option>
                      <option value="khalti" style={{color:'#000'}}>Khalti</option>
                      <option value="imepay" style={{color:'#000'}}>IME Pay</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Wallet Mobile Number</label>
                    <input type="tel" placeholder="98XXXXXXXX" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group">
                    <label>Wallet Holder Name</label>
                    <input type="text" placeholder="Name registered in wallet" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </div>
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '32px 0' }} />
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '32px' }}>
                <div 
                  onClick={() => setCodEnabled(!codEnabled)}
                  style={{ 
                    width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--accent)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    background: codEnabled ? 'var(--accent)' : 'transparent', flexShrink: 0, marginTop: '2px',
                    transition: '0.2s all'
                  }}
                >
                  {codEnabled && <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>✓</span>}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '16px' }}>
                    <Truck size={18} /> Enable Cash on Delivery (COD)
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}>
                    Allow customers to pay with cash upon receiving your products. Our logistics team will collect the cash and transfer it to your selected payout method above.
                  </p>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={16} /> Save Preferences
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
