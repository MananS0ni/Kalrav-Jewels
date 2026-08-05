import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kalrav_cart')) || [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('nh_token') || null);

  // Called by AuthContext after login or logout
  const setCartToken = useCallback((t) => {
    setToken(t);
    if (!t) {
      // User logged out: clear cart items in memory and remove guest cart key
      setItems([]);
      try {
        localStorage.removeItem('kalrav_cart');
      } catch (e) {
        console.error('Failed to clear cart on logout', e);
      }
    }
  }, []);

  // Save guest cart to localStorage whenever items change (only when not logged in)
  useEffect(() => {
    if (!token) {
      try {
        localStorage.setItem('kalrav_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save guest cart', e);
      }
    }
  }, [items, token]);

  // Fetch or sync cart from backend whenever token changes (login)
  useEffect(() => {
    if (!token) return;

    const localItems = JSON.parse(localStorage.getItem('kalrav_cart')) || [];
    
    if (localItems.length > 0) {
      // User just logged in and has local items -> merge them
      fetch(`${API}/cart/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: localItems }),
      })
        .then((res) => res.json())
        .then((data) => {
          setItems(data.items || []);
          localStorage.removeItem('kalrav_cart'); // clear local after successful sync
        })
        .catch(() => setItems([]));
    } else {
      // No local items -> just fetch user's saved cart
      fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setItems(data.items || []))
        .catch(() => setItems([]));
    }
  }, [token]);

  const addToCart = async (product, selectedSize = '') => {
    const productId = product._id || product.id;
    const price = typeof product.price === 'number'
      ? product.price
      : parseInt(String(product.price).replace(/[^0-9]/g, ''));
    const size = selectedSize || product.selectedSize || product.size || '';

    const payload = {
      productId,
      name: product.name,
      image: product.images?.[0] || product.image || '/ring_product.webp',
      category: product.category || '',
      material: product.material || '',
      purity: product.purity || '',
      size,
      price,
    };

    if (token) {
      // Sync with backend
      const res = await fetch(`${API}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) setItems(data.items);
    } else {
      // Not logged in — update locally only
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId && (i.size || '') === size);
        if (existing) {
          return prev.map((i) => (i.productId === productId && (i.size || '') === size) ? { ...i, qty: i.qty + 1 } : i);
        }
        return [...prev, { ...payload, qty: 1 }];
      });
    }
    setCartOpen(true);
  };

  const removeFromCart = async (productId, size = '') => {
    if (token) {
      const url = size ? `${API}/cart/remove/${productId}?size=${encodeURIComponent(size)}` : `${API}/cart/remove/${productId}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setItems(data.items);
    } else {
      setItems((prev) => prev.filter((i) => !(i.productId === productId && (!size || (i.size || '') === size))));
    }
  };

  const updateQty = async (productId, qty, size = '') => {
    if (qty < 1) { removeFromCart(productId, size); return; }
    if (token) {
      const res = await fetch(`${API}/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, size, qty }),
      });
      const data = await res.json();
      if (res.ok) setItems(data.items);
    } else {
      setItems((prev) => prev.map((i) => (i.productId === productId && (i.size || '') === size) ? { ...i, qty } : i));
    }
  };

  const clearCart = async () => {
    if (token) {
      await fetch(`${API}/cart/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice, cartOpen, setCartOpen, setCartToken }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
