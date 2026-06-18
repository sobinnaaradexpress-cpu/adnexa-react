import { useState, useEffect } from 'react'
import { fetchProducts, fetchOrders } from '../../api/driveApi'
import { 
  Package, TrendingUp, DollarSign, Sliders, 
  PlusCircle, ShoppingBag, Settings, FileText, RefreshCw, AlertCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'
import DashboardCustomizer from '../../components/DashboardCustomizer'

const DEFAULT_SETTINGS = {
  welcomeMessage: 'Dashboard',
  accentColor: '#ff4d00',
  accentColor2: '#ff8c42',
  visibleCards: {
    revenue: true,
    entities: true,
    orders: true
  },
  showQuickActions: true,
  showTargetGoal: true,
  targetGoal: 100000,
  glassmorphism: 'normal',
  cardGlow: false,
  tableLimit: 4,
  tableStatusFilter: 'All'
}

// Mock Chart Data for Vendor
const MOCK_SALES_DATA = [
  { name: 'Mon', sales: 12000 },
  { name: 'Tue', sales: 19000 },
  { name: 'Wed', sales: 15000 },
  { name: 'Thu', sales: 22000 },
  { name: 'Fri', sales: 28000 },
  { name: 'Sat', sales: 35000 },
  { name: 'Sun', sales: 10000 },
]

export default function VendorDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })

  // Customization State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('adnexa-dashboard-settings-vendor')
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
  })

  const loadData = () => {
    setLoading(true)
    Promise.all([fetchProducts(), fetchOrders()]).then(([pData, oData]) => {
      setProducts(pData || [])
      setOrders(oData || [])
      setLoading(false)
    }).catch(err => {
      showToast('Failed to load dashboard data from database.')
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  // Apply visual theme settings immediately
  useEffect(() => {
    if (settings.accentColor && settings.accentColor2) {
      document.documentElement.style.setProperty('--accent', settings.accentColor)
      document.documentElement.style.setProperty('--accent2', settings.accentColor2)
    }
  }, [settings.accentColor, settings.accentColor2])

  const handleUpdateSettings = (newSettings, persist = false) => {
    setSettings(newSettings)
    if (persist) {
      localStorage.setItem('adnexa-dashboard-settings-vendor', JSON.stringify(newSettings))
      showToast('Settings saved successfully!')
    }
  }

  const handleResetSettings = () => {
    localStorage.removeItem('adnexa-dashboard-settings-vendor')
    setSettings(DEFAULT_SETTINGS)
    // reset CSS properties
    document.documentElement.style.removeProperty('--accent')
    document.documentElement.style.removeProperty('--accent2')
    showToast('Settings reset to defaults!')
  }

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const totalRevenue = orders.filter(o => o.status !== 'Pending').reduce((sum, o) => sum + Number(o.total || 0), 0)

  // Filter & limit table list based on settings
  const filteredOrders = orders
    .filter(o => settings.tableStatusFilter === 'All' || o.status === settings.tableStatusFilter)
    .slice(0, settings.tableLimit)

  // Derived Alerts and Products
  const lowStockProducts = products.filter(p => Number(p.stock) < 10)
  const topProducts = [...products].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 4) // Mock logic: sorting by price as popularity placeholder

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading store data...</p>

  // Class strings for customization styles
  const glassClass = `glass-${settings.glassmorphism || 'normal'}`
  const glowClass = settings.cardGlow ? 'card-glow-active' : ''
  const cardClassName = `portal-card ${glassClass} ${glowClass}`
  const tableClassName = `portal-table-wrap ${glassClass} ${glowClass}`

  // Target Goal Percentage
  const progressPercent = Math.min(Math.round((totalRevenue / (settings.targetGoal || 1)) * 100), 100)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-recharts-tooltip">
          <p className="label">{label}</p>
          {payload.map((pld, index) => (
            <p key={index} className="item" style={{ color: pld.color || 'var(--accent)' }}>
              {pld.name}: NPR {pld.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast.show && (
        <div className="toast-container">
          <div className="toast show" style={{ borderLeftColor: 'var(--accent)' }}>
            <span style={{ fontWeight: '500' }}>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header section with Personalize Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
          {settings.welcomeMessage || 'Dashboard'}
        </h3>
        <button 
          className="btn-personalize-fab"
          onClick={() => setIsCustomizerOpen(true)}
        >
          <Sliders size={16} />
          <span>Personalize Dashboard</span>
        </button>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#f87171' }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: '500' }}>Alert: {lowStockProducts.length} product(s) are running low on stock (less than 10 units left).</span>
        </div>
      )}

      {/* Revenue Goal Target Widget */}
      {settings.showTargetGoal !== false && (
        <div className={`progress-container ${glassClass} ${glowClass}`}>
          <div className="progress-header">
            <span className="progress-title">Monthly Store Revenue Target</span>
            <span className="progress-percentage">{progressPercent}% Achieved</span>
          </div>
          <div className="progress-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-labels">
            <span>Current: NPR {totalRevenue.toLocaleString()}</span>
            <span>Target: NPR {(settings.targetGoal || 0).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="portal-grid">
        {(settings.visibleCards?.revenue !== false) && (
          <div className={cardClassName}>
            <div className="portal-card-header">
              Total Revenue
              <div className="portal-card-icon"><DollarSign size={20} /></div>
            </div>
            <div className="portal-card-value">
              <span>NPR</span>
              {totalRevenue.toLocaleString()}
              <span className="trend-indicator trend-up"><ArrowUpRight size={14}/> 18%</span>
            </div>
          </div>
        )}

        {(settings.visibleCards?.entities !== false) && (
          <div className={cardClassName}>
            <div className="portal-card-header">
              Active Products
              <div className="portal-card-icon"><Package size={20} /></div>
            </div>
            <div className="portal-card-value">
              {products.length}
              <span className="trend-indicator trend-down"><ArrowDownRight size={14}/> 2</span>
            </div>
          </div>
        )}

        {(settings.visibleCards?.orders !== false) && (
          <div className={cardClassName}>
            <div className="portal-card-header">
              Pending Orders
              <div className="portal-card-icon"><TrendingUp size={20} /></div>
            </div>
            <div className="portal-card-value">
              {orders.filter(o => o.status === 'Pending').length}
              <span className="trend-indicator trend-neutral">-</span>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-complex-grid">
        {/* Sales Area Chart */}
        <div className={`chart-container ${glassClass}`}>
          <div className="chart-header">
            Daily Sales Overview
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Past 7 Days</span>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={MOCK_SALES_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `NPR ${value/1000}k`} width={80} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Mini List */}
        <div className={`chart-container ${glassClass}`}>
          <div className="chart-header">
            Top Selling Products
          </div>
          <div className="mini-list">
            {topProducts.map((product, idx) => (
              <div className="mini-list-item" key={product.id || idx}>
                <div className="mini-list-left">
                  <div className="mini-list-avatar" style={{ background: 'transparent' }}>
                    <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
                  </div>
                  <div className="mini-list-info">
                    <h5>{product.name}</h5>
                    <p>{product.stock} units left</p>
                  </div>
                </div>
                <div className="mini-list-right" style={{ color: 'var(--accent)' }}>
                  NPR {Number(product.price || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      {settings.showQuickActions !== false && (
        <>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '500' }}>Store Shortcuts</h3>
          <div className="quick-actions-grid">
            <button className={`quick-action-btn ${glassClass}`} onClick={() => showToast('Simulating: Accessing product creation page...')}>
              <div className="quick-action-icon"><PlusCircle size={20} /></div>
              <span>Add Product</span>
            </button>
            <button className={`quick-action-btn ${glassClass}`} onClick={() => showToast('Simulating: Loading order listings...')}>
              <div className="quick-action-icon"><ShoppingBag size={20} /></div>
              <span>Manage Orders</span>
            </button>
            <button className={`quick-action-btn ${glassClass}`} onClick={() => showToast('Simulating: Loading shop configs...')}>
              <div className="quick-action-icon"><Settings size={20} /></div>
              <span>Store Settings</span>
            </button>
            <button className={`quick-action-btn ${glassClass}`} onClick={() => showToast('Simulating: Exporting sales spreadsheets...')}>
              <div className="quick-action-icon"><FileText size={20} /></div>
              <span>Sales Reports</span>
            </button>
          </div>
        </>
      )}

      {/* Recent Orders Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>Recent Store Orders</h3>
        <button 
          onClick={loadData}
          style={{ 
            background: 'none', border: 'none', color: 'var(--muted)', 
            cursor: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' 
          }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className={tableClassName} style={{ marginBottom: '40px' }}>
        <table className="portal-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.date}</td>
                  <td>NPR {Number(o.total || 0).toLocaleString()}</td>
                  <td><span className={`status-badge status-${(o.status || '').toLowerCase()}`}>{o.status}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                  No orders found matching your current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Settings Customizer drawer */}
      <DashboardCustomizer
        key={isCustomizerOpen ? 'open' : 'closed'}
        role="vendor"
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        settings={settings}
        onUpdate={handleUpdateSettings}
        onReset={handleResetSettings}
      />
    </div>
  )
}
