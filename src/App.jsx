import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FrontLayout from './layouts/FrontLayout'
import PortalLayout from './layouts/PortalLayout'
import Landing from './pages/Landing'
import Shop from './pages/Shop'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVendors from './pages/admin/AdminVendors'
import AdminOrders from './pages/admin/AdminOrders'
import VendorDashboard from './pages/vendor/VendorDashboard'
import VendorProducts from './pages/vendor/VendorProducts'
import VendorOrders from './pages/vendor/VendorOrders'
import VendorSettings from './pages/vendor/VendorSettings'

import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import UserManagement from './pages/superadmin/UserManagement'
import SystemSettings from './pages/superadmin/SystemSettings'
import AuditLogs from './pages/superadmin/AuditLogs'
import Payouts from './pages/superadmin/Payouts'
import SupportTickets from './pages/superadmin/SupportTickets'
import ContentManagement from './pages/superadmin/ContentManagement'
import Integrations from './pages/superadmin/Integrations'
import Reports from './pages/superadmin/Reports'

import { ToastProvider } from './context/ToastContext'
import { ModalProvider } from './context/ModalContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <ToastProvider>
      <ModalProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
            {/* Public Facing Pages */}
            <Route path="/" element={<FrontLayout />}>
              <Route index element={<Shop />} />
              <Route path="become-vendor" element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Login />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>
            
            {/* Super Admin Portal */}
            <Route path="/superadmin" element={<PortalLayout role="superadmin" />}>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="support" element={<SupportTickets />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="logs" element={<AuditLogs />} />
            </Route>

            {/* Admin Portal */}
            <Route path="/admin" element={<PortalLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="vendors" element={<AdminVendors />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="logistics" element={<AdminOrders />} />
            </Route>

            {/* Vendor Portal */}
            <Route path="/vendor" element={<PortalLayout role="vendor" />}>
              <Route index element={<VendorDashboard />} />
              <Route path="products" element={<VendorProducts />} />
              <Route path="orders" element={<VendorOrders />} />
              <Route path="settings" element={<VendorSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
      </ModalProvider>
    </ToastProvider>
  )
}

export default App

