import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarnet_cart')
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error("Failed to parse cart items:", e)
      return []
    }
  })
  
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('bazaarnet_cart', JSON.stringify(cartItems || []))
  }, [cartItems])

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('cart-open')
    } else {
      document.body.classList.remove('cart-open')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('cart-open')
    }
  }, [isCartOpen])

  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error("Attempted to add invalid product to cart", product);
      // Generate a temporary ID if missing, so the UI doesn't break
      product = { ...product, id: product?.id || Date.now() };
    }

    setCartItems(prev => {
      const currentCart = Array.isArray(prev) ? prev : [];
      // Use == to allow matching string IDs from API to numeric IDs from local storage/mock
      const existing = currentCart.find(item => String(item.id) === String(product.id))
      
      if (existing) {
        return currentCart.map(item => 
          String(item.id) === String(product.id) ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      }
      return [...currentCart, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const currentCart = Array.isArray(prev) ? prev : [];
      return currentCart.filter(item => String(item.id) !== String(productId))
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev => {
      const currentCart = Array.isArray(prev) ? prev : [];
      return currentCart.map(item => 
        String(item.id) === String(productId) ? { ...item, quantity } : item
      )
    })
  }
  
  const toggleCart = () => setIsCartOpen(!isCartOpen)

  const clearCart = () => {
    setCartItems([])
  }
  
  const currentCart = Array.isArray(cartItems) ? cartItems : [];
  const cartCount = currentCart.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const cartTotal = currentCart.reduce((acc, item) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0)

  return (
    <CartContext.Provider value={{ 
      cartItems: currentCart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
