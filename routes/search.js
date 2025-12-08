const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');
const Products = require('../models/productModel'); 


router.get('/categories', async (req, res) => {

  if (!req.session.userId) {
    return res.redirect('/auth'); 
  }
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
  const { minPrice, maxPrice, condition, locations, paymentMethods, includeSold } = req.query;

  const prettyCategory = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' - ');

  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const filters = {
    categories: [prettyCategory],
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    condition: condition ? (Array.isArray(condition) ? condition : [condition]) : undefined,
    locations: locations ? (Array.isArray(locations) ? locations : [locations]) : undefined,
    paymentMethods: paymentMethods ? (Array.isArray(paymentMethods) ? paymentMethods : [paymentMethods]) : undefined,
    includeSold: includeSold === 'true'
  };


  const products = await Products.filterProducts(filters);

  res.render('products', {
    products,
    name: categoryName,
    minPrice,
    maxPrice,
    condition: filters.condition,
    locations: filters.locations,
    paymentMethods: filters.paymentMethods,
    includeSold: filters.includeSold
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