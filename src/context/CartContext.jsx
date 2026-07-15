import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('nh_token') || null);

  // Called by AuthContext after login — syncs token into CartContext
  const setCartToken = useCallback((t) => setToken(t), []);

  // Fetch cart from backend whenever token changes (login/logout)
  useEffect(() => {
    if (!token) {
      setItems([]); // clear cart on logout
      return;
    }
    fetch(`${API}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]));
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
