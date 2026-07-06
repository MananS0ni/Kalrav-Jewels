const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8','8.8.4.4']);

mongoose.connect(process.env.MONGO_URI, {family: 4}).then(async () => {
  const db = mongoose.connection.db;
  await db.collection('products').updateOne(
    { name: '925 Sterling Silver Link Chain' },
    { $set: { category: 'chains' } }
  );
  console.log('Category updated to chains successfully!');
  process.exit(0);
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
