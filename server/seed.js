// Run this once to seed products into MongoDB:
// node seed.js

const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const Product = require('./models/Product');

const products = [
  {
    name: 'Sterling Silver Solitaire Ring',
    description: 'A timeless solitaire ring crafted in premium 925 sterling silver, set with a brilliant cubic zirconia. Perfect for everyday elegance.',
    price: 4500,
    category: 'rings',
    images: ['/ring_product.png'],
    material: '925 Sterling Silver',
    weight: '3.2g',
    purity: '925 Silver',
    stock: 15,
    isFeatured: true,
    tags: ['bestseller'],
  },
  {
    name: 'Silver Pearl Drop Necklace',
    description: 'An elegant 925 sterling silver necklace featuring a delicate freshwater pearl. Guaranteed purity, this piece is a statement of modern grace.',
    price: 6200,
    category: 'necklaces',
    images: ['/necklace_product.png'],
    material: '925 Sterling Silver',
    weight: '8.5g',
    purity: '925 Silver',
    stock: 10,
    isFeatured: true,
    tags: ['new'],
  },
  {
    name: 'Silver Crystal Drop Earrings',
    description: 'Elegant drop earrings featuring high-grade crystals set in 925 sterling silver. A perfect balance of sophistication and sparkle.',
    price: 3800,
    category: 'earrings',
    images: ['/earring_product.png'],
    material: '925 Sterling Silver',
    weight: '5.1g',
    purity: '925 Silver',
    stock: 12,
    isFeatured: false,
    tags: ['exquisite'],
  },
  {
    name: 'Silver Tennis Bracelet',
    description: 'A classic tennis bracelet set with premium cubic zirconia in 925 sterling silver. The epitome of everyday luxury on your wrist.',
    price: 8500,
    category: 'bracelets',
    images: ['/bracelet_product.png'],
    material: '925 Sterling Silver',
    weight: '12.3g',
    purity: '925 Silver',
    stock: 8,
    isFeatured: true,
    tags: ['signature'],
  },
  {
    name: 'Vintage Emerald-Cut Silver Ring',
    description: 'A bold emerald-cut cubic zirconia ring in oxidized 925 sterling silver — for those who appreciate rare vintage perfection.',
    price: 5500,
    category: 'rings',
    images: ['/ring_product.png'],
    material: '925 Sterling Silver',
    weight: '4.1g',
    purity: '925 Silver',
    stock: 9,
    isFeatured: false,
    tags: ['exclusive'],
  },
  {
    name: 'Silver Heritage Pendant Necklace',
    description: 'A heritage-inspired intricately carved pendant set in 925 sterling silver. Graceful, timeless and deeply personal.',
    price: 7200,
    category: 'necklaces',
    images: ['/necklace_product.png'],
    material: '925 Sterling Silver',
    weight: '15.2g',
    purity: '925 Silver',
    stock: 6,
    isFeatured: false,
    tags: ['heritage'],
  },
  {
    name: 'Silver Classic Hoop Earrings',
    description: 'Classic 925 sterling silver hoop earrings. A wardrobe essential that never goes out of style.',
    price: 2900,
    category: 'earrings',
    images: ['/earring_product.png'],
    material: '925 Sterling Silver',
    weight: '6.6g',
    purity: '925 Silver',
    stock: 20,
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
