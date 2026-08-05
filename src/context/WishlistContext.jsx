import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const auth = useAuth();
  const user = auth?.user || null;
  const userId = user?._id || user?.id || null;

  const [wishlist, setWishlist] = useState([]);
  const prevUserIdRef = useRef(userId);

  // Helper to load items safely from localStorage
  const loadStoredWishlist = (key) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Sync wishlist whenever user logs in, logs out, or switches accounts
  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    prevUserIdRef.current = userId;

    if (userId) {
      // User is logged in
      const userKey = `kalrav_wishlist_${userId}`;
      const userStored = loadStoredWishlist(userKey);

      // Check if user just logged in from guest state
      if (!prevUserId) {
        // Load guest wishlist (or legacy fallback key)
        const guestItems = [
          ...loadStoredWishlist('kalrav_wishlist_guest'),
          ...loadStoredWishlist('kalrav_wishlist'),
        ];

        if (guestItems.length > 0) {
          // Merge guest items with user account items (avoiding duplicates)
          const mergedMap = new Map();
          [...userStored, ...guestItems].forEach((item) => {
            const id = item._id || item.id;
            if (id && !mergedMap.has(id)) {
              mergedMap.set(id, item);
            }
          });
          const mergedList = Array.from(mergedMap.values());

          // Save merged wishlist into user's account storage
          localStorage.setItem(userKey, JSON.stringify(mergedList));
          // Clear guest local storage
          localStorage.removeItem('kalrav_wishlist_guest');
          localStorage.removeItem('kalrav_wishlist');

          setWishlist(mergedList);
          return;
        }
      }

      setWishlist(userStored);
    } else {
      // Guest user (or logged out)
      // If user just logged out, clear screen so next user doesn't see their items
      if (prevUserId) {
        setWishlist([]);
      } else {
        // App initial load as guest
        const guestItems = [
          ...loadStoredWishlist('kalrav_wishlist_guest'),
          ...loadStoredWishlist('kalrav_wishlist'),
        ];
        setWishlist(guestItems);
      }
    }
  }, [userId]);

  // Persist current wishlist state to appropriate localStorage key
  useEffect(() => {
    const key = userId ? `kalrav_wishlist_${userId}` : 'kalrav_wishlist_guest';
    try {
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist, userId]);

  const addToWishlist = (product) => {
    const id = product._id || product.id;
    setWishlist((prev) => {
      if (prev.some((item) => (item._id || item.id) === id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  };

  const toggleWishlist = (product) => {
    const id = product._id || product.id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
