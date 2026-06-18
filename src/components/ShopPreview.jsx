import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { fetchProducts } from '../api/driveApi'

export default function ShopPreview() {
  const { addToast } = useOutletContext()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then(data => {
      setFeaturedProducts(data.slice(0, 4))
      setLoading(false)
    })
  }, [])

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    addToast(`Added ${product.name} to cart!`)
  }

  return (
    <section className="shop-preview" id="shop-preview">
      <div className="shop-header">
        <div>
          <div className="section-tag">Marketplace</div>
          <div className="section-title">Trending<br/>Products</div>
        </div>
        <Link to="/" className="btn-ghost">View All Products →</Link>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading products from Google Drive...</p>
      ) : (
        <div className="products-grid">
          {featuredProducts.map(product => (
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
    </section>
  )
}
