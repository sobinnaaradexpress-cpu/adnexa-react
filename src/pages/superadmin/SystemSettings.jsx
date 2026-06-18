import { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { fetchSettings, saveSettings } from '../../api/driveApi'

export default function SystemSettings() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState({
    platformFee: 5.0,
    taxRate: 13.0,
    maintenanceMode: false,
    maxVendors: 500,
    supportEmail: 'support@bazaarnet.com'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await fetchSettings()
      if (data && data.length > 0) {
        const settingsObj = {}
        data.forEach(s => { settingsObj[s.key] = s.value })
        setSettings(prev => ({ ...prev, ...settingsObj }))
      }
    } catch (e) {
      showToast('Failed to load settings from DB', 'error')
    }
    setLoading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (settings.platformFee < 0 || settings.taxRate < 0) {
      showToast('Rates cannot be negative.', 'error')
      return
    }
    setSaving(true)
    try {
      await saveSettings(settings)
      showToast('Global platform settings successfully updated.', 'success')
    } catch (err) {
      showToast('Error saving settings', 'error')
    }
    setSaving(false)
  }

  const glassClass = 'glass-normal'

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
        <Loader className="spin" size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
        Loading settings from Database...
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Platform Configuration</h3>
        <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Manage core settings and operational parameters.</p>
      </div>

      <div className={`portal-table-wrap ${glassClass}`} style={{ padding: '32px', maxWidth: '800px' }}>
        <form onSubmit={handleSave} className="contact-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <div className="form-group">
              <label>Default Platform Fee (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={settings.platformFee}
                onChange={(e) => setSettings({...settings, platformFee: parseFloat(e.target.value)})}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label>Standard Tax Rate (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label>Support Email Address</label>
              <input 
                type="email" 
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label>Max Vendors Allowed</label>
              <input 
                type="number" 
                value={settings.maxVendors}
                onChange={(e) => setSettings({...settings, maxVendors: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                disabled={saving}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>Maintenance Mode</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Take the storefront offline for updates.</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
                disabled={saving}
              />
            </label>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
