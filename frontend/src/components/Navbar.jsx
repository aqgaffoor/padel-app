import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, User, ShoppingBag, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { getItemCount } = useCart();
  const { isLoggedIn, profile, user, signOut } = useAuth();
  const cartCount = getItemCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close mobile menu on nav */
  useEffect(() => { setMenuOpen(false); }, [window.location.hash]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'Account';

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>PADEL.</Link>

      {/* ── Desktop nav ── */}
      <div className={styles.navLinks}>
        <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
        <NavLink to="/tournaments" className={({ isActive }) => isActive ? styles.active : ''}>Tournaments</NavLink>
        <NavLink to="/shop"        className={({ isActive }) => isActive ? styles.active : ''}>Shop</NavLink>
        <NavLink to="/wishlist"    className={({ isActive }) => isActive ? styles.active : ''}>Wishlist</NavLink>
        <NavLink to="/cart"        className={({ isActive }) => `${styles.cartLink} ${isActive ? styles.active : ''}`}>
          Cart ({cartCount})
        </NavLink>

        {/* Account area */}
        {isLoggedIn ? (
          <div className={styles.accountWrap} ref={dropdownRef}>
            <button className={styles.accountBtn} onClick={() => setDropdownOpen(o => !o)}>
              <div className={styles.accountAvatar}>
                {(profile?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
              </div>
              <span className={styles.accountName}>{displayName}</span>
              <ChevronDown size={14} className={dropdownOpen ? styles.chevronOpen : ''} />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <Link to="/account" className={styles.dropItem} onClick={() => setDropdownOpen(false)}>
                  <User size={15} /> My Account
                </Link>
                <Link to="/account" className={styles.dropItem} onClick={() => { setDropdownOpen(false); }}>
                  <ShoppingBag size={15} /> Orders
                </Link>
                <div className={styles.dropDivider} />
                <button className={`${styles.dropItem} ${styles.dropLogout}`} onClick={handleSignOut}>
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.loginLink}>Log In</Link>
        )}
      </div>

      {/* ── Hamburger ── */}
      <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ── Mobile drawer ── */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <NavLink to="/" end         className={({ isActive }) => isActive ? styles.mobileActive : styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/tournaments"  className={({ isActive }) => isActive ? styles.mobileActive : styles.mobileLink} onClick={() => setMenuOpen(false)}>Tournaments</NavLink>
        <NavLink to="/shop"         className={({ isActive }) => isActive ? styles.mobileActive : styles.mobileLink} onClick={() => setMenuOpen(false)}>Shop</NavLink>
        <NavLink to="/wishlist"     className={({ isActive }) => isActive ? styles.mobileActive : styles.mobileLink} onClick={() => setMenuOpen(false)}>Wishlist</NavLink>
        <NavLink to="/cart"         className={({ isActive }) => isActive ? styles.mobileActive : styles.mobileLink} onClick={() => setMenuOpen(false)}>Cart ({cartCount})</NavLink>

        <div className={styles.mobileDivider} />

        {isLoggedIn ? (
          <>
            <NavLink to="/account" className={({ isActive }) => isActive ? styles.mobileActive : styles.mobileLink} onClick={() => setMenuOpen(false)}>My Account</NavLink>
            <button className={`${styles.mobileLink} ${styles.mobileLogout}`} onClick={() => { setMenuOpen(false); handleSignOut(); }}>Sign Out</button>
          </>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? styles.mobileActive : styles.mobileLink} onClick={() => setMenuOpen(false)}>Log In</NavLink>
        )}
      </div>

      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;
