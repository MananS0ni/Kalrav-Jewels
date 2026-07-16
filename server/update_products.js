const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8','8.8.4.4']);

mongoose.connect(process.env.MONGO_URI, {family: 4}).then(async () => {
  const db = mongoose.connection.db;
  
  // Update Silver Tennis Bracelet
  await db.collection('products').updateOne(
    { name: 'Silver Tennis Bracelet' },
    { $set: { 
        images: [
          '/tennis-bracelet/hero-1.jpg', 
          '/tennis-bracelet/video.mp4', 
          '/tennis-bracelet/lifestyle-1.jpg', 
          '/tennis-bracelet/lifestyle-2.jpg', 
          '/tennis-bracelet/lifestyle-3.jpg', 
          '/tennis-bracelet/hero-2.jpg'
        ] 
    } }
  );
  
  // Insert 925 Silver Chain (if it doesn't exist)
  const existing = await db.collection('products').findOne({ name: '925 Sterling Silver Link Chain' });
  if (!existing) {
    await db.collection('products').insertOne({
      name: '925 Sterling Silver Link Chain',
      category: 'necklaces',
      price: 45000,
      description: 'A timeless sterling silver link chain perfect for everyday elegance.',
      material: '925 Sterling Silver',
      weight: '15.5g',
      purity: '92.5%',
      stock: 20,
      isFeatured: true,
      tags: ['new', 'silver'],
      images: [
        '/silver-link-chain/hero-1.jpg', 
        '/silver-link-chain/hero-2.jpg', 
        '/silver-link-chain/lifestyle.jpg', 
        '/silver-link-chain/background.jpg'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  console.log('Products updated successfully!');
  process.exit(0);
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
