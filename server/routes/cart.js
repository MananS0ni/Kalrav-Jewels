const express = require('express');
const Cart = require('../models/Cart');
const { protect: auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/cart — fetch user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json({ items: cart ? cart.items : [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// POST /api/cart/add — add or increment an item
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, name, image, category, material, purity, price } = req.body;
    if (!productId || !price) return res.status(400).json({ message: 'productId and price are required' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existing = cart.items.find((i) => i.productId.toString() === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({ productId, name, image, category, material, purity, price, qty: 1 });
    }

    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// POST /api/cart/sync — sync local cart items with backend on login
router.post('/sync', auth, async (req, res) => {
  try {
    const { items: localItems } = req.body;
    if (!localItems || !Array.isArray(localItems)) {
      return res.status(400).json({ message: 'items array is required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const localItem of localItems) {
      const existing = cart.items.find((i) => i.productId.toString() === localItem.productId.toString());
      if (existing) {
        existing.qty += localItem.qty; // Add quantities together
      } else {
        cart.items.push(localItem);
      }
    }

    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to sync cart' });
  }
});

// PUT /api/cart/update — update quantity of an item
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || qty == null) return res.status(400).json({ message: 'productId and qty are required' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    if (qty < 1) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    } else {
      const item = cart.items.find((i) => i.productId.toString() === productId);
      if (item) item.qty = qty;
    }

    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

// DELETE /api/cart/remove/:productId — remove specific item
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

// DELETE /api/cart/clear — clear entire cart (used after order placed)
router.delete('/clear', auth, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

module.exports = router;
