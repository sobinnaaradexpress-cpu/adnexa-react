import { useState, useEffect } from 'react'
import { Search, MessageSquare, AlertCircle, X, Loader } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { fetchTickets, updateTicket } from '../../api/driveApi'

export default function SupportTickets() {
  const { showToast } = useToast()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal State
  const [replyTicket, setReplyTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [newStatus, setNewStatus] = useState('Open')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const data = await fetchTickets()
      setTickets(data)
    } catch (e) {
      showToast('Failed to load tickets from DB', 'error')
    }
    setLoading(false)
  }

  const openReplyModal = (ticket) => {
    setReplyTicket(ticket)
    setNewStatus(ticket.status)
    setReplyMessage('')
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyMessage.trim()) {
      showToast('Reply message cannot be empty.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await updateTicket({ id: replyTicket.id, status: newStatus })
      setTickets(tickets.map(t => t.id === replyTicket.id ? { ...t, status: newStatus } : t))
      showToast(`Reply sent and ticket marked as ${newStatus}.`, 'success')
      setReplyTicket(null)
    } catch (err) {
      showToast('Error updating ticket in DB', 'error')
    }
    setIsSubmitting(false)
  }

  const filteredTickets = tickets.filter(t => 
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.from?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const glassClass = 'glass-normal'
  const tableClassName = `portal-table-wrap ${glassClass}`

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Platform Support</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Handle inquiries from Vendors and Customers.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search tickets by subject or user..." 
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
            Loading tickets from Database...
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>From</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{ticket.id}</td>
                    <td style={{ fontWeight: '500' }}>{ticket.subject}</td>
                    <td>
                      <div>{ticket.from}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{ticket.role}</div>
                    </td>
                    <td>
                      <span style={{ 
                        color: ticket.priority === 'High' ? '#f87171' : ticket.priority === 'Medium' ? '#fbbf24' : '#34d399',
                        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500'
                      }}>
                        {ticket.priority === 'High' && <AlertCircle size={14} />}
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{ticket.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => openReplyModal(ticket)}
                      >
                        <MessageSquare size={14} /> Reply
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                    No support tickets match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Reply Modal */}
      {replyTicket && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setReplyTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>Reply to Ticket</h3>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>{replyTicket.id} - {replyTicket.subject}</p>
              </div>
              {!isSubmitting && <button onClick={() => setReplyTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={20}/></button>}
            </div>
            
            <form onSubmit={handleReplySubmit} className="contact-form">
              <div className="form-group">
                <label>Update Status</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  disabled={isSubmitting}
                >
                  <option value="Open" style={{ color: '#000' }}>Open</option>
                  <option value="In Progress" style={{ color: '#000' }}>In Progress</option>
                  <option value="Closed" style={{ color: '#000' }}>Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Reply Message</label>
                <textarea 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={`Type your response to ${replyTicket.from}...`}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              <div className="modal-actions" style={{ marginTop: '32px' }}>
                <button type="button" className="modal-btn-cancel" onClick={() => setReplyTicket(null)} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="modal-btn-confirm" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
