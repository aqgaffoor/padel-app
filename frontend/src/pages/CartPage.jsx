import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import styles from './CartPage.module.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const total = getCartTotal();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Your Cart</h1>
        <p className={styles.pageSubtitle}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>
            <ShoppingCart size={48} />
          </div>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>Add some rackets or gear from our pro shop to get started.</p>
          <button className={`btn-primary ${styles.shopBtn}`} onClick={() => navigate('/shop')}>
            <ShoppingBag size={18} />
            Browse the Shop
          </button>
        </div>
      ) : (
        <div className={styles.cartGrid}>
          {/* Left Column: Items */}
          <div className={styles.itemsList}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImageContainer}>
                  <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>
                    R{item.price.toLocaleString()} <span className={styles.eachText}>each</span>
                  </p>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className={styles.qtyBtn}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className={styles.qtyBtn}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    R {(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    title="Remove from cart"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Summary */}
          <div className={styles.summarySection}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal ({cartItems.reduce((c, i) => c + i.quantity, 0)} items)</span>
              <span>R {total.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.shippingNote}>Calculated next step</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax (VAT 15%)</span>
              <span>Included</span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>R {total.toLocaleString()}</span>
            </div>

            <button
              className={`btn-primary ${styles.continueBtn}`}
              onClick={() => navigate('/shipping')}
            >
              Checkout Securely
              <ArrowRight size={18} />
            </button>

            <button
              className={styles.continueShoppingBtn}
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </button>

            <div className={styles.secureBadge}>
              🔒 Secure checkout — SSL encrypted
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
