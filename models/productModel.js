const e = require('express');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    condition: { type: String, enum: ['new','used'], default: 'new' },
    location: { type: String,  enum: ['trintyLocations']},
    payment_Method: { type: [String], enum: ['credit_card', 'paypal', 'cash'], required: true },
    contact_info: { type: String, required: true },
    is_sold: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    photos: { type: [String] },
    seller_id: { type: String, required: true },

});

const Product = mongoose.model('product', productSchema);

module.exports = Product;