import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Customer Pages (23 Pages)
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';
import ProductDetail from './pages/customer/ProductDetail';
import CategoryProducts from './pages/customer/CategoryProducts';
import SearchResults from './pages/customer/SearchResults';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import ForgotPassword from './pages/customer/ForgotPassword';
import ResetPassword from './pages/customer/ResetPassword';
import MyAccount from './pages/customer/MyAccount';
import EditProfile from './pages/customer/EditProfile';
import Wishlist from './pages/customer/Wishlist';
import CartPage from './pages/customer/CartPage';
import Checkout from './pages/customer/Checkout';
import PaymentResult from './pages/customer/PaymentResult';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import MyOrders from './pages/customer/MyOrders';
import OrderDetail from './pages/customer/OrderDetail';
import ContactUs from './pages/customer/ContactUs';
import AboutUs from './pages/customer/AboutUs';
import PrivacyPolicy from './pages/customer/PrivacyPolicy';
import TermsConditions from './pages/customer/TermsConditions';
import ShippingReturns from './pages/customer/ShippingReturns';

// Admin Pages (13 Pages)
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCustomerDetail from './pages/admin/AdminCustomerDetail';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminInventory from './pages/admin/AdminInventory';

// Route Guards
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/category/:categorySlug" element={<CategoryProducts />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/result" element={<PaymentResult />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
        
        {/* Protected Customer Routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        {/* Informational Pages */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
      </Route>

      {/* Admin Standalone Login */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin Panel (Role Protected) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminAddProduct />} />
        <Route path="products/edit/:id" element={<AdminEditProduct />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="customers/:id" element={<AdminCustomerDetail />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="inventory" element={<AdminInventory />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
