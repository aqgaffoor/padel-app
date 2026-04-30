import React from 'react';
import styles from './AboutSection.module.css';

const stats = [
  { value: '4', label: 'World-Class Courts' },
  { value: '200+', label: 'Active Members' },
  { value: '#1', label: 'Padel Club in Durban' },
];

const AboutSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.storyCol}>
          <p className={styles.eyebrow}>Who We Are</p>
          <h2 className={styles.heading}>
            Durban's Home<br />
            of <span className={styles.accent}>Padel.</span>
          </h2>
          <p className={styles.body}>
            We're more than a padel club — we're a community built around the fastest-growing
            racket sport in the world. From your very first rally to competitive tournament
            play, we're here to grow your game in an environment that's welcoming,
            high-energy, and world-class.
          </p>
          <p className={styles.body}>
            Based in Musgrave, Durban, our facility brings together panoramic courts, 
            expert coaching, and a pro shop stocked with elite equipment — everything 
            you need under one roof.
          </p>
        </div>

        <div className={styles.statsCol}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
