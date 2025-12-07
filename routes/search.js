const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');
const Products = require('../models/productModel'); 


router.get('/categories', async (req, res) => {
  const categories = await Category.find().lean();

  const categoryMap = {};

categories.forEach(cat => {
  if (cat.parent === null) {
    categoryMap[cat.name] = [];
  }
});

categories.forEach(cat => {
  if (cat.parent !== null) {
    if (!categoryMap[cat.parent]) {
      categoryMap[cat.parent] = [];
    }
    categoryMap[cat.parent].push(cat);
  }
  else{
    categoryMap[cat.name].push(cat); 
  }
});


  res.render('categories', { categoryMap });
});


router.get('/categories/:slug', async (req, res) => {
  const { slug } = req.params;

    const slugger = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' - ');
    console.log(slugger);
    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  console.log(categoryName);

  const products = await Products.find({ category : slugger}).lean();
  console.log(products);

  res.render('products', {
    products,
    name: categoryName
  });
});

router.get('/product/:id', async (req, res) => {
  const { id } = req.params;

  const product = await Products.findOne({ product_id: id }).lean();

  if (!product) {
    return res.status(404).send("Product not found");
  }

  res.render('product', { product });
});


module.exports = router;