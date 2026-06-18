import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { fetchProducts } from '../api/driveApi'
import { useCart } from '../context/CartContext'

export default function Shop() {
  const { addToast } = useOutletContext()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    addToCart(product)
    addToast(`Added ${product.name} to cart!`)
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="shop-preview">
        <div className="shop-header">
          <div>
            <div className="section-tag">All Products</div>
            <div className="section-title">BazaarNet<br/>Storefront</div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading products from Google Drive...</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-img">
                  <img src={product.image} alt={product.name} />
                  <div className="product-category">{product.category}</div>
                </div>
                <div className="product-info">
                  <div className="product-vendor">{product.vendor}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-bottom">
                    <div className="product-price">NPR {Number(product.price).toLocaleString()}</div>
                    <button className="btn-add-cart" onClick={(e) => handleAddToCart(e, product)}>
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
