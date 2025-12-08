const e = require('express');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    condition: { type: String, enum: ['new','used'], default: 'new' },
    location: { type: String},
    payment_Method: { type: [String], enum: ['credit_card', 'paypal', 'cash'], required: true },
    contact_info: { type: String, required: true },
    is_sold: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    photos: { type: [String] },
    seller_id: { type: String, required: true },
});

/*

example usage:

Product.filterProducts({
  price: { min: 10, max: 150 },
  categories: ["electronics", "books"],
  locations: ["campus_west", "dorms"],
  paymentMethods: ["cash", "paypal"],
  includeSold: false
});

*/

productSchema.statics.filterProducts = async function(filters = {}) {
  const query = {};

  // Price range
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }

  // Multiple Categories
  if (filters.categories && filters.categories.length > 0) {
    query.category = { $in: filters.categories };
  }

  // Multiple Locations
  if (filters.locations && filters.locations.length > 0) {
    query.location = { $in: filters.locations };
  }

  // Multiple Payment Methods
  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    query.payment_Method = { $in: filters.paymentMethods };
  }

  // Condition filter
  if (filters.condition && filters.condition.length > 0) {
    query.condition = { $in: filters.condition };
  }

  // Hide sold by default
  if (!filters.includeSold) {
    query.is_sold = false;
  }

  return this.find(query).sort({ created_at: -1 });
};


productSchema.statics.getCategoryStats = async function(categories = []) {
  const query = {};

  // Filter multiple categories
  if (categories.length > 0) {
    query.category = { $in: categories };
  }

  // Step 1: Fetch products (price only for speed)
  const products = await this.find(query, { price: 1, _id: 0 });

  if (products.length === 0) return null;

  const prices = products.map(p => p.price).sort((a, b) => a - b);

  // Step 2: Calculations

  const min = prices[0];
  const max = prices[prices.length - 1];

  const sum = prices.reduce((a, b) => a + b, 0);
  const avg = sum / prices.length;

  let median;
  if (prices.length % 2 === 0) {
    median = (prices[prices.length/2 - 1] + prices[prices.length/2]) / 2;
  } else {
    median = prices[Math.floor(prices.length / 2)];
  }

  // Calculate mode (most frequent price value)
  const freq = {};
  prices.forEach(p => freq[p] = (freq[p] || 0) + 1);
  const mode = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);

  return {
    count: prices.length,
    min,
    max,
    avg: Number(avg.toFixed(2)),
    median,
    mode
  };
};



const Product = mongoose.model('product', productSchema);

module.exports = Product;