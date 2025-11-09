const e = require('express');
const mongoose = require('mongoose');

const purchasesSchema = new mongoose.Schema({
    product_id: { type: Number, required: true, unique: true },
    sell_id: { type: String, required: true},
    buyer_id: { type: String, required: true },
    purchase_date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    payment_method: { type: String, enum: ['credit_card', 'paypal', 'cash'], required: true },
});

const Purchases = mongoose.model('product', productSchema);
module.exports = Product;