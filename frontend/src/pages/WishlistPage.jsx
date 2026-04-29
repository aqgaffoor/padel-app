import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart } from 'lucide-react';
import styles from './WishlistPage.module.css';

const WishlistPage = () => {
  const { wishlistItems, moveToCart, removeFromWishlist } = useCart();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>MY WISHLIST</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={styles.emptyState}>
          Your wishlist is empty. Explore our shop to add items!
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
                  <Trash2 size={18} />
                </button>
              </div>
              <div className={styles.content}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>
                  R{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className={styles.actions}>
                  <button 
                    className={styles.moveBtn}
                    onClick={() => moveToCart(item)}
                  >
                    <ShoppingCart size={18} />
                    Move to Cart
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
