const seedUsers = require('./seedUsers');
const seedProducts = require('./seedProducts');
const seedInterested = require('./seedInterested');
const seedPurchases = require('./seedPurchases');

const seedDb = async () => {

  await seedUsers();
  await seedProducts();
  await seedInterested();
  await seedPurchases();
};

module.exports = seedDb;