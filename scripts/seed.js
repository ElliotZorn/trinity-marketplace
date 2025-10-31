const mongoose = require('mongoose');
require('dotenv').config();


const User = require('../models/userModel');

const MONGO_URI = process.env.MONGO_URI;

const seedData = [
  { name: 'Horn Mode'}
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await User.deleteMany({});
    await User.insertMany(seedData);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.connection.close();
  }
};

seedDB();