const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8','8.8.4.4']);

mongoose.connect(process.env.MONGO_URI, {family: 4}).then(async () => {
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();
  console.log('USERS_LIST_START');
  console.log(JSON.stringify(users.map(u => ({ id: u._id, name: u.name, email: u.email })), null, 2));
  console.log('USERS_LIST_END');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
