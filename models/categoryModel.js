const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_id: { type: Number, required: true, unique: true }, 
  parent: { type: String, default: null },                     
  name: { type: String, required: true },                      
  slug: { type: String, required: true, unique: true },        
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;