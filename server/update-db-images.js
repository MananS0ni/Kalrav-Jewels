const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product.js');

const DB_URI = process.env.MONGO_URI;

async function updateDB() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(DB_URI);
    console.log('Connected! Updating products...');
    
    const products = await Product.find({});
    
    let updatedCount = 0;
    for (const p of products) {
      let changed = false;
      const newImages = p.images.map(img => {
        if (img.includes('.png') || img.includes('.jpg') || img.includes('.jpeg')) {
          const newImg = img
            .replace('ring_product.png', 'ring_product.webp')
            .replace('necklace_product.png', 'necklace_product.webp')
            .replace('earring_product.png', 'earring_product.webp')
            .replace('bracelet_product.png', 'bracelet_product.webp');
          if (newImg !== img) changed = true;
          return newImg;
        }
        return img;
      });

      if (changed) {
        p.images = newImages;
        await p.save();
        updatedCount++;
      }
    }
    console.log(`✅ Successfully updated ${updatedCount} products to use .webp images!`);
    process.exit(0);
  } catch (err) {
    console.error('Database update failed:', err);
    process.exit(1);
  }
}

updateDB();
