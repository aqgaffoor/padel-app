import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';
import { supabase } from '../lib/supabase';
import { SlidersHorizontal } from 'lucide-react';

const basePath = import.meta.env.BASE_URL;

const mockProducts = [
  {
    id: 1,
    name: 'Wilson Carbon Force Pro',
    description: 'Perfect for control-oriented players. Soft EVA core delivers precision touch and consistent ball response.',
    price: 3499.00,
    badge: 'Bestseller',
    category: 'Control',
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
    description: 'Engineered for the explosive attacker. High power diamond shape delivers elite smash performance.',
    price: 4200.00,
    badge: 'Power',
    category: 'Power',
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
  },
  {
    id: 3,
    name: 'Head Alpha Motion',
    description: 'The all-round racket for versatile players. Premium balance between power, control and maneuverability.',
    price: 3850.00,
    badge: 'New',
    category: 'All-Round',
    imageUrl: `${basePath}images/wilson-1.jpg`,
    images: [
      `${basePath}images/wilson-1.jpg`,
      `${basePath}images/wilson-2.jpg`,
      `${basePath}images/wilson-3.jpg`,
    ],
    specs: {
      brand: 'Head',
      series: '2026 Alpha',
      shape: 'Round',
      weight: '360 Grams',
      balance: '265 mm',
      core: 'Soft HR3',
      face: 'Fiberglass'
    }
  },
  {
    id: 4,
    name: 'Nox Nerbo WPT',
    description: 'Official racket of the World Padel Tour. Used by pros worldwide for its explosive power and elite construction.',
    price: 5200.00,
    badge: 'Pro',
    category: 'Power',
    imageUrl: `${basePath}images/babolat-1.jpg`,
    images: [
      `${basePath}images/babolat-1.jpg`,
      `${basePath}images/babolat-2.jpg`,
      `${basePath}images/babolat-3.jpg`,
    ],
    specs: {
      brand: 'Nox',
      series: '2026 WPT Elite',
      shape: 'Diamond',
      weight: '370 Grams',
      balance: '272 mm',
      core: 'Black EVA Premium',
      face: '18K Carbon'
    }
  },
];

const CATEGORIES = ['All', 'Control', 'Power', 'All-Round'];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

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
        const fixedData = data.map(item => {
          let newImageUrl = item.imageUrl;
          if (newImageUrl && newImageUrl.startsWith('/images/')) {
            newImageUrl = basePath + newImageUrl.substring(1);
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

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Pro Equipment</p>
        <h1 className={styles.title}>Racket Shop</h1>
        <p className={styles.subtitle}>
          Elite padel rackets from the world's leading brands. Click any racket for full specs and details.
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <SlidersHorizontal size={16} className={styles.filterIcon} />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingGrid}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No rackets in this category yet.</p>
          <button className={styles.resetBtn} onClick={() => setActiveCategory('All')}>View All</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
