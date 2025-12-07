const seedUsers = require('./seedUsers');
const seedProducts = require('./seedProducts');
const seedInterested = require('./seedInterested');
const seedPurchases = require('./seedPurchases');
const seedCategories = require('./seedCategories');

const seedDb = async () => {
  console.log('Seeding database...');
  await seedUsers();
  await seedProducts();
  await seedInterested();
  await seedPurchases();
  await seedCategories();
};

module.exports = seedDb;