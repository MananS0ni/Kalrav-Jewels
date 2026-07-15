import { createContext, useContext, useState } from 'react';
import { useCart } from './CartContext';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  // Load user & token from localStorage on app start
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nh_user')) || null; }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('nh_token') || null);

  const { setCartToken } = useCart();

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || 'Registration failed.' };

      localStorage.setItem('nh_token', data.token);
      localStorage.setItem('nh_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setCartToken(data.token); // sync cart with new token
      return { success: true };
    } catch {
      return { error: 'Could not connect to server. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || 'Login failed.' };

      localStorage.setItem('nh_token', data.token);
      localStorage.setItem('nh_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setCartToken(data.token); // sync cart — fetches user's saved cart
      return { success: true };
    } catch {
      return { error: 'Could not connect to server. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('nh_token');
    localStorage.removeItem('nh_user');
    localStorage.removeItem('kalrav_cart');
    setUser(null);
    setToken(null);
    setCartToken(null); // clears cart items on logout
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
