import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import styles from './ShippingPage.module.css';

const ShippingPage = () => {
  const navigate = useNavigate();
  const [shippingMethod, setShippingMethod] = useState('collection');

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <Link to="/cart" className={styles.backLink}>← Back to Summary</Link>
          <h1 className={styles.pageTitle}>SHIPPING DETAILS</h1>
        </div>

        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabBtn} ${shippingMethod === 'delivery' ? styles.activeTab : ''}`}
            onClick={() => setShippingMethod('delivery')}
          >
            Delivery
          </button>
          <button 
            className={`${styles.tabBtn} ${shippingMethod === 'collection' ? styles.activeTab : ''}`}
            onClick={() => setShippingMethod('collection')}
          >
            Collection
          </button>
        </div>

        <div className={styles.tabContent}>
          {shippingMethod === 'collection' ? (
            <div className={styles.collectionInfo}>
              <div className={styles.locationHeader}>
                <MapPin className={styles.pinIcon} size={20} />
                <span className={styles.locationTitle}>Collection Point:</span>
              </div>
              <p className={styles.locationAddress}>
                59 Seaforth Avenue, Musgrave<br/>
                Durban, South Africa
              </p>
              <p className={styles.locationHours}>
                Mon-Fri: 08:00 - 18:00<br/>
                Sat-Sun: 08:00 - 13:00
              </p>
            </div>
          ) : (
            <div className={styles.deliveryInfo}>
              <p>Delivery options will be calculated at checkout.</p>
              {/* Form fields could go here */}
            </div>
          )}
        </div>

        <button 
          className={`btn-primary ${styles.continueBtn}`} 
          onClick={() => navigate('/payment')}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default ShippingPage;
