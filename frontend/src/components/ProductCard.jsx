import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart } from 'lucide-react';
import styles from './ProductCard.module.css';

const BADGE_COLORS = {
  'Bestseller': { bg: '#caff0018', color: '#caff00', border: '#caff0040' },
  'New':        { bg: '#06b6d418', color: '#06b6d4', border: '#06b6d440' },
  'Power':      { bg: '#7c3aed18', color: '#a78bfa', border: '#7c3aed40' },
  'Pro':        { bg: '#f59e0b18', color: '#f59e0b', border: '#f59e0b40' },
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart();

  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const badgeStyle = product.badge ? BADGE_COLORS[product.badge] : null;

  const handleCardClick = () => {
    navigate(`/shop/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {/* Badge */}
      {product.badge && badgeStyle && (
        <span
          className={styles.badge}
          style={{ background: badgeStyle.bg, color: badgeStyle.color, borderColor: badgeStyle.border }}
        >
          {product.badge}
        </span>
      )}

      {/* Wishlist heart */}
      <button
        className={`${styles.heartBtn} ${isWishlisted ? styles.heartActive : ''}`}
        onClick={handleToggleWishlist}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <div className={styles.imageContainer}>
        <img src={product.imageUrl} alt={product.name} className={styles.image} />
        <div className={styles.imageOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.info}>
          {product.specs?.brand && (
            <span className={styles.brand}>{product.specs.brand}</span>
          )}
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
        </div>

        <div className={styles.footer}>
          <p className={styles.price}>
            {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(product.price)}
          </p>
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
