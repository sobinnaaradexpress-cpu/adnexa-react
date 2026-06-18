import { useState, useEffect } from 'react'
import { Key, Save, Eye, EyeOff, ShieldCheck, Loader } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { fetchIntegrations, saveIntegrations } from '../../api/driveApi'

export default function Integrations() {
  const { showToast } = useToast()
  const [showKeys, setShowKeys] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [keys, setKeys] = useState({
    esewaMerchant: '',
    khaltiSecret: '',
    sendgridApiKey: ''
  })

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    setLoading(true)
    try {
      const data = await fetchIntegrations()
      if (data && data.length > 0) {
        const keyObj = {}
        data.forEach(item => { keyObj[item.key] = item.value })
        setKeys(prev => ({ ...prev, ...keyObj }))
      }
    } catch (e) {
      showToast('Failed to load API keys from DB', 'error')
    }
    setLoading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveIntegrations(keys)
      showToast('API integrations securely updated.', 'success')
      setShowKeys(false)
    } catch (err) {
      showToast('Failed to save API keys', 'error')
    }
    setSaving(false)
  }

  const glassClass = 'glass-normal'

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
        <Loader className="spin" size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
        Loading integrations from Database...
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>API Integrations</h3>
        <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Manage secure keys for payment gateways and external services.</p>
      </div>

      <div className={`portal-table-wrap ${glassClass}`} style={{ padding: '32px', maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '16px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '12px', color: '#34d399' }}>
          <ShieldCheck size={24} />
          <div style={{ fontSize: '14px' }}>Keys are encrypted before storage. Avoid sharing this screen.</div>
        </div>

        <form onSubmit={handleSave} className="contact-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={14} color="#60a5fa" />
                eSewa Merchant Code
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showKeys ? 'text' : 'password'}
                  value={keys.esewaMerchant}
                  onChange={(e) => setKeys({...keys, esewaMerchant: e.target.value})}
                  style={{ width: '100%', padding: '12px 40px 12px 12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace' }}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={14} color="#a855f7" />
                Khalti Secret Key
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showKeys ? 'text' : 'password'}
                  value={keys.khaltiSecret}
                  onChange={(e) => setKeys({...keys, khaltiSecret: e.target.value})}
                  style={{ width: '100%', padding: '12px 40px 12px 12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace' }}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={14} color="#f43f5e" />
                SendGrid API Key (Email)
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showKeys ? 'text' : 'password'}
                  value={keys.sendgridApiKey}
                  onChange={(e) => setKeys({...keys, sendgridApiKey: e.target.value})}
                  style={{ width: '100%', padding: '12px 40px 12px 12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace' }}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="button"
              className="btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => setShowKeys(!showKeys)}
            >
              {showKeys ? <><EyeOff size={16} /> Hide Keys</> : <><Eye size={16} /> Reveal Keys</>}
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Integrations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
