import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart } from 'lucide-react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart();

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleCardClick = () => {
    navigate(`/shop/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className={styles.imageContainer}>
        <img src={product.imageUrl} alt={product.name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>
          {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(product.price)}
        </p>
        <div className={styles.actions}>
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>Add to Cart</button>
          <button 
            className={styles.wishlistBtn} 
            onClick={handleAddToWishlist}
            style={isWishlisted ? { borderColor: '#ff4444', color: '#ff4444' } : {}}
          >
            <Heart size={16} fill={isWishlisted ? "#ff4444" : "none"} color={isWishlisted ? "#ff4444" : "currentColor"} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            {isWishlisted ? 'Wishlisted' : 'Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
