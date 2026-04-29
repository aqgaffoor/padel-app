import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart } from 'lucide-react';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart();
  const product = location.state?.product;

  const [activeImage, setActiveImage] = useState(product?.images?.[0] || product?.imageUrl);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!product) {
    return (
      <div className={styles.pageContainer}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  // Generate thumbnails (use provided images array or fallback to main image)
  const thumbnails = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleAddToWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.productWrapper}>
        
        {/* Left Gallery */}
        <div className={styles.gallery}>
          <div className={styles.thumbnails}>
            {thumbnails.map((thumb, index) => (
              <button 
                key={index} 
                className={`${styles.thumbnailBtn} ${activeImage === thumb ? styles.active : ''}`}
                onClick={() => setActiveImage(thumb)}
              >
                <img src={thumb} alt={`Thumbnail ${index + 1}`} className={styles.thumbnailImg} />
              </button>
            ))}
          </div>
          
          <div 
            className={styles.mainImageContainer} 
            onClick={() => setIsZoomed(!isZoomed)}
            style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ''}`} 
              title="Click to zoom in/out" 
            />
          </div>
        </div>

        {/* Right Details */}
        <div className={styles.details}>
          <div className={styles.deliveryBadge}>✓ Eligible for FREE Delivery</div>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.subtitle}>
            Brand: {product.specs?.brand || 'Unknown'} | Series: {product.specs?.series || 'Standard'}
          </div>
          <div className={styles.price}>
            {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(product.price)}
          </div>

          <div className={styles.specsSection}>
            <h3 className={styles.specsTitle}>At a Glance</h3>
            <p className={styles.description}>{product.description}</p>
            {product.specs && (
              <div className={styles.specsGrid}>
                <span className={styles.specLabel}>Shape</span>
                <span className={styles.specValue}>{product.specs.shape}</span>
                
                <span className={styles.specLabel}>Weight</span>
                <span className={styles.specValue}>{product.specs.weight}</span>
                
                <span className={styles.specLabel}>Balance</span>
                <span className={styles.specValue}>{product.specs.balance}</span>
                
                <span className={styles.specLabel}>Core</span>
                <span className={styles.specValue}>{product.specs.core}</span>
                
                <span className={styles.specLabel}>Face</span>
                <span className={styles.specValue}>{product.specs.face}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button 
              className={styles.wishlistBtn} 
              onClick={handleAddToWishlist}
              style={isWishlisted ? { borderColor: '#ff4444', color: '#ff4444' } : {}}
            >
              <Heart size={20} fill={isWishlisted ? "#ff4444" : "none"} color={isWishlisted ? "#ff4444" : "currentColor"} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
              {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
