import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Lock } from 'lucide-react';
import styles from './PaymentPage.module.css';

const PaymentPage = () => {
  const { getCartTotal, cartItems } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});

  const total = getCartTotal();

  const validateForm = () => {
    const newErrors = {};
    if (!cardDetails.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) newErrors.number = 'Invalid card number';
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) newErrors.expiry = 'Use MM/YY format';
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) newErrors.cvv = 'Invalid CVV';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsProcessing(true);
    // Simulate secure Paygate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Auto-format card number
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Auto-format expiry
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }

    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.pageTitle}>PAYMENT SUCCESSFUL</h1>
          <p className={styles.successMessage}>
            Thank you for your order! Your padel gear will be processed and shipped shortly.
          </p>
          <Link to="/" className={`btn-primary ${styles.homeBtn}`}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <Link to="/shipping" className={styles.backLink}>← Back to Shipping</Link>
          <h1 className={styles.pageTitle}>SECURE CHECKOUT</h1>
          <div className={styles.secureBadge}>
            <Lock size={16} />
            256-bit Encrypted Paygate
          </div>
        </div>

        <form onSubmit={handlePayment} className={styles.paymentSection}>
          <div className={styles.formGroup}>
            <label>Name on Card</label>
            <input 
              type="text" 
              name="name"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={handleInputChange}
              className={`${styles.inputField} ${errors.name ? styles.error : ''}`}
              maxLength={50}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Card Number</label>
            <input 
              type="text" 
              name="number"
              placeholder="0000 0000 0000 0000"
              value={cardDetails.number}
              onChange={handleInputChange}
              className={`${styles.inputField} ${errors.number ? styles.error : ''}`}
              maxLength={19}
            />
            {errors.number && <span className={styles.errorText}>{errors.number}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label>Expiry (MM/YY)</label>
              <input 
                type="text" 
                name="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleInputChange}
                className={`${styles.inputField} ${errors.expiry ? styles.error : ''}`}
                maxLength={5}
              />
              {errors.expiry && <span className={styles.errorText}>{errors.expiry}</span>}
            </div>
            
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label>CVV</label>
              <input 
                type="text" 
                name="cvv"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                className={`${styles.inputField} ${errors.cvv ? styles.error : ''}`}
                maxLength={4}
              />
              {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
            </div>
          </div>

          <div className={styles.amountBox}>
            <p className={styles.amountLabel}>Final Amount Due:</p>
            <p className={styles.amountValue}>R {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <button 
            type="submit"
            className={`btn-primary ${styles.confirmBtn}`} 
            disabled={isProcessing || cartItems.length === 0}
          >
            {isProcessing ? (
              <span><Lock size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }}/> Processing...</span>
            ) : (
              <span><Lock size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }}/> Pay Securely</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
