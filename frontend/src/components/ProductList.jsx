import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';

const mockProducts = [
  {
    id: 1,
    name: 'Wilson Carbon Force',
    description: 'Perfect for control-oriented players looking for a soft feel.',
    price: 3499.00,
    imageUrl: '/images/wilson-1.jpg',
    images: [
      '/images/wilson-1.jpg',
      '/images/wilson-2.jpg',
      '/images/wilson-3.jpg',
      '/images/wilson-4.jpg',
      '/images/wilson-5.jpg'
    ],
    specs: {
      brand: 'Wilson',
      series: '2026 Pro Elite',
      shape: 'Tear Drop',
      weight: '355 Grams',
      balance: '260 mm',
      core: 'Soft EVA Foam',
      face: 'Carbon Fiber'
    }
  },
  {
    id: 2,
    name: 'Babolat Technical Viper',
    description: 'Designed for the explosive attacker. High power for aggressive smashes.',
    price: 4200.00,
    imageUrl: '/images/babolat-1.jpg',
    images: [
      '/images/babolat-1.jpg',
      '/images/babolat-2.jpg',
      '/images/babolat-3.jpg',
      '/images/babolat-4.jpg',
      '/images/babolat-5.jpg'
    ],
    specs: {
      brand: 'Babolat',
      series: '2026 Technical',
      shape: 'Diamond',
      weight: '365 Grams',
      balance: '270 mm',
      core: 'Black EVA',
      face: '12K Carbon'
    }
  }
];

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Attempt to fetch from API, fallback to mock data if API is not running or empty
    fetch('https://localhost:7124/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(mockProducts);
        }
      })
      .catch(() => {
        setProducts(mockProducts);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>PRO RACKET SHOP</h1>
        <p className={styles.subtitle}>Click on a racket to view full details and technical specifications.</p>
      </div>
      <div className={styles.grid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
