import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ToastProvider from './components/Toast.jsx';
import AdminSidebar from './components/AdminSidebar.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MockPaymentPage from './pages/MockPaymentPage.jsx';

import DashboardPage from './pages/admin/DashboardPage.jsx';
import ProductListPage from './pages/admin/ProductListPage.jsx';
import ProductEditPage from './pages/admin/ProductEditPage.jsx';
import OrderListPage from './pages/admin/OrderListPage.jsx';
import UserListPage from './pages/admin/UserListPage.jsx';

// Layout wrapper for public pages (with Navbar + Footer)
const ShopLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen bg-gray-100">{children}</main>
    <Footer />
  </>
);

// Layout wrapper for admin pages (with AdminSidebar, no Navbar/Footer)
const AdminLayout = ({ children }) => (
  <AdminRoute>
    <AdminSidebar>{children}</AdminSidebar>
  </AdminRoute>
);

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public / Customer routes */}
          <Route path="/" element={<ShopLayout><HomePage /></ShopLayout>} />
          <Route path="/product/:id" element={<ShopLayout><ProductPage /></ShopLayout>} />
          <Route path="/cart" element={<ShopLayout><CartPage /></ShopLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={
            <PrivateRoute><ShopLayout><CheckoutPage /></ShopLayout></PrivateRoute>
          } />
          <Route path="/order/:id" element={
            <PrivateRoute><ShopLayout><OrderPage /></ShopLayout></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><ShopLayout><ProfilePage /></ShopLayout></PrivateRoute>
          } />
          <Route path="/payment" element={
            <PrivateRoute><ShopLayout><MockPaymentPage /></ShopLayout></PrivateRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminLayout><DashboardPage /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><ProductListPage /></AdminLayout>} />
          <Route path="/admin/products/create" element={<AdminLayout><ProductEditPage /></AdminLayout>} />
          <Route path="/admin/products/:id/edit" element={<AdminLayout><ProductEditPage /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><OrderListPage /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UserListPage /></AdminLayout>} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;