const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const Interested = require('../../models/interestedModel'); 

const MONGO_URI = process.env.MONGO_URI;

const filePath = process.argv[2] || 'data/interested.json';
const jsonData = fs.readFileSync(filePath, 'utf8');
const seedData = JSON.parse(jsonData);

const transformInterested = (entry) => {
  return {
    interested_id: entry.interested_id,
    user_id: entry.user_id.map(u => u.value.toString()),
    product_id: entry.product_id.toString(),
  };
};

const seedInterested = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await Interested.deleteMany({});
    console.log('Existing interested entries deleted');

    const transformedData = seedData.map(transformInterested);
    await Interested.insertMany(transformedData);
    console.log('Interested data inserted successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

 module.exports = seedInterested;