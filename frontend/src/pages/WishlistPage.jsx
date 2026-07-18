import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import styles from './WishlistPage.module.css';

const WishlistPage = () => {
  const { wishlistItems, moveToCart, removeFromWishlist } = useCart();
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>My Wishlist</h1>
        <p className={styles.subtitle}>
          {wishlistItems.length > 0
            ? `${wishlistItems.length} saved ${wishlistItems.length === 1 ? 'item' : 'items'}`
            : 'Items you love, saved for later'}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Heart size={52} />
          </div>
          <h2 className={styles.emptyTitle}>Nothing saved yet</h2>
          <p className={styles.emptyText}>
            Browse our shop and hit the heart icon on any racket to save it here.
          </p>
          <button className={`btn-primary ${styles.shopBtn}`} onClick={() => navigate('/shop')}>
            <ShoppingCart size={18} />
            Explore the Shop
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {wishlistItems.map((item) => (
            <div key={item.id} className={styles.wishlistCard}>
              <div className={styles.imageContainer}>
                <img src={item.images?.[0] || item.imageUrl} alt={item.name} className={styles.itemImage} />
                <button
                  className={styles.removeIconBtn}
                  onClick={() => removeFromWishlist(item.id)}
                  title="Remove from Wishlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className={styles.content}>
                {item.specs?.brand && <span className={styles.brand}>{item.specs.brand}</span>}
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>
                  {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(item.price)}
                </p>
                <div className={styles.actions}>
                  <button
                    className={styles.moveBtn}
                    onClick={() => moveToCart(item)}
                  >
                    <ShoppingCart size={15} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
