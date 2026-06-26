// Run this once to seed products into MongoDB:
// node seed.js

const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const Product = require('./models/Product');

const products = [
  {
    name: 'Diamond Solitaire Ring',
    description: 'A timeless solitaire ring crafted in 18K gold, set with a brilliant VS1 diamond. Perfect for engagements and milestone celebrations.',
    price: 185000,
    category: 'rings',
    images: ['/ring_product.png'],
    material: '18K Gold',
    weight: '3.2g',
    purity: 'VS1 Diamond',
    stock: 5,
    isFeatured: true,
    tags: ['bestseller'],
  },
  {
    name: 'Royal Gold Necklace',
    description: 'An opulent 22K gold necklace with intricate detailing. BIS hallmarked for guaranteed purity, this piece is a statement of royalty.',
    price: 320000,
    category: 'necklaces',
    images: ['/necklace_product.png'],
    material: '22K Gold',
    weight: '24.5g',
    purity: 'BIS Hallmarked',
    stock: 3,
    isFeatured: true,
    tags: ['new'],
  },
  {
    name: 'Diamond Drop Earrings',
    description: 'Elegant drop earrings featuring SI1 diamonds set in 18K gold. A perfect balance of sophistication and sparkle.',
    price: 98000,
    category: 'earrings',
    images: ['/earring_product.png'],
    material: '18K Gold',
    weight: '5.1g',
    purity: 'SI1 Diamond',
    stock: 8,
    isFeatured: false,
    tags: ['exquisite'],
  },
  {
    name: 'Gold Tennis Bracelet',
    description: 'A classic tennis bracelet set with VVS diamonds in 18K gold. The epitome of luxury on your wrist.',
    price: 245000,
    category: 'bracelets',
    images: ['/bracelet_product.png'],
    material: '18K Gold',
    weight: '18.3g',
    purity: 'VVS Diamond',
    stock: 4,
    isFeatured: true,
    tags: ['signature'],
  },
  {
    name: 'Emerald Cut Ring',
    description: 'A bold emerald-cut diamond ring in 18K gold with F color grading — for those who appreciate rare perfection.',
    price: 210000,
    category: 'rings',
    images: ['/ring_product.png'],
    material: '18K Gold',
    weight: '4.1g',
    purity: 'F Color Diamond',
    stock: 3,
    isFeatured: false,
    tags: ['exclusive'],
  },
  {
    name: 'Pearl Pendant Necklace',
    description: 'A heritage-inspired South Sea pearl pendant set in 22K gold. Graceful, timeless and deeply personal.',
    price: 145000,
    category: 'necklaces',
    images: ['/necklace_product.png'],
    material: '22K Gold',
    weight: '15.2g',
    purity: 'South Sea Pearl',
    stock: 6,
    isFeatured: false,
    tags: ['heritage'],
  },
  {
    name: 'Hoop Earrings',
    description: 'Classic 22K gold hoop earrings — BIS hallmarked for purity. A wardrobe essential that never goes out of style.',
    price: 65000,
    category: 'earrings',
    images: ['/earring_product.png'],
    material: '22K Gold',
    weight: '8.6g',
    purity: 'BIS Hallmarked',
    stock: 10,
    isFeatured: false,
    tags: ['classic'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('✓ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`✓ Inserted ${inserted.length} products`);

    mongoose.disconnect();
    console.log('✓ Done! Products are now in MongoDB.');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
