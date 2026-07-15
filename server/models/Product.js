const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number, // for showing strikethrough/discount
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'chains'],
    },
    images: {
      type: [String], // array of image URLs
      default: [],
    },
    weight: {
      type: String,
      default: '',
    },
    material: {
      type: String, // e.g. "18K Gold", "925 Sterling Silver"
      default: '',
    },
    purity: {
      type: String, // e.g. "VS1 Diamond", "BIS Hallmarked"
      default: '',
    },
    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String], // e.g. ['bestseller', 'new', 'handcrafted']
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
