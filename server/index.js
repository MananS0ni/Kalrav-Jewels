const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const path = require('path');
require('dotenv').config();

// Fix: Windows DNS blocks SRV queries — use Google DNS instead
dns.setServers(['8.8.8.8', '8.8.4.4']);


const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const cartRoutes = require('./routes/cart');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Kalrav backend is running ✓' });
});

// ── Serve React frontend in production ──
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));

  // Any route that is NOT /api/* → serve React's index.html
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log('✓ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✓ Server running on port ${process.env.PORT || 5000}`);
      console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? '✓ YES' : '✗ MISSING');
    });
  })
  .catch((err) => {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  });
