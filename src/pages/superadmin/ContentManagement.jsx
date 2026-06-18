import { useState, useEffect, useRef } from 'react'
import { Image, Bell, UploadCloud, Eye, Trash2, Loader } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { useModal } from '../../context/ModalContext'
import { fetchBanners, addBanner, deleteBanner as apiDeleteBanner, fetchSettings, saveSettings } from '../../api/driveApi'

export default function ContentManagement() {
  const { showToast } = useToast()
  const { showModal } = useModal()
  
  const [announcement, setAnnouncement] = useState('')
  const [savingAnnouncement, setSavingAnnouncement] = useState(false)
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const bannerData = await fetchBanners()
      setBanners(bannerData)
      
      const settingsData = await fetchSettings()
      const annObj = settingsData.find(s => s.key === 'announcement')
      if (annObj) setAnnouncement(annObj.value)
    } catch (e) {
      showToast('Failed to load content from DB', 'error')
    }
    setLoading(false)
  }

  const handleSaveAnnouncement = async () => {
    setSavingAnnouncement(true)
    try {
      const existingSettings = await fetchSettings()
      const settingsObj = {}
      existingSettings.forEach(s => { settingsObj[s.key] = s.value })
      settingsObj.announcement = announcement
      
      await saveSettings(settingsObj)
      showToast('Global announcement updated.', 'success')
    } catch (e) {
      showToast('Error saving announcement', 'error')
    }
    setSavingAnnouncement(false)
  }

  const handleUploadBanner = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    showToast(`Uploading ${file.name}...`, 'info')
    
    setTimeout(async () => {
      const newBanner = {
        id: `BNR-${Math.floor(Math.random() * 900) + 100}`,
        title: file.name,
        location: 'Homepage Slider',
        active: 'Yes',
        url: URL.createObjectURL(file) // Store a blob url just for preview
      }
      
      try {
        await addBanner(newBanner)
        setBanners([...banners, newBanner])
        showToast('Banner uploaded successfully to DB.', 'success')
      } catch (err) {
        showToast('Failed to save banner', 'error')
      }
    }, 1500)
  }

  const deleteBanner = (id) => {
    showModal({
      title: 'Delete Banner',
      message: 'Are you sure you want to delete this banner? It will be removed from the storefront immediately.',
      confirmText: 'Delete Banner',
      isDanger: true,
      onConfirm: async () => {
        try {
          await apiDeleteBanner(id)
          setBanners(banners.filter(b => b.id !== id))
          showToast('Banner removed successfully.', 'success')
        } catch (e) {
          showToast('Error deleting banner', 'error')
        }
      }
    })
  }

  const glassClass = 'glass-normal'

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Content Management</h3>
        <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Update homepage banners, flash sales, and platform announcements.</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
        
        {/* Top Announcement Bar Control */}
        <div className={`portal-table-wrap ${glassClass}`} style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
              <Bell size={28} color="#f59e0b" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Global Announcement Bar</h4>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Displayed at the very top of the storefront.</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              className="form-control" 
              style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="e.g. Flash Sale: Get 20% off on all Electronics using code FLASH20!"
            />
            <button className="btn-primary" onClick={handleSaveAnnouncement} disabled={savingAnnouncement}>
              {savingAnnouncement ? 'Saving...' : 'Update'}
            </button>
          </div>
        </div>

        {/* Homepage Banners */}
        <div className={`portal-table-wrap ${glassClass}`} style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                <Image size={28} color="#3b82f6" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Homepage Banners</h4>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Manage the hero carousel images.</div>
              </div>
            </div>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleFileChange}
              />
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleUploadBanner}>
                <UploadCloud size={16} /> Upload New
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              <Loader className="spin" size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
              Loading banners from Database...
            </div>
          ) : (
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Active</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map(banner => (
                  <tr key={banner.id}>
                    <td>
                      <div style={{ width: '80px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                         {banner.url ? (
                           <img src={banner.url} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         ) : (
                           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '10px' }}>No Image</div>
                         )}
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{banner.id}</td>
                    <td style={{ fontWeight: '500' }}>{banner.title}</td>
                    <td>{banner.location}</td>
                    <td>
                      <span className={`status-badge status-active`}>
                        {banner.active}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0 }} title="Preview">
                          <Eye size={18} />
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }} title="Delete Banner" onClick={() => deleteBanner(banner.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {banners.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                      No banners found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}
