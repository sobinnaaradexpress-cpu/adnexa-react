import { useState, useEffect } from 'react'
import { Package, PlusCircle, Trash2, Edit, Loader, Search } from 'lucide-react'
import { fetchProducts, addProduct, deleteProduct as apiDeleteProduct } from '../../api/driveApi'
import { useToast } from '../../context/ToastContext'
import { useModal } from '../../context/ModalContext'

export default function VendorProducts() {
  const { showToast } = useToast()
  const { showModal } = useModal()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form State
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Groceries')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts()
      // Optional: Filter by specific vendor if we had an auth system
      setProducts(data || [])
    } catch (e) {
      showToast('Failed to load products from database.', 'error')
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !price || !stock) {
      showToast('Please fill all required fields.', 'error')
      return
    }

    setIsAdding(true)
    const newProduct = {
      id: `PRD-${Math.floor(Math.random() * 9000) + 1000}`,
      name,
      vendor: "Mock Vendor", // Hardcoded for demo until auth is added
      price: Number(price),
      category,
      image,
      stock: Number(stock),
      sales: 0
    }

    try {
      await addProduct(newProduct)
      setProducts([...products, newProduct])
      showToast('Product successfully added to catalog.', 'success')
      setName('')
      setPrice('')
      setStock('')
    } catch (err) {
      showToast("Failed to save product to database.", "error")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = (id) => {
    showModal({
      title: 'Delete Product',
      message: 'Are you sure you want to permanently remove this product from your store?',
      confirmText: 'Delete Product',
      isDanger: true,
      onConfirm: async () => {
        try {
          await apiDeleteProduct(id)
          setProducts(products.filter(p => p.id !== id))
          showToast('Product deleted.', 'success')
        } catch (e) {
          showToast('Failed to delete product', 'error')
        }
      }
    })
  }

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const glassClass = 'glass-normal'

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>My Products</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '14px' }}>Manage your store's inventory and catalog.</p>
        </div>
      </div>

      <div className={`portal-card ${glassClass}`} style={{ marginBottom: '32px' }}>
        <div className="portal-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={18} color="var(--accent)" />
          <span>Add New Product</span>
        </div>
        <form onSubmit={handleSubmit} className="contact-form" style={{ marginTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group">
              <label>Price (NPR)</label>
              <input 
                type="number" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              >
                <option style={{color:'#000'}}>Groceries</option>
                <option style={{color:'#000'}}>Fashion</option>
                <option style={{color:'#000'}}>Electronics</option>
                <option style={{color:'#000'}}>Crafts</option>
              </select>
            </div>
            <div className="form-group">
              <label>Initial Stock Quantity</label>
              <input 
                type="number" 
                value={stock} 
                onChange={e => setStock(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={isAdding} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} />
              {isAdding ? 'Adding to DB...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search products by name or category..." 
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
            Loading products from Database...
          </div>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name & ID</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sales</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{p.id}</div>
                    </td>
                    <td>{p.category}</td>
                    <td style={{ fontWeight: '600', color: 'var(--accent)' }}>NPR {Number(p.price || 0).toLocaleString()}</td>
                    <td>
                      <span style={{ color: p.stock < 10 ? '#f87171' : 'inherit' }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>{p.sales}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }} title="Edit Product">
                          <Edit size={16} />
                        </button>
                        <button 
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }} 
                          title="Delete Product"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                    No products found in your catalog.
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
