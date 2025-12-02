const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const Purchase = require('../../models/purchasesModel'); 

const MONGO_URI = process.env.MONGO_URI;

const filePath = process.argv[2] || 'data/purchases.json';
const jsonData = fs.readFileSync(filePath, 'utf8');
const seedData = JSON.parse(jsonData);

const transformPurchase = (entry) => {
  return {
    product_id: entry.product_id,
    sell_id: entry.sell_id.toString(),
    buyer_id: entry.buyer_id.toString(),
    purchase_date: new Date(entry.purchase_date),
    amount: entry.amount,
    payment_method: entry.payment_method,
  };
};

const seedPurchases = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await Purchase.deleteMany({});
    console.log('Existing purchases deleted');

    const transformedData = seedData.map(transformPurchase);
    await Purchase.insertMany(transformedData);
    console.log('Purchases data inserted successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = seedPurchases;