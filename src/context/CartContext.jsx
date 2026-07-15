import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const localData = localStorage.getItem('kalrav_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kalrav_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      // Use _id (MongoDB) or id as fallback
      const productId = product._id || product.id;
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, {
        productId,
        name: product.name,
        image: product.images?.[0] || product.image || '/ring_product.png',
        category: product.category || '',
        material: product.material || '',
        purity: product.purity || '',
        price: typeof product.price === 'number' ? product.price : parseInt(String(product.price).replace(/[^0-9]/g, '')),
        qty: 1,
      }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setItems((prev) => prev.map((i) => i.productId === productId ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
