import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';
import { supabase } from '../lib/supabase';

const basePath = import.meta.env.BASE_URL;

const mockProducts = [
  {
    id: 1,
    name: 'Wilson Carbon Force',
    description: 'Perfect for control-oriented players looking for a soft feel.',
    price: 3499.00,
    imageUrl: `${basePath}images/wilson-1.jpg`,
    images: [
      `${basePath}images/wilson-1.jpg`,
      `${basePath}images/wilson-2.jpg`,
      `${basePath}images/wilson-3.jpg`,
      `${basePath}images/wilson-4.jpg`,
      `${basePath}images/wilson-5.jpg`
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
    imageUrl: `${basePath}images/babolat-1.jpg`,
    images: [
      `${basePath}images/babolat-1.jpg`,
      `${basePath}images/babolat-2.jpg`,
      `${basePath}images/babolat-3.jpg`,
      `${basePath}images/babolat-4.jpg`,
      `${basePath}images/babolat-5.jpg`
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFromSupabase();
  }, []);

  const fetchFromSupabase = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Fix any relative image paths to use the correct basePath
        const fixedData = data.map(item => {
          let newImageUrl = item.imageUrl;
          if (newImageUrl && newImageUrl.startsWith('/images/')) {
            newImageUrl = basePath + newImageUrl.substring(1);
          } else if (newImageUrl && newImageUrl.startsWith('/padel-app/images/')) {
            // Already correct - keep as is
          }
          return { ...item, imageUrl: newImageUrl };
        });
        setProducts(fixedData);
      } else {
        setProducts(mockProducts);
      }
    } catch (err) {
      console.error('Supabase fetch failed, falling back to mock data:', err);
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>PRO RACKET SHOP</h1>
        <p className={styles.subtitle}>Click on a racket to view full details and technical specifications.</p>
      </div>
      {isLoading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
