const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');

// Fix: Windows DNS blocks SRV queries — use Google DNS instead
dns.setServers(['8.8.8.8', '8.8.4.4']);


const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const cartRoutes = require('./routes/cart');
const shippingRoutes = require('./routes/shipping');
const userRoutes = require('./routes/users');

const app = express();

// Trust Render's reverse proxy — required for express-rate-limit to read real client IPs
app.set('trust proxy', 1);

// Custom NoSQL Injection Sanitizer (Express 5 Compatible)
const sanitizeObject = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else {
        sanitizeObject(obj[key]);
      }
    }
  }
};

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());         // parse body FIRST

// Sanitize body and params to protect database calls
app.use((req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/cart', cartRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/users', userRoutes);

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
