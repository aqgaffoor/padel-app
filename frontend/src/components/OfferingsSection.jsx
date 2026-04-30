import React from 'react';
import { Shield, Users, ShoppingBag } from 'lucide-react';
import styles from './OfferingsSection.module.css';

const offerings = [
  {
    icon: Shield,
    title: 'Panoramic Courts',
    description:
      'Four regulation-size glass courts with professional lighting. Book by the hour, day or week — solo drilling to full matches.',
    tag: 'Book via Playtomic',
  },
  {
    icon: Users,
    title: 'Expert Coaching',
    description:
      'Whether you\'re picking up a racket for the first time or refining your technique for competitive play, our coaches meet you where you are.',
    tag: 'All skill levels',
  },
  {
    icon: ShoppingBag,
    title: 'Pro Shop',
    description:
      'Curated selection of rackets, balls, grip tape and footwear from the sport\'s leading brands. Test before you buy, always in stock.',
    tag: 'Shop online',
  },
];

const OfferingsSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>What We Offer</p>
          <h2 className={styles.heading}>Everything You Need<br />to <span className={styles.accent}>Play & Improve.</span></h2>
        </div>

        <div className={styles.grid}>
          {offerings.map(({ icon: Icon, title, description, tag }) => (
            <div key={title} className={styles.card}>
              <div className={styles.iconWrap}>
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <span className={styles.tag}>{tag}</span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;
