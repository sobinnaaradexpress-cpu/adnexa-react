import { useState } from 'react'
import { X, Check } from 'lucide-react'

const COLOR_PRESETS = [
  { name: 'Cyber Orange', primary: '#ff4d00', secondary: '#ff8c42' },
  { name: 'Cyberpunk Pink', primary: '#ff007f', secondary: '#ff5e97' },
  { name: 'Electric Violet', primary: '#7f00ff', secondary: '#b266ff' },
  { name: 'Quantum Cyan', primary: '#00f0ff', secondary: '#70f8ff' },
  { name: 'Hyper Green', primary: '#39ff14', secondary: '#7cff70' },
  { name: 'Solar Gold', primary: '#f5af19', secondary: '#f12711' }
]

export default function DashboardCustomizer({ settings, onUpdate, onReset, isOpen, onClose, role }) {
  const [draft, setDraft] = useState(settings)

  if (!isOpen) return null

  const handleChange = (key, value) => {
    const updated = { ...draft, [key]: value }
    setDraft(updated)
    // Update parent immediately for live preview
    onUpdate(updated, false)
  }

  const handleVisibleCardChange = (cardKey, isVisible) => {
    const updated = {
      ...draft,
      visibleCards: {
        ...draft.visibleCards,
        [cardKey]: isVisible
      }
    }
    setDraft(updated)
    onUpdate(updated, false)
  }

  const handleSave = () => {
    onUpdate(draft, true)
    onClose()
  }

  const handleColorSelect = (primary, secondary) => {
    const updated = { ...draft, accentColor: primary, accentColor2: secondary }
    setDraft(updated)
    onUpdate(updated, false)
  }

  return (
    <>
      <div className="customizer-backdrop" onClick={onClose} />
      <div className={`customizer-drawer ${isOpen ? 'open' : ''}`}>
        <header className="customizer-header">
          <h4>Customize Dashboard</h4>
          <button className="btn-close-customizer" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className="customizer-content">
          {/* Welcome Message */}
          <div className="customizer-section">
            <span className="customizer-section-title">Greeting & Header</span>
            <div className="form-group" style={{ gap: '4px' }}>
              <label style={{ fontSize: '12px' }}>Welcome Message Title</label>
              <input 
                type="text" 
                value={draft.welcomeMessage || ''} 
                onChange={(e) => handleChange('welcomeMessage', e.target.value)} 
                placeholder="Enter header title"
                style={{ padding: '10px 14px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Color Accent Picker */}
          <div className="customizer-section">
            <span className="customizer-section-title">Color Palette Theme</span>
            <div className="color-picker-grid">
              {COLOR_PRESETS.map((color) => {
                const isActive = draft.accentColor === color.primary
                return (
                  <button
                    key={color.name}
                    className={`color-option ${isActive ? 'active' : ''}`}
                    style={{ background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)` }}
                    onClick={() => handleColorSelect(color.primary, color.secondary)}
                    title={color.name}
                  >
                    {isActive && <Check size={14} color="#fff" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Visible Cards / Widgets */}
          <div className="customizer-section">
            <span className="customizer-section-title">Dashboard Widgets</span>
            
            <div className="customizer-option-row">
              <label>Show Total Revenue</label>
              <label className="switch-label">
                <input 
                  type="checkbox" 
                  checked={draft.visibleCards?.revenue !== false} 
                  onChange={(e) => handleVisibleCardChange('revenue', e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div className="customizer-option-row">
              <label>{role === 'admin' ? 'Show Active Vendors' : 'Show Active Products'}</label>
              <label className="switch-label">
                <input 
                  type="checkbox" 
                  checked={draft.visibleCards?.entities !== false} 
                  onChange={(e) => handleVisibleCardChange('entities', e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div className="customizer-option-row">
              <label>Show Pending Orders</label>
              <label className="switch-label">
                <input 
                  type="checkbox" 
                  checked={draft.visibleCards?.orders !== false} 
                  onChange={(e) => handleVisibleCardChange('orders', e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>
          </div>

          {/* Target Revenue Progress */}
          <div className="customizer-section">
            <span className="customizer-section-title">Revenue Goals</span>
            <div className="customizer-option-row" style={{ marginBottom: '8px' }}>
              <label>Show Goal Progress Bar</label>
              <label className="switch-label">
                <input 
                  type="checkbox" 
                  checked={draft.showTargetGoal !== false} 
                  onChange={(e) => handleChange('showTargetGoal', e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>

            {draft.showTargetGoal !== false && (
              <div className="form-group" style={{ gap: '4px' }}>
                <label style={{ fontSize: '12px' }}>Monthly Target Goal (NPR)</label>
                <input 
                  type="number" 
                  value={draft.targetGoal || 0} 
                  onChange={(e) => handleChange('targetGoal', Number(e.target.value))} 
                  style={{ padding: '10px 14px', fontSize: '13px' }}
                />
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="customizer-section">
            <span className="customizer-section-title">Integrations</span>
            <div className="customizer-option-row">
              <label>Show Quick Actions Panel</label>
              <label className="switch-label">
                <input 
                  type="checkbox" 
                  checked={draft.showQuickActions !== false} 
                  onChange={(e) => handleChange('showQuickActions', e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>
          </div>

          {/* Visual Styling / Glassmorphism */}
          <div className="customizer-section">
            <span className="customizer-section-title">Visual Styling</span>
            
            <div className="form-group" style={{ gap: '4px', marginBottom: '12px' }}>
              <label style={{ fontSize: '12px' }}>Glassmorphism Mode</label>
              <select 
                value={draft.glassmorphism || 'normal'}
                onChange={(e) => handleChange('glassmorphism', e.target.value)}
                style={{ padding: '10px 14px', fontSize: '13px' }}
              >
                <option value="flat">Sleek Flat (Dark Solid)</option>
                <option value="normal">Translucent Glass (Default)</option>
                <option value="frosted">Frosted Ice Glass (High Blur)</option>
              </select>
            </div>

            <div className="customizer-option-row">
              <label>Card Active Accent Glow</label>
              <label className="switch-label">
                <input 
                  type="checkbox" 
                  checked={draft.cardGlow === true} 
                  onChange={(e) => handleChange('cardGlow', e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>
          </div>

          {/* Table Controls */}
          <div className="customizer-section">
            <span className="customizer-section-title">List & Table Limits</span>
            
            <div className="form-group" style={{ gap: '4px', marginBottom: '12px' }}>
              <label style={{ fontSize: '12px' }}>Max Rows in Tables</label>
              <select 
                value={draft.tableLimit || 4}
                onChange={(e) => handleChange('tableLimit', Number(e.target.value))}
                style={{ padding: '10px 14px', fontSize: '13px' }}
              >
                <option value={2}>2 rows</option>
                <option value={4}>4 rows (Default)</option>
                <option value={10}>10 rows</option>
              </select>
            </div>

            <div className="form-group" style={{ gap: '4px' }}>
              <label style={{ fontSize: '12px' }}>Table Status Filter</label>
              <select 
                value={draft.tableStatusFilter || 'All'}
                onChange={(e) => handleChange('tableStatusFilter', e.target.value)}
                style={{ padding: '10px 14px', fontSize: '13px' }}
              >
                <option value="All">All statuses</option>
                {role === 'admin' ? (
                  <>
                    <option value="Active">Active only</option>
                    <option value="Pending">Pending only</option>
                  </>
                ) : (
                  <>
                    <option value="Pending">Pending only</option>
                    <option value="Processing">Processing only</option>
                    <option value="Shipped">Shipped only</option>
                    <option value="Delivered">Delivered only</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        <footer className="customizer-footer">
          <button className="btn-customizer-reset" onClick={onReset}>
            Reset Defaults
          </button>
          <button className="btn-customizer-save" onClick={handleSave}>
            Save Settings
          </button>
        </footer>
      </div>
    </>
  )
}
