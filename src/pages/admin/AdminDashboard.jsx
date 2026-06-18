import { useState, useEffect } from 'react'
import { fetchVendors, fetchOrders } from '../../api/driveApi'
import { 
  Activity, Users, ShoppingCart, Sliders, 
  UserPlus, FileSpreadsheet, Settings, Truck, RefreshCw, Package, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import DashboardCustomizer from '../../components/DashboardCustomizer'

const DEFAULT_SETTINGS = {
  welcomeMessage: 'Overview',
  accentColor: '#ff4d00',
  accentColor2: '#ff8c42',
  visibleCards: {
    revenue: true,
    entities: true,
    orders: true
  },
  showQuickActions: true,
  showTargetGoal: true,
  targetGoal: 1000000,
  glassmorphism: 'normal',
  cardGlow: false,
  tableLimit: 4,
  tableStatusFilter: 'All'
}

// Mock Chart Data
const MOCK_REVENUE_DATA = [
  { name: 'Jan', revenue: 450000 },
  { name: 'Feb', revenue: 520000 },
  { name: 'Mar', revenue: 480000 },
  { name: 'Apr', revenue: 610000 },
  { name: 'May', revenue: 750000 },
  { name: 'Jun', revenue: 890000 },
]

const MOCK_DELIVERY_DATA = [
  { name: 'Mon', completed: 12, delayed: 2 },
  { name: 'Tue', completed: 19, delayed: 1 },
  { name: 'Wed', completed: 15, delayed: 0 },
  { name: 'Thu', completed: 22, delayed: 3 },
  { name: 'Fri', completed: 28, delayed: 1 },
  { name: 'Sat', completed: 35, delayed: 4 },
  { name: 'Sun', completed: 10, delayed: 0 },
]

const PIE_COLORS = ['#fbbf24', '#60a5fa', '#34d399']

export default function AdminDashboard() {
  const [vendors, setVendors] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })
  
  // Tab State
  const [activeTab, setActiveTab] = useState('vendors') // 'vendors' | 'logistics'

  // Customization State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('adnexa-dashboard-settings-admin')
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
  })

  const loadData = () => {
    setLoading(true)
    Promise.all([fetchVendors(), fetchOrders()]).then(([vData, oData]) => {
      setVendors(vData)
      setOrders(oData)
      setLoading(false)
    })
  }

  useEffect(() => {
    Promise.all([fetchVendors(), fetchOrders()]).then(([vData, oData]) => {
      setVendors(vData)
      setOrders(oData)
      setLoading(false)
    })
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
      localStorage.setItem('adnexa-dashboard-settings-admin', JSON.stringify(newSettings))
      showToast('Settings saved successfully!')
    }
  }

  const handleResetSettings = () => {
    localStorage.removeItem('adnexa-dashboard-settings-admin')
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

  const totalRevenue = vendors.reduce((sum, v) => sum + (Number(v.revenue) || 0), 0)
  const activeVendors = vendors.filter(v => v.status === 'Active').length

  // Filter & limit table list based on settings
  const filteredVendors = vendors
    .filter(v => settings.tableStatusFilter === 'All' || v.status === settings.tableStatusFilter)
    .slice(0, settings.tableLimit)

  // Derived Logistics Stats
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length
  const orderStatsPie = [
    { name: 'Pending', value: pendingOrders || 1 }, // Default 1 to show chart if empty
    { name: 'In Transit', value: shippedOrders || 1 },
    { name: 'Delivered', value: deliveredOrders || 1 },
  ]

  // Top Vendors
  const topVendors = [...vendors].sort((a, b) => b.revenue - a.revenue).slice(0, 4)

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading network data...</p>

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
              {pld.name}: {pld.name.toLowerCase().includes('revenue') ? 'NPR ' : ''}{pld.value.toLocaleString()}
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
          {settings.welcomeMessage || 'Overview'}
        </h3>
        <button 
          className="btn-personalize-fab"
          onClick={() => setIsCustomizerOpen(true)}
        >
          <Sliders size={16} />
          <span>Personalize Dashboard</span>
        </button>
      </div>

      {/* Dashboard Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('vendors')}
          style={{
            padding: '10px 20px', background: activeTab === 'vendors' ? 'var(--accent)' : 'transparent',
            border: `1px solid ${activeTab === 'vendors' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '8px', cursor: 'pointer', color: activeTab === 'vendors' ? '#fff' : 'var(--text)',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: activeTab === 'vendors' ? '600' : '400'
          }}
        >
          <Users size={18} />
          Merchant Overview
        </button>
        <button 
          onClick={() => setActiveTab('logistics')}
          style={{
            padding: '10px 20px', background: activeTab === 'logistics' ? 'var(--accent)' : 'transparent',
            border: `1px solid ${activeTab === 'logistics' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '8px', cursor: 'pointer', color: activeTab === 'logistics' ? '#fff' : 'var(--text)',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: activeTab === 'logistics' ? '600' : '400'
          }}
        >
          <Truck size={18} />
          Logistics Overview
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'vendors' ? (
        <>
          {/* Revenue Goal Target Widget */}
          {settings.showTargetGoal !== false && (
            <div className={`progress-container ${glassClass} ${glowClass}`}>
              <div className="progress-header">
                <span className="progress-title">Network Monthly Revenue Target</span>
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
                  Total Network Revenue
                  <div className="portal-card-icon"><Activity size={20} /></div>
                </div>
                <div className="portal-card-value">
                  <span>NPR</span>
                  {totalRevenue.toLocaleString()}
                  <span className="trend-indicator trend-up"><ArrowUpRight size={14}/> 12.5%</span>
                </div>
              </div>
            )}

            {(settings.visibleCards?.entities !== false) && (
              <div className={cardClassName}>
                <div className="portal-card-header">
                  Active Vendors
                  <div className="portal-card-icon"><Users size={20} /></div>
                </div>
                <div className="portal-card-value">
                  {activeVendors}
                  <span className="trend-indicator trend-up"><ArrowUpRight size={14}/> 4</span>
                </div>
              </div>
            )}

            {(settings.visibleCards?.orders !== false) && (
              <div className={cardClassName}>
                <div className="portal-card-header">
                  Total Vendors
                  <div className="portal-card-icon"><UserPlus size={20} /></div>
                </div>
                <div className="portal-card-value">
                  {vendors.length}
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-complex-grid">
            {/* Revenue Area Chart */}
            <div className={`chart-container ${glassClass}`}>
              <div className="chart-header">
                Network Revenue Trends
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Last 6 Months</span>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={MOCK_REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `NPR ${value/1000}k`} width={80} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Vendors Mini List */}
            <div className={`chart-container ${glassClass}`}>
              <div className="chart-header">
                Top Performing Vendors
              </div>
              <div className="mini-list">
                {topVendors.map((vendor, idx) => (
                  <div className="mini-list-item" key={vendor.id || idx}>
                    <div className="mini-list-left">
                      <div className="mini-list-avatar">
                        {vendor.name.charAt(0)}
                      </div>
                      <div className="mini-list-info">
                        <h5>{vendor.name}</h5>
                        <p>{vendor.products} Products</p>
                      </div>
                    </div>
                    <div className="mini-list-right" style={{ color: 'var(--accent)' }}>
                      NPR {Number(vendor.revenue || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          {settings.showQuickActions !== false && (
            <>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '500' }}>Admin Shortcuts</h3>
              <div className="quick-actions-grid">
                <button className={`quick-action-btn ${glassClass}`} onClick={() => showToast('Simulating: Accessing vendor registration...')}>
                  <div className="quick-action-icon"><UserPlus size={20} /></div>
                  <span>Register Vendor</span>
                </button>
                <button className={`quick-action-btn ${glassClass}`} onClick={() => showToast('Simulating: Opening system configurations...')}>
                  <div className="quick-action-icon"><Settings size={20} /></div>
                  <span>System Settings</span>
                </button>
                <button className={`quick-action-btn ${glassClass}`} onClick={() => showToast('Simulating: Exporting audit spreadsheets...')}>
                  <div className="quick-action-icon"><FileSpreadsheet size={20} /></div>
                  <span>Export Audit</span>
                </button>
              </div>
            </>
          )}

          {/* Recent Vendors Table */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '32px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>Recent Network Vendors</h3>
            <button 
              onClick={loadData}
              style={{ 
                background: 'none', border: 'none', color: 'var(--muted)', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' 
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
                  <th>Vendor Name</th>
                  <th>Total Products</th>
                  <th>Total Sales</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map(v => (
                    <tr key={v.id}>
                      <td>{v.name}</td>
                      <td>{v.products}</td>
                      <td>NPR {Number(v.revenue || 0).toLocaleString()}</td>
                      <td><span className={`status-badge status-${(v.status || '').toLowerCase()}`}>{v.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                      No vendors found matching your current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* LOGISTICS OVERVIEW TAB */}
          <div className="portal-grid" style={{ marginBottom: '32px' }}>
            <div className={cardClassName}>
              <div className="portal-card-header">
                Pending Operations
                <div className="portal-card-icon"><Package size={20} /></div>
              </div>
              <div className="portal-card-value" style={{ color: '#fbbf24' }}>
                {pendingOrders}
                <span className="trend-indicator trend-neutral">-</span>
              </div>
            </div>
            
            <div className={cardClassName}>
              <div className="portal-card-header">
                Orders in Transit
                <div className="portal-card-icon"><Truck size={20} /></div>
              </div>
              <div className="portal-card-value" style={{ color: '#60a5fa' }}>
                {shippedOrders}
                <span className="trend-indicator trend-up"><ArrowUpRight size={14}/> 8%</span>
              </div>
            </div>

            <div className={cardClassName}>
              <div className="portal-card-header">
                Successfully Delivered
                <div className="portal-card-icon"><ShoppingCart size={20} /></div>
              </div>
              <div className="portal-card-value" style={{ color: '#34d399' }}>
                {deliveredOrders}
                <span className="trend-indicator trend-up"><ArrowUpRight size={14}/> 15%</span>
              </div>
            </div>
          </div>

          <div className="dashboard-complex-grid">
            {/* Logistics Bar Chart */}
            <div className={`chart-container ${glassClass}`}>
              <div className="chart-header">
                Delivery Volume (Past 7 Days)
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={MOCK_DELIVERY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}/>
                    <Bar dataKey="completed" name="Completed Deliveries" fill="#34d399" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="delayed" name="Delayed/Pending" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Logistics Status Donut */}
            <div className={`chart-container ${glassClass}`} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="chart-header">
                Live Status Breakdown
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatsPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {orderStatsPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for Donut */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{orders.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Total</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>Recent Dispatch Orders</h3>
            <button 
              onClick={loadData}
              style={{ 
                background: 'none', border: 'none', color: 'var(--muted)', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' 
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
                  <th>Total</th>
                  <th>Delivery Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.slice(0, settings.tableLimit + 2).map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: '500' }}>{o.id}</td>
                      <td>{o.customer || o.customerName || 'N/A'}</td>
                      <td>NPR {Number(o.total || 0).toLocaleString()}</td>
                      <td style={{ color: 'var(--muted)' }}>{o.date}</td>
                      <td><span className={`status-badge status-${(o.status || '').toLowerCase()}`}>{o.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                      No logistics orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Settings Customizer drawer */}
      <DashboardCustomizer
        key={isCustomizerOpen ? 'open' : 'closed'}
        role="admin"
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        settings={settings}
        onUpdate={handleUpdateSettings}
        onReset={handleResetSettings}
      />
    </div>
  )
}
