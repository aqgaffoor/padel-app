import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './CartPage.module.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, getCartTotal } = useCart();

  const total = getCartTotal();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>ORDER SUMMARY</h1>
      
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
                <p className={styles.itemPrice}>R{item.price.toLocaleString()} <span className={styles.eachText}>each</span></p>
              </div>
              
              <div className={styles.itemActions}>
                <div className={styles.quantityControl}>
                  <button onClick={() => updateQuantity(item.id, -1)} className={styles.qtyBtn}>-</button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className={styles.qtyBtn}>+</button>
                </div>
                <div className={styles.itemTotal}>
                  R {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          
          {cartItems.length === 0 && (
            <div className={styles.emptyCart}>
              <p>Your cart is empty.</p>
              <button className="btn-secondary" onClick={() => navigate('/shop')} style={{marginTop: '1rem'}}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
        
        {/* Right Column: Summary */}
        {cartItems.length > 0 && (
          <div className={styles.summarySection}>
            <h2 className={styles.summaryTitle}>Cart Totals</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>R {total.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at next step</span>
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
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
