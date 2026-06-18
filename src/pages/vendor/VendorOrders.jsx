import { useState, useEffect } from 'react'
import { Search, Loader, RefreshCw } from 'lucide-react'
import { fetchOrders, updateOrderStatus } from '../../api/driveApi'
import { useToast } from '../../context/ToastContext'

export default function VendorOrders() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchOrders()
      setOrders(data || [])
    } catch (e) {
      showToast('Failed to load orders from database.', 'error')
    }
    setLoading(false)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      showToast(`Order ${orderId} updated to ${newStatus}.`, 'success')
    } catch (err) {
      showToast("Failed to update order status.", "error")
    }
  }

  const filteredOrders = orders.filter(o => 
    o.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const glassClass = 'glass-normal'

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Order Management</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Track and fulfill customer orders.</p>
        </div>
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

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search orders by ID or customer..." 
            className="form-control"
            style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={`portal-table-wrap ${glassClass}`}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
            <Loader className="spin" size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading orders from Database...
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{o.id}</td>
                    <td style={{ fontWeight: '500' }}>{o.customer}</td>
                    <td style={{ color: 'var(--muted)' }}>{o.date}</td>
                    <td style={{ fontWeight: '600', color: 'var(--accent)' }}>NPR {Number(o.total || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${(o.status || '').toLowerCase()}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <select 
                        value={o.status} 
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{ padding: '8px 12px', fontSize: '13px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', minWidth: '130px' }}
                      >
                        <option value="Pending" style={{color:'#000'}}>Pending</option>
                        <option value="Processing" style={{color:'#000'}}>Processing</option>
                        <option value="Shipped" style={{color:'#000'}}>Shipped</option>
                        <option value="Delivered" style={{color:'#000'}}>Delivered</option>
                        <option value="Cancelled" style={{color:'#000'}}>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
