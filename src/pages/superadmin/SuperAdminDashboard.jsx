import { useState } from 'react'
import { Activity, CreditCard, DollarSign, Users, Globe, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

const MOCK_PLATFORM_REVENUE = [
  { name: 'Jan', revenue: 15000 },
  { name: 'Feb', revenue: 18000 },
  { name: 'Mar', revenue: 22000 },
  { name: 'Apr', revenue: 27000 },
  { name: 'May', revenue: 35000 },
  { name: 'Jun', revenue: 42000 },
]

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(false)

  const glassClass = 'glass-normal'
  const cardClassName = `portal-card ${glassClass}`

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Platform Overview</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>System health and high-level platform analytics.</p>
        </div>
      </div>

      {/* Global Stats Cards */}
      <div className="portal-grid">
        <div className={cardClassName}>
          <div className="portal-card-header">
            Total Gross Merchandise Value (GMV)
            <div className="portal-card-icon"><Globe size={20} /></div>
          </div>
          <div className="portal-card-value">
            <span>NPR</span>
            14,500,000
            <span className="trend-indicator trend-up"><ArrowUpRight size={14}/> 22%</span>
          </div>
        </div>

        <div className={cardClassName}>
          <div className="portal-card-header">
            Platform Commission Revenue
            <div className="portal-card-icon"><DollarSign size={20} /></div>
          </div>
          <div className="portal-card-value">
            <span>NPR</span>
            725,000
            <span className="trend-indicator trend-up"><ArrowUpRight size={14}/> 15%</span>
          </div>
        </div>

        <div className={cardClassName}>
          <div className="portal-card-header">
            Total Active Users
            <div className="portal-card-icon"><Users size={20} /></div>
          </div>
          <div className="portal-card-value">
            1,204
            <span className="trend-indicator trend-up"><ArrowUpRight size={14}/> 45</span>
          </div>
        </div>
      </div>

      <div className="dashboard-complex-grid">
        {/* Platform Revenue Area Chart */}
        <div className={`chart-container ${glassClass}`}>
          <div className="chart-header">
            Platform Revenue Trends
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Last 6 Months (5% Commission)</span>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={MOCK_PLATFORM_REVENUE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlatformRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `NPR ${value/1000}k`} width={80} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Platform Revenue" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorPlatformRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Mini List */}
        <div className={`chart-container ${glassClass}`}>
          <div className="chart-header">
            System Infrastructure
          </div>
          <div className="mini-list">
            <div className="mini-list-item">
              <div className="mini-list-left">
                <div className="mini-list-avatar" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.1)' }}>
                  <Activity size={18} />
                </div>
                <div className="mini-list-info">
                  <h5>API Services</h5>
                  <p>All endpoints operational</p>
                </div>
              </div>
              <div className="mini-list-right" style={{ color: '#34d399' }}>99.99%</div>
            </div>
            <div className="mini-list-item">
              <div className="mini-list-left">
                <div className="mini-list-avatar" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)' }}>
                  <CreditCard size={18} />
                </div>
                <div className="mini-list-info">
                  <h5>Payment Gateway</h5>
                  <p>eSewa / Khalti</p>
                </div>
              </div>
              <div className="mini-list-right" style={{ color: '#34d399' }}>Online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
