import { createContext, useContext, useState, useEffect } from 'react'
import { fetchUsers, addUser } from '../api/driveApi'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bazaarnet_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('bazaarnet_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('bazaarnet_user')
    }
  }, [user])

  const signup = async (email, password) => {
    const users = await fetchUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.')
    }
    
    await addUser({ email, password, role: 'customer' });
    
    // Auto login after signup
    let name = email.split('@')[0]
    name = name.charAt(0).toUpperCase() + name.slice(1)
    setUser({ email, role: 'customer', name })
  }

  const login = async (email, password) => {
    let role = 'customer'
    let name = email.split('@')[0]
    name = name.charAt(0).toUpperCase() + name.slice(1)
    
    // Hardcoded bypass for admin and vendor roles for testing
    if (email.includes('admin')) {
      setUser({ email, role: 'admin', name: 'Admin' })
      return
    }
    if (email.includes('vendor')) {
      setUser({ email, role: 'vendor', name: 'Vendor' })
      return
    }

    // For customers, verify credentials against Drive DB
    const users = await fetchUsers();
    const found = users.find(u => u.email === email && String(u.password) === password)
    
    if (!found) {
      throw new Error('Invalid email or password. Please sign up first.')
    }

    setUser({ email, role: 'customer', name })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
