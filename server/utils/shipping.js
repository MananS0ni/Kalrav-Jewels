/**
 * utils/shipping.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure shipping cost calculation logic.
 * All rate values come from shippingConfig.js — do NOT hardcode prices here.
 *
 * Exported functions:
 *   getZone(pincode)                         → 'metro' | 'remote' | 'standard'
 *   calculateShipping({ itemsTotal, paymentMethod, pincode })
 *     → { zone, baseCost, codFee, total, isFree, breakdown }
 */

const config = require('../shippingConfig');

/**
 * Classify a pincode into a delivery zone.
 * Uses the first 3 digits to match against config lists.
 *
 * @param {string} pincode - 6-digit Indian pincode
 * @returns {'metro' | 'remote' | 'standard'}
 */
const getZone = (pincode) => {
  const prefix = String(pincode).trim().slice(0, 3);

  if (config.remotePrefixes.includes(prefix)) return 'remote';
  if (config.metroPrefixes.includes(prefix)) return 'metro';
  return 'standard';
};

/**
 * Calculate the full shipping cost for an order.
 *
 * @param {object} params
 * @param {number} params.itemsTotal   - Sum of all product prices × quantities
 * @param {string} params.paymentMethod - 'cod' | 'razorpay'
 * @param {string} params.pincode      - Delivery pincode (6 digits)
 * @returns {object} Full shipping breakdown
 */
const calculateShipping = ({ itemsTotal, paymentMethod, pincode }) => {
  const zone = getZone(pincode);
  const isPrepaid = paymentMethod !== 'cod';

  // ── Free shipping check (prepaid only) ────────────────────────────────────
  if (isPrepaid && itemsTotal >= config.freeShippingAbove) {
    return {
      zone,
      baseCost: 0,
      codFee: 0,
      total: 0,
      isFree: true,
      freeShippingThreshold: config.freeShippingAbove,
      breakdown: `Free shipping on orders above ₹${config.freeShippingAbove.toLocaleString('en-IN')}`,
    };
  }

  // ── Base courier cost ─────────────────────────────────────────────────────
  const baseCost = config.baseRates[zone];

  // ── COD fee (only for COD orders) ─────────────────────────────────────────
  let codFee = 0;
  if (!isPrepaid) {
    const flatCod = config.cod.flatFee;
    const percentCod = Math.round(itemsTotal * config.cod.percentFee);
    codFee = Math.max(flatCod, percentCod); // whichever is higher
  }

  const total = baseCost + codFee;

  return {
    zone,
    baseCost,
    codFee,
    total,
    isFree: false,
    freeShippingThreshold: config.freeShippingAbove,
    amountForFreeShipping: isPrepaid
      ? Math.max(0, config.freeShippingAbove - itemsTotal)
      : null, // COD orders never qualify for free shipping
    breakdown: isPrepaid
      ? `Standard delivery (${zone} zone)`
      : `Cash on Delivery — includes ₹${codFee} COD handling fee`,
  };
};

module.exports = { getZone, calculateShipping };
