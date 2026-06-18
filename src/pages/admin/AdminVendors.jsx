import { useState, useEffect } from 'react'
import { fetchVendors } from '../../api/driveApi'

export default function AdminVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendors().then(data => {
      setVendors(data)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h3 style={{ marginBottom: '24px' }}>All Vendors</h3>
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading vendors...</p>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vendor Name</th>
                <th>Total Products</th>
                <th>Total Revenue</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.name}</td>
                  <td>{v.products}</td>
                  <td>NPR {Number(v.revenue || 0).toLocaleString()}</td>
                  <td><span className={`status-badge status-${(v.status || '').toLowerCase()}`}>{v.status}</span></td>
                  <td>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
