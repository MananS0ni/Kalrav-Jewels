const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8','8.8.4.4']);

mongoose.connect(process.env.MONGO_URI, {family: 4}).then(async () => {
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  console.log('PRODUCTS_LIST_START');
  console.log(JSON.stringify(products.map(p => ({ id: p._id, name: p.name, images: p.images, category: p.category })), null, 2));
  console.log('PRODUCTS_LIST_END');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
