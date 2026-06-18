import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function Reports() {
  const { showToast } = useToast()
  const glassClass = 'glass-normal'

  const handleDownload = (type, fileExtension) => {
    showToast(`Generating ${type} report...`, 'info')
    
    setTimeout(() => {
      let fileContent = ''
      let mimeType = ''
      
      if (fileExtension === 'csv') {
        fileContent = "ID,Date,Amount,Status\n101,2026-06-01,500.00,Completed\n102,2026-06-05,1200.50,Completed\n103,2026-06-10,350.00,Pending"
        mimeType = 'text/csv'
      } else {
        // Mock PDF content (just text file masquerading for simulation)
        fileContent = `BazaarNet ${type} Report\nGenerated: ${new Date().toLocaleDateString()}\n\n-- End of Report --`
        mimeType = 'application/pdf'
      }

      const blob = new Blob([fileContent], { type: mimeType })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `BazaarNet_${type.replace(/ /g, '_')}_Report.${fileExtension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showToast(`${type} report downloaded successfully.`, 'success')
    }, 1500)
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Reports & Exports</h3>
        <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Generate comprehensive financial and operational reports for accounting and compliance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Financial Report */}
        <div className={`portal-table-wrap ${glassClass}`} style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '12px' }}>
              <FileSpreadsheet size={28} color="#34d399" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Platform Financials</h4>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>GMV, Commission collected, Tax records.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => handleDownload('Financials', 'csv')}>
              <Download size={16} /> Download CSV
            </button>
            <button className="btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleDownload('Financials', 'pdf')}>
              <FileText size={16} /> Export PDF
            </button>
          </div>
        </div>

        {/* Vendor Performance */}
        <div className={`portal-table-wrap ${glassClass}`} style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(96, 165, 250, 0.1)', borderRadius: '12px' }}>
              <Calendar size={28} color="#60a5fa" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Vendor Performance</h4>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Sales metrics, return rates by merchant.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => handleDownload('Vendor Performance', 'csv')}>
              <Download size={16} /> Download CSV
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
