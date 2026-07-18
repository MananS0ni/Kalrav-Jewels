const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },      // snapshot at time of order
  price: { type: Number, required: true },     // snapshot at time of order
  image: { type: String, default: '' },        // snapshot at time of order
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Snapshot of customer details at time of order
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    
    items: [orderItemSchema],

    // Delivery address
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    // Totals
    itemsTotal: { type: Number, required: true },   // sum of all items
    shippingCost: { type: Number, default: 0 },      // calculated shipping
    shippingZone: { type: String, enum: ['metro', 'standard', 'remote'], default: 'standard' },
    shippingBreakdown: { type: String, default: '' }, // human-readable summary
    totalAmount: { type: Number, required: true },   // itemsTotal + shippingCost

    // Status
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'awaitingVerification', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'razorpay', 'upi'],
      default: 'cod',
    },

    // UPI payment reference (customer submits after paying)
    utrNumber: { type: String, default: '' },

    // Razorpay (will use later)
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },

    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
