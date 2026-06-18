import { useState } from 'react'
import { FileText, AlertTriangle, Info, CheckCircle, Search } from 'lucide-react'

const MOCK_LOGS = [
  { id: 'LOG-001', time: '10 mins ago', type: 'INFO', message: 'Admin Sarah generated Monthly Financial Report.', user: 'Admin Sarah' },
  { id: 'LOG-002', time: '1 hour ago', type: 'WARNING', message: 'Failed login attempt for account contact@technepal.com (IP: 192.168.1.104).', user: 'System' },
  { id: 'LOG-003', time: '2 hours ago', type: 'CRITICAL', message: 'Super Admin updated Global Platform Fee to 5.0%.', user: 'Super Admin' },
  { id: 'LOG-004', time: '3 hours ago', type: 'INFO', message: 'Vendor Tech Store Nepal was suspended by Admin Raj.', user: 'Admin Raj' },
  { id: 'LOG-005', time: '5 hours ago', type: 'INFO', message: 'New vendor registration: Style Boutique.', user: 'System' },
  { id: 'LOG-006', time: '1 day ago', type: 'INFO', message: 'Database backup completed successfully.', user: 'System' },
]

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')

  const glassClass = 'glass-normal'
  const tableClassName = `portal-table-wrap ${glassClass}`

  const getLogIcon = (type) => {
    switch(type) {
      case 'CRITICAL': return <AlertTriangle size={16} color="#f87171" />
      case 'WARNING': return <AlertTriangle size={16} color="#fbbf24" />
      case 'INFO': return <Info size={16} color="#60a5fa" />
      default: return <FileText size={16} color="var(--muted)" />
    }
  }

  const filteredLogs = MOCK_LOGS.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>System Audit Logs</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Chronological record of platform activities and security events.</p>
        </div>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search logs by keyword or user..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '10px 12px 10px 40px', background: 'rgba(255,255,255,0.05)', 
              color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none'
            }}
          />
        </div>
      </div>

      <div className={tableClassName}>
        <table className="portal-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Type</th>
              <th>Timestamp</th>
              <th>Event Message</th>
              <th>Initiator</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{log.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: getLogIcon(log.type).props.color }}>
                      {getLogIcon(log.type)}
                      {log.type}
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{log.time}</td>
                  <td>{log.message}</td>
                  <td style={{ color: 'var(--muted)' }}>{log.user}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                  No logs found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
