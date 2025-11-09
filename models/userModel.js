const e = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true},
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  pass_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  profile_photo: { type: String },
  email_verified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;