import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  /* ── Toast ── */
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* ─────────── SUPABASE SYNC ─────────── */

  /* Load full product data for a list of cart/wishlist rows */
  const hydrateProducts = async (rows, productIdField = 'product_id') => {
    if (!rows || rows.length === 0) return [];
    const ids = rows.map(r => r[productIdField]);
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('id', ids);
    if (!products) return [];
    return rows.map(row => {
      const p = products.find(p => p.id === row[productIdField]);
      return p ? { ...p, quantity: row.quantity ?? 1 } : null;
    }).filter(Boolean);
  };

  /* Load cart + wishlist from Supabase */
  const loadFromDB = useCallback(async (userId) => {
    const [{ data: cartRows }, { data: wishRows }] = await Promise.all([
      supabase.from('carts').select('product_id, quantity').eq('user_id', userId),
      supabase.from('wishlists').select('product_id').eq('user_id', userId),
    ]);

    const [hydratedCart, hydratedWish] = await Promise.all([
      hydrateProducts(cartRows || []),
      hydrateProducts(wishRows || []),
    ]);

    setCartItems(hydratedCart);
    setWishlistItems(hydratedWish);
  }, []);

  /* Clear local state on sign out */
  const clearLocal = useCallback(() => {
    setCartItems([]);
    setWishlistItems([]);
  }, []);

  /* Watch auth state — load/clear data when user changes */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setCurrentUserId(uid);
      if (uid) loadFromDB(uid);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setCurrentUserId(uid);
      if (uid) loadFromDB(uid);
      else clearLocal();
    });

    return () => subscription.unsubscribe();
  }, [loadFromDB, clearLocal]);

  /* ─────────── CART ACTIONS ─────────── */

  const addToCart = async (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`);

    if (currentUserId) {
      const existing = cartItems.find(i => i.id === product.id);
      const newQty = (existing?.quantity ?? 0) + 1;
      await supabase.from('carts').upsert(
        { user_id: currentUserId, product_id: product.id, quantity: newQty, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,product_id' }
      );
    }
  };

  const updateQuantity = async (id, change) => {
    let newQty = 0;
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          newQty = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );

    if (currentUserId) {
      if (newQty === 0) {
        await supabase.from('carts').delete().eq('user_id', currentUserId).eq('product_id', id);
      } else {
        await supabase.from('carts').upsert(
          { user_id: currentUserId, product_id: id, quantity: newQty, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,product_id' }
        );
      }
    }
  };

  const removeFromCart = async (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    if (currentUserId) {
      await supabase.from('carts').delete().eq('user_id', currentUserId).eq('product_id', id);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (currentUserId) {
      await supabase.from('carts').delete().eq('user_id', currentUserId);
    }
  };

  const getCartTotal = () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const getItemCount = () => cartItems.reduce((c, i) => c + i.quantity, 0);

  /* ─────────── WISHLIST ACTIONS ─────────── */

  const addToWishlist = async (product) => {
    setWishlistItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, product];
    });
    if (currentUserId) {
      await supabase.from('wishlists').upsert(
        { user_id: currentUserId, product_id: product.id },
        { onConflict: 'user_id,product_id' }
      );
    }
  };

  const removeFromWishlist = async (id) => {
    setWishlistItems(prev => prev.filter(i => i.id !== id));
    if (currentUserId) {
      await supabase.from('wishlists').delete().eq('user_id', currentUserId).eq('product_id', id);
    }
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getItemCount,
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      moveToCart,
      loadFromDB,
    }}>
      {children}
      {toastMessage && <div className="global-toast">{toastMessage}</div>}
    </CartContext.Provider>
  );
};
