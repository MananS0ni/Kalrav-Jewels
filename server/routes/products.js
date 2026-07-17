const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// GET /api/products — get all, optional ?category=rings filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.isFeatured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// GET /api/products/:id — get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
});

// POST /api/products — add new product (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, images, weight, material, purity, stock, isFeatured, tags } = req.body;
    const product = await Product.create({ name, description, price, originalPrice, category, images, weight, material, purity, stock, isFeatured, tags });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id — update product (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, images, weight, material, purity, stock, isFeatured, tags } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, description, price, originalPrice, category, images, weight, material, purity, stock, isFeatured, tags }, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id — delete product (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;
