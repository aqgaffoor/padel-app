import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>PADEL.</Link>
      <div className={styles.navLinks}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
        <NavLink to="/tournaments" className={({ isActive }) => isActive ? styles.active : ''}>Tournaments</NavLink>
        <NavLink to="/shop" className={({ isActive }) => isActive ? styles.active : ''}>Shop</NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => isActive ? styles.active : ''}>Wishlist</NavLink>
        <NavLink to="/cart" className={`${styles.cartLink} ${window.location.pathname.includes('/cart') || window.location.pathname.includes('/shipping') || window.location.pathname.includes('/payment') ? styles.active : ''}`}>
          Cart ({cartCount})
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
