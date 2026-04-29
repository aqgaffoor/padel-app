import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target date: April 26, 2027
    const targetDate = new Date('2027-04-26T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.heroSection}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.headline}>
          THE HEART OF <br/> <span className={styles.highlight}>PADEL</span> IN <br/> DURBAN.
        </h1>
        <p className={styles.subtext}>
          Experience the fastest-growing sport in South Africa. We offer world-class panoramic courts, expert coaching, and a vibrant community of players.
        </p>
        
        <div className={styles.timerContainer}>
          <div className={styles.timeBox}>
            <span className={styles.timeValue}>{timeLeft.days}</span>
            <span className={styles.timeLabel}>DAYS</span>
          </div>
          <div className={styles.timeBox}>
            <span className={styles.timeValue}>{timeLeft.hours}</span>
            <span className={styles.timeLabel}>HOURS</span>
          </div>
          <div className={styles.timeBox}>
            <span className={styles.timeValue}>{timeLeft.minutes}</span>
            <span className={styles.timeLabel}>MINS</span>
          </div>
          <div className={styles.timeBox}>
            <span className={styles.timeValue}>{timeLeft.seconds}</span>
            <span className={styles.timeLabel}>SECS</span>
          </div>
        </div>

        <button className={`btn-primary ${styles.ctaBtn}`} onClick={() => navigate('/tournaments')}>
          Join an Event
        </button>
      </div>
    </div>
  );
};

export default Hero;
