import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Search, DollarSign, Loader } from 'lucide-react'
import { useModal } from '../../context/ModalContext'
import { useToast } from '../../context/ToastContext'
import { fetchPayouts, updatePayout } from '../../api/driveApi'

export default function Payouts() {
  const { showModal } = useModal()
  const { showToast } = useToast()
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadPayouts()
  }, [])

  const loadPayouts = async () => {
    setLoading(true)
    try {
      const data = await fetchPayouts()
      setPayouts(data)
    } catch (e) {
      showToast('Failed to load payouts from DB', 'error')
    }
    setLoading(false)
  }

  const handleApprove = (id) => {
    showModal({
      title: 'Approve Payout',
      message: 'Are you sure you want to approve this payout? Funds will be scheduled for transfer to the vendor\'s bank account.',
      confirmText: 'Approve Transfer',
      onConfirm: async () => {
        try {
          await updatePayout({ id, status: 'Completed' })
          setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Completed' } : p))
          showToast('Payout approved successfully.', 'success')
        } catch (e) {
          showToast('Failed to approve payout', 'error')
        }
      }
    })
  }

  const handleReject = (id) => {
    showModal({
      title: 'Reject Payout',
      message: 'Are you sure you want to reject this payout request? Please ensure you have contacted the vendor with the reason.',
      confirmText: 'Reject Payout',
      isDanger: true,
      onConfirm: async () => {
        try {
          await updatePayout({ id, status: 'Failed' })
          setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Failed' } : p))
          showToast('Payout rejected.', 'info')
        } catch (e) {
          showToast('Failed to reject payout', 'error')
        }
      }
    })
  }

  const filteredPayouts = payouts.filter(p => 
    p.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const glassClass = 'glass-normal'
  const tableClassName = `portal-table-wrap ${glassClass}`

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Vendor Payouts</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Review and approve vendor withdrawal requests.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search by vendor or ID..." 
            className="form-control"
            style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={tableClassName}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
            <Loader className="spin" size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading payouts from Database...
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Bank Details</th>
                <th>Status</th>
                <th>Requested At</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.length > 0 ? (
                filteredPayouts.map(payout => (
                  <tr key={payout.id}>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{payout.id}</td>
                    <td style={{ fontWeight: '500' }}>{payout.vendor}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: '600', color: '#34d399' }}>
                        <DollarSign size={14} />{payout.amount}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{payout.bank}</td>
                    <td>
                      <span className={`status-badge status-${payout.status.toLowerCase()}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{payout.requestedAt}</td>
                    <td style={{ textAlign: 'right' }}>
                      {payout.status === 'Pending' ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            className="btn-outline" 
                            style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)' }}
                            onClick={() => handleReject(payout.id)}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                          <button 
                            className="btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            onClick={() => handleApprove(payout.id)}
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '13px' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                    No payout requests match your search.
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
