const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['contact', 'product'], required: true },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    subject: { type: String },
    message: { type: String },
    productName: { type: String },
    status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
