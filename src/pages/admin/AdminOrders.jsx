import { useState, useEffect } from 'react'
import { fetchOrders } from '../../api/driveApi'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders().then(data => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h3 style={{ marginBottom: '24px' }}>Global Logistics (All Orders)</h3>
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading all orders...</p>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Total Value</th>
                <th>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.date}</td>
                  <td>NPR {Number(o.total || 0).toLocaleString()}</td>
                  <td><span className={`status-badge status-${(o.status || '').toLowerCase()}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
