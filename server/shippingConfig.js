/**
 * shippingConfig.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central config for all shipping rates. Edit this file when courier rates
 * change — do NOT touch the core logic in utils/shipping.js.
 *
 * Zones:
 *   metro     → Major cities (fast delivery, lower base rate)
 *   standard  → All other non-remote areas
 *   remote    → Rural / difficult-to-reach pincodes
 */

const SHIPPING_CONFIG = {
  // ── Free Shipping Threshold ─────────────────────────────────────────────────
  // Orders above this amount get free shipping (both prepaid and COD).
  // Set to Infinity to disable free shipping entirely.
  freeShippingAbove: 10000, // ₹10,000+  → free shipping

  // ── Base Rates (prepaid) ────────────────────────────────────────────────────
  // These are the base courier costs for prepaid orders.
  baseRates: {
    metro: 60,      // ₹60 for metro cities
    standard: 80,   // ₹80 for standard areas
    remote: 140,    // ₹140 for remote/rural areas
  },

  // ── COD Surcharge ──────────────────────────────────────────────────────────
  // Extra charge on top of base rate for Cash on Delivery orders.
  cod: {
    flatFee: 40,        // ₹40 flat COD handling fee
    percentFee: 0.015,  // 1.5% of order value (whichever is higher)
  },

  // ── Metro Pincodes ─────────────────────────────────────────────────────────
  // First 3 digits of pincode → zone classification.
  // Source: India Post / major courier zone lists.
  // Add/remove prefixes as needed.
  metroPrefixes: [
    // Delhi NCR
    '110', '111', '112', '120', '121', '122', '123', '124', '125', '126', '127',
    '128', '129', '130', '131', '132', '133', '134', '135', '136',
    // Mumbai & Thane
    '400', '401', '402', '403', '404', '410', '411', '412',
    // Bengaluru
    '560', '561', '562', '563', '564',
    // Chennai
    '600', '601', '602', '603', '604',
    // Kolkata
    '700', '701', '702', '703', '704', '711',
    // Hyderabad
    '500', '501', '502', '503', '504', '505',
    // Pune
    '411', '412', '413', '414',
    // Ahmedabad (your home city!)
    '380', '381', '382', '383', '384',
    // Surat
    '395', '394',
  ],

  // ── Remote Pincodes ────────────────────────────────────────────────────────
  // First 3 digits of remote/rural pincode prefixes.
  // These attract an additional surcharge.
  remotePrefixes: [
    // J&K, Himachal, Uttarakhand hills
    '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
    '170', '171', '172', '173', '174', '175', '176', '177', '178',
    '246', '247', '248', '249',
    // North-East states
    '781', '782', '783', '784', '785', '786', '787', '788', '789',
    '790', '791', '792', '793', '794', '795', '796', '797', '798', '799',
    // Andaman & Nicobar
    '744',
    // Lakshadweep
    '682',
    // Sikkim
    '737',
    // Parts of Rajasthan (desert/remote)
    '344', '345',
  ],
};

module.exports = SHIPPING_CONFIG;
