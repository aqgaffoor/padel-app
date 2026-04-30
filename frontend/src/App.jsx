import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './components/ProductList';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import TournamentsPage from './pages/TournamentsPage';
import WishlistPage from './pages/WishlistPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPortal from './pages/AdminPortal';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import { AuthProvider } from './context/AuthContext';
import styles from './App.module.css';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className={styles.appContainer}>
        {!isAdmin && <Navbar />}
        <main className={!isAdmin ? styles.mainContent : ''}>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/shop"          element={<ProductList />} />
            <Route path="/shop/:id"      element={<ProductDetailPage />} />
            <Route path="/tournaments"   element={<TournamentsPage />} />
            <Route path="/wishlist"      element={<WishlistPage />} />
            <Route path="/cart"          element={<CartPage />} />
            <Route path="/shipping"      element={<ShippingPage />} />
            <Route path="/payment"       element={<PaymentPage />} />
            <Route path="/admin"         element={<AdminPortal />} />
            <Route path="/login"         element={<AuthPage />} />
            <Route path="/account"       element={<AccountPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
