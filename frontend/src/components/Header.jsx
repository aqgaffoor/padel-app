import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>PRO RACKET SHOP</h1>
      <p className={styles.subtitle}>
        Click on a racket to view full details and technical specifications.
      </p>
    </header>
  );
};

export default Header;
