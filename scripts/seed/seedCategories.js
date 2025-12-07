const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const Category = require('../../models/categoryModel'); 

const MONGO_URI = process.env.MONGO_URI;

const filePath = process.argv[2] || 'data/categories.json';
const jsonData = fs.readFileSync(filePath, 'utf8');
const seedData = JSON.parse(jsonData);

const transformCategory = (entry) => ({
  category_id: entry.category_id,
  parent: entry.parent,
  name: entry.name,
  slug: entry.slug,
});

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await Category.deleteMany({});
    console.log('Existing categories deleted');

    const transformedData = seedData.map(transformCategory);
    await Category.insertMany(transformedData);
    console.log('Categories data inserted successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = seedCategories;
