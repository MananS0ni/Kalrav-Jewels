const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect: auth } = require('../middleware/auth');

const router = express.Router();

// Lazily create the instance so dotenv is always loaded first
const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/create-order
// Creates a Razorpay order and returns the order id + key
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay needs paise (1 rupee = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// POST /api/payments/verify
// Verifies the payment signature after user completes payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    res.status(500).json({ message: 'Verification error' });
  }
});

module.exports = router;
