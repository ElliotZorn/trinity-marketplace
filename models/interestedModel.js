const mongoose = require('mongoose');

const interestedSchema = new mongoose.Schema({
  interested_id: { type: Number, required: true, unique: true },
  user_id: { type: [String], required: true },
  product_id: { type: String, required: true },
});

const Interested = mongoose.model('Interested', interestedSchema);

module.exports = Interested;
