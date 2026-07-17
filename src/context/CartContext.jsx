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

  // Called by AuthContext after login — syncs token into CartContext
  const setCartToken = useCallback((t) => setToken(t), []);

  // Save guest cart to localStorage whenever items change
  useEffect(() => {
    if (!token) {
      localStorage.setItem('kalrav_cart', JSON.stringify(items));
    }
  }, [items, token]);

  // Fetch or sync cart from backend whenever token changes (login/logout)
  useEffect(() => {
    if (!token) {
      // Don't clear guest cart on logout here, AuthContext does it
      return;
    }

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

  const addToCart = async (product) => {
    const productId = product._id || product.id;
    const price = typeof product.price === 'number'
      ? product.price
      : parseInt(String(product.price).replace(/[^0-9]/g, ''));

    const payload = {
      productId,
      name: product.name,
      image: product.images?.[0] || product.image || '/ring_product.png',
      category: product.category || '',
      material: product.material || '',
      purity: product.purity || '',
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
        const existing = prev.find((i) => i.productId === productId);
        if (existing) return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
        return [...prev, { ...payload, qty: 1 }];
      });
    }
    setCartOpen(true);
  };

  const removeFromCart = async (productId) => {
    if (token) {
      const res = await fetch(`${API}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setItems(data.items);
    } else {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    }
  };

  const updateQty = async (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    if (token) {
      const res = await fetch(`${API}/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, qty }),
      });
      const data = await res.json();
      if (res.ok) setItems(data.items);
    } else {
      setItems((prev) => prev.map((i) => i.productId === productId ? { ...i, qty } : i));
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
