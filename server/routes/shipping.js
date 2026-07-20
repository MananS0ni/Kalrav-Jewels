/**
 * routes/shipping.js
 * ─────────────────────────────────────────────────────────────────────────────
 * POST /api/shipping/calculate
 *
 * Called by the React checkout page BEFORE the customer confirms payment.
 * Returns the full shipping cost breakdown so it can be shown in the UI.
 *
 * Body: { itemsTotal, paymentMethod, pincode }
 * Response: { zone, baseCost, codFee, total, isFree, breakdown, ... }
 */

const express = require('express');
const { calculateShipping } = require('../utils/shipping');

const router = express.Router();

// POST /api/shipping/calculate
router.post('/calculate', (req, res) => {
  const { itemsTotal, paymentMethod, pincode } = req.body;

  // ── Validation ─────────────────────────────────────────────────────────────
  if (!itemsTotal || itemsTotal <= 0) {
    return res.status(400).json({ message: 'itemsTotal must be a positive number.' });
  }
  if (!['cod', 'razorpay', 'upi'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'paymentMethod must be "cod", "upi", or "razorpay".' });
  }
  if (!/^\d{6}$/.test(String(pincode).trim())) {
    return res.status(400).json({ message: 'pincode must be a 6-digit number.' });
  }

  // ── Calculate ──────────────────────────────────────────────────────────────
  const result = calculateShipping({ itemsTotal, paymentMethod, pincode });

  return res.json(result);
});

module.exports = router;
