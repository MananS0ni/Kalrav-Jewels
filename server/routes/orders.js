const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { sendOrderReceived, sendOrderStatusUpdate } = require('../utils/email');
const { calculateShipping } = require('../utils/shipping');

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/orders — Place a new order (logged-in users only)
// ─────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'cod', notes = '', utrNumber = '' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item.' });
    }

    // Verify products exist and calculate totals from DB (don't trust client prices)
    let itemsTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for: ${product.name}` });
      }

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        size: item.size || '',
        quantity: item.quantity,
      });

      itemsTotal += product.price * item.quantity;
    }

    const { shippingAddress: addr } = req.body;
    // Use shipping calculator — same logic as the /api/shipping/calculate endpoint
    const shippingResult = calculateShipping({
      itemsTotal,
      paymentMethod,
      pincode: shippingAddress.pincode,
    });
    const shippingCost = shippingResult.total;
    const totalAmount = itemsTotal + shippingCost;

    // Set payment status based on method
    const initialPaymentStatus =
      paymentMethod === 'upi' ? 'awaitingVerification'
      : 'pending'; // cod

    // Extract customer contact details to bake into the order
    const customerEmail = req.user.email;
    const customerName = shippingAddress.fullName || req.user.name || 'Valued Customer';

    // Atomically reserve stock for all items BEFORE creating the order
    const reservedItems = [];
    let stockError = null;

    for (const item of verifiedItems) {
      // Find the product ONLY if it has enough stock, and atomically decrement it
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      
      if (!updatedProduct) {
        stockError = `Sorry, ${item.name} just sold out or doesn't have enough stock left!`;
        break;
      }
      reservedItems.push(item);
    }

    // If any item failed, we must rollback (refund the stock) for the items we already reserved
    if (stockError) {
      for (const item of reservedItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
      return res.status(409).json({ message: stockError }); // 409 Conflict
    }

    // Create the order safely now that stock is secured
    const order = await Order.create({
      user: req.user._id,
      customerName,
      customerEmail,
      items: verifiedItems,
      shippingAddress,
      itemsTotal,
      shippingCost,
      shippingZone: shippingResult.zone,
      shippingBreakdown: shippingResult.breakdown,
      totalAmount,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      utrNumber: utrNumber.trim(),
      notes,
    });

    // Send order confirmation email (non-blocking)
    sendOrderReceived(order, customerEmail, customerName);

    res.status(201).json(order);
  } catch (err) {
    console.error('Place order error:', err.message);
    res.status(500).json({ message: 'Failed to place order.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/orders/my — Get current user's orders
// ─────────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/orders — Get ALL orders (admin only)
// ─────────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/orders/:id — Get single order (owner or admin)
// ─────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    // Only allow the owner or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order.' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/orders/:id/status — Update order status (admin only)
// ─────────────────────────────────────────────
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    
    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) return res.status(404).json({ message: 'Order not found.' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    );
    
    // If order status actually changed, send an update email
    if (orderStatus && orderStatus !== oldOrder.orderStatus) {
      sendOrderStatusUpdate(order, order.customerEmail, order.customerName, orderStatus);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order.' });
  }
});

module.exports = router;
