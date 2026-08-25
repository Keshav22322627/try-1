// India Hyundai Power - Master Application Router

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

import Header from './components/Header.jsx';
import CartDrawer from './components/CartDrawer.jsx';

import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

import DashboardLayout from './layouts/DashboardLayout.jsx';
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import SalesHeadDashboard from './pages/dashboard/SalesHeadDashboard.jsx';
import SalesPersonDashboard from './pages/dashboard/SalesPersonDashboard.jsx';
import DealerDashboard from './pages/dashboard/DealerDashboard.jsx';

import UsersManagement from './pages/management/UsersManagement.jsx';
import AreasManagement from './pages/management/AreasManagement.jsx';
import ProductsManagement from './pages/management/ProductsManagement.jsx';
import OrdersManagement from './pages/management/OrdersManagement.jsx';
import PaymentsManagement from './pages/management/PaymentsManagement.jsx';
import DeliveryManagement from './pages/management/DeliveryManagement.jsx';
import ComplaintsManagement from './pages/management/ComplaintsManagement.jsx';
import ReportsPage from './pages/management/ReportsPage.jsx';
import SettingsPage from './pages/management/SettingsPage.jsx';

// Role-Based Router Component
function RoleDashboardView() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;

  switch (currentUser.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'SALES_HEAD':
      return <SalesHeadDashboard />;
    case 'SALES_PERSON':
      return <SalesPersonDashboard />;
    case 'DEALER':
      return <DealerDashboard />;
    default:
      return <AdminDashboard />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public E-Commerce Layout */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <HomePage />
                  <CartDrawer />
                </>
              }
            />
            <Route
              path="/shop"
              element={
                <>
                  <Header />
                  <ShopPage />
                  <CartDrawer />
                </>
              }
            />
            <Route
              path="/product/:slug"
              element={
                <>
                  <Header />
                  <ProductDetailPage />
                  <CartDrawer />
                </>
              }
            />
            <Route
              path="/order-tracking"
              element={
                <>
                  <Header />
                  <OrderTrackingPage />
                  <CartDrawer />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Header />
                  <AboutPage />
                  <CartDrawer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Header />
                  <ContactPage />
                  <CartDrawer />
                </>
              }
            />
            <Route path="/login" element={<LoginPage />} />

            {/* Role-Based Management Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<RoleDashboardView />} />
              <Route path="complaints" element={<ComplaintsManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="payments" element={<PaymentsManagement />} />
              <Route path="deliveries" element={<DeliveryManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="areas" element={<AreasManagement />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
