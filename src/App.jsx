import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import PageTracking from './components/PageTracking/PageTracking';
import Home from './pages/Home/Home';
import Collections from './pages/Collections/Collections';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Admin from './pages/Admin/Admin';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import MyOrders from './pages/MyOrders/MyOrders';
import Wishlist from './pages/Wishlist/Wishlist';
import Legal from './pages/Legal/Legal';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import './App.css';

const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin-kalrav-panel';

  return (
    <>
      <ScrollToTop />
      <PageTracking />
      {!isAdmin && <Navbar />}
      {!isAdmin && <CartDrawer />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin-kalrav-panel" element={<Admin />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/policies/:policyType" element={<Legal />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <WishlistProvider>
          <Router>
            <AppLayout />
          </Router>
        </WishlistProvider>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
