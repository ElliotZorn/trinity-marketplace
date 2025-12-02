// /scripts/importCSV.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const csv = require('csv-parser');

// import your models
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Purchases = require('../models/purchasesModel');
const Interested = require('../models/interestedModel');

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

// --- Function to import CSV data into a given model ---
async function importCSV(filePath, Model) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          await Model.insertMany(results, { ordered: false });
          console.log(`Imported ${results.length} rows into ${Model.modelName}`);
          resolve();
        } catch (err) {
          console.error(`Error inserting into ${Model.modelName}:`, err.message);
          reject(err);
        } finally {
          mongoose.connection.close();
        }
      });
  });
}

// --- Run import for whichever model you want ---
const [,, modelArg, fileArg] = process.argv;

const modelMap = {
  users: User,
  products: Product,
  purchases: Purchases,
  interested: Interested,
};

if (!modelArg || !fileArg || !modelMap[modelArg]) {
  console.log('Usage: node scripts/importCSV.js <model> <csvFile>');
  process.exit(1);
}

const filePath = path.resolve(fileArg);
importCSV(filePath, modelMap[modelArg]);
