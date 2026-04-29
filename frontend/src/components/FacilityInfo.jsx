import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import styles from './FacilityInfo.module.css';

const FacilityInfo = () => {
  return (
    <div className={styles.facilitySection}>
      <div className={styles.container}>
        <div className={styles.infoContent}>
          <h2 className={styles.title}>Visit Our Facility</h2>
          <p className={styles.description}>
            Our premium courts are located in the heart of Durban. We feature panoramic courts, a pro shop, and a coffee lounge.
          </p>
          
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <MapPin className={styles.icon} size={20} />
              <div>
                <h3 className={styles.detailTitle}>Address</h3>
                <p className={styles.detailText}>59 Seaforth Avenue, Musgrave, Durban, South Africa</p>
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <Clock className={styles.icon} size={20} />
              <div>
                <h3 className={styles.detailTitle}>Open Hours</h3>
                <p className={styles.detailText}>06:00 - 22:00 Daily</p>
              </div>
            </div>
          </div>
          
          <button 
            className={`btn-secondary ${styles.bookBtn}`}
            onClick={() => window.open('https://playtomic.com/', '_blank')}
          >
            Book a Court
          </button>
        </div>
        
        <div className={styles.mapContainer}>
          <iframe 
            src="https://maps.google.com/maps?q=59%20Seaforth%20Avenue,%20Musgrave,%20Durban&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Facility Location Map"
            className={styles.mapIframe}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default FacilityInfo;
