import { useState, useEffect } from 'react'
import { MoreVertical, ShieldAlert, CheckCircle, Trash2, Edit, X, Loader } from 'lucide-react'
import { useModal } from '../../context/ModalContext'
import { useToast } from '../../context/ToastContext'
import { fetchUsers, addUser, updateUser, deleteUser as apiDeleteUser } from '../../api/driveApi'

export default function UserManagement() {
  const { showModal } = useModal()
  const { showToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  
  // Local Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Vendor' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (e) {
      showToast('Failed to load users from DB', 'error')
    }
    setLoading(false)
  }

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active'
    try {
      // Optimistic update
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
      await updateUser({ id: user.id, status: newStatus })
      showToast(`User ${newStatus.toLowerCase()} successfully.`, 'success')
    } catch (e) {
      showToast('Error updating status', 'error')
      loadUsers() // Revert
    }
  }

  const deleteUser = (id) => {
    showModal({
      title: 'Delete User',
      message: 'Are you sure you want to permanently delete this user? This action cannot be undone and will erase all associated records.',
      confirmText: 'Delete User',
      isDanger: true,
      onConfirm: async () => {
        try {
          // Optimistic update
          setUsers(users.filter(u => u.id !== id))
          await apiDeleteUser(id)
          showToast('User has been permanently deleted.', 'success')
        } catch (e) {
          showToast('Error deleting user', 'error')
          loadUsers()
        }
      }
    })
  }

  const openAddUser = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', role: 'Vendor' })
    setIsFormOpen(true)
  }

  const openEditUser = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role })
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      showToast('Please fill out all fields.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      if (editingUser) {
        // Update existing
        const updatedData = { id: editingUser.id, name: formData.name, email: formData.email, role: formData.role }
        await updateUser(updatedData)
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updatedData } : u))
        showToast('User updated successfully.', 'success')
      } else {
        // Add new
        const newUser = {
          id: `USR-${Math.floor(Math.random() * 900) + 100}`,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: 'Active',
          joined: new Date().toISOString().split('T')[0]
        }
        await addUser(newUser)
        setUsers([...users, newUser])
        showToast('User added successfully.', 'success')
      }
      setIsFormOpen(false)
    } catch (err) {
      showToast('Error saving user to DB', 'error')
    }
    setIsSubmitting(false)
  }

  const filteredUsers = filter === 'All' ? users : users.filter(u => u.role === filter)

  const glassClass = 'glass-normal'
  const tableClassName = `portal-table-wrap ${glassClass}`

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>User Management</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Manage Admins, Vendors, and overall platform access.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="form-control" 
            style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All" style={{ color: '#000' }}>All Roles</option>
            <option value="Admin" style={{ color: '#000' }}>Admins Only</option>
            <option value="Vendor" style={{ color: '#000' }}>Vendors Only</option>
          </select>
          <button className="btn-primary" onClick={openAddUser} style={{ padding: '8px 20px', fontSize: '14px' }}>+ Invite User</button>
        </div>
      </div>

      <div className={tableClassName}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
            <Loader className="spin" size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading users from Database...
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{user.id}</td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{user.email}</div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                        background: user.role === 'Admin' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                        color: user.role === 'Admin' ? '#3b82f6' : '#a855f7'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{user.joined}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button 
                          onClick={() => toggleStatus(user)}
                          style={{ background: 'none', border: 'none', color: user.status === 'Active' ? '#f87171' : '#34d399', cursor: 'pointer', padding: 0 }}
                          title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                        >
                          {user.status === 'Active' ? <ShieldAlert size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <button 
                          onClick={() => openEditUser(user)}
                          style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: 0 }}
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0 }}
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                    No users found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setIsFormOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>{editingUser ? 'Edit User' : 'Invite New User'}</h3>
              {!isSubmitting && <button onClick={() => setIsFormOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={20}/></button>}
            </div>
            
            <form onSubmit={handleFormSubmit} className="contact-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Platform Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  disabled={isSubmitting}
                >
                  <option value="Vendor" style={{ color: '#000' }}>Vendor</option>
                  <option value="Admin" style={{ color: '#000' }}>Admin</option>
                  <option value="Customer" style={{ color: '#000' }}>Customer</option>
                </select>
              </div>
              
              <div className="modal-actions" style={{ marginTop: '32px' }}>
                <button type="button" className="modal-btn-cancel" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="modal-btn-confirm" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingUser ? 'Save Changes' : 'Invite User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
