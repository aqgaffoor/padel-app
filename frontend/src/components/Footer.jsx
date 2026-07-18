import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import styles from './Footer.module.css';

/* Social icons as inline SVGs (lucide-react version doesn't export these) */
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top row */}
        <div className={styles.topGrid}>
          {/* Brand column */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>PADEL.</Link>
            <p className={styles.brandDesc}>
              Durban's home of padel. World-class courts, expert coaching, and a community built around the fastest-growing racket sport in South Africa.
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram">
                <IconInstagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Facebook">
                <IconFacebook />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="YouTube">
                <IconYoutube />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className={styles.navCol}>
            <h3 className={styles.colTitle}>Explore</h3>
            <nav className={styles.navList}>
              <Link to="/" className={styles.navLink}>Home</Link>
              <Link to="/tournaments" className={styles.navLink}>Tournaments</Link>
              <Link to="/shop" className={styles.navLink}>Shop</Link>
              <Link to="/wishlist" className={styles.navLink}>Wishlist</Link>
              <Link to="/cart" className={styles.navLink}>Cart</Link>
            </nav>
          </div>

          <div className={styles.navCol}>
            <h3 className={styles.colTitle}>Account</h3>
            <nav className={styles.navList}>
              <Link to="/login" className={styles.navLink}>Sign In</Link>
              <Link to="/login" className={styles.navLink}>Create Account</Link>
              <Link to="/account" className={styles.navLink}>My Account</Link>
              <Link to="/cart" className={styles.navLink}>My Cart</Link>
            </nav>
          </div>

          <div className={styles.navCol}>
            <h3 className={styles.colTitle}>Contact</h3>
            <div className={styles.contactList}>
              <a
                href="https://maps.google.com/?q=59+Seaforth+Avenue,+Musgrave,+Durban"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <MapPin size={14} className={styles.contactIcon} />
                59 Seaforth Ave, Musgrave, Durban
              </a>
              <div className={styles.contactItem}>
                <Clock size={14} className={styles.contactIcon} />
                Mon–Sun: 06:00 – 22:00
              </div>
              <a href="tel:+27310000000" className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                +27 31 000 0000
              </a>
              <a href="mailto:info@padelzone.co.za" className={styles.contactItem}>
                <Mail size={14} className={styles.contactIcon} />
                info@padelzone.co.za
              </a>
            </div>
          </div>
        </div>

        {/* Book CTA strip */}
        <div className={styles.ctaStrip}>
          <div className={styles.ctaText}>
            <span>Ready to play?</span>
            <strong>Book a court online via Playtomic</strong>
          </div>
          <a
            href="https://playtomic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            Book Now →
          </a>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} Padel Zone Durban. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>Privacy Policy</a>
            <span className={styles.dot}>·</span>
            <a href="#" className={styles.legalLink}>Terms of Use</a>
            <span className={styles.dot}>·</span>
            <a href="#" className={styles.legalLink}>Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
