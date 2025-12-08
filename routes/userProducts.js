const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Interests = require('../models/interestedModel');

router.get('/new', async (req, res) => {
    try {
        const categories = await Category.find().sort({ slug: 1 });

        const prettyCategories = categories.map(cat => {
            return cat.slug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' - ');
        });
        res.render('addProduct', { categories: prettyCategories }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        let productId = await Product.findOne().sort({ product_id: -1 }).select('product_id').exec();
        productId = productId ? productId.product_id + 1 : 1;
        console.log(req.session.userId);
        const productData = {
            product_id: productId,
            seller_id: req.session.userId,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            condition: req.body.condition,
            location: req.body.location,
            payment_Method: Array.isArray(req.body.payment_Method) ? req.body.payment_Method : [req.body.payment_Method],
            contact_info: req.body.contact_info,
            photos: req.body.photos ? req.body.photos.split(',') : [],
        };

        const newProduct = new Product(productData);
        await newProduct.save();
        res.redirect('/userProducts');
    } catch (err) {
        console.error(err);
        res.send('Error adding product: ' + err.message);
    }
});

router.get('/', async (req, res) => {
    const products = await Product.find( {seller_id: req.session.userId} ).exec();
    res.render('listProducts', { products });
});

router.get('/interests', async (req, res) => {
    try {
        const interests = await Interests.find({ user_id: req.session.userId }).exec();

        const productIds = interests.map(interest => interest.product_id);

        const products = await Product.find({ product_id: { $in: productIds } }).exec();

        res.render('userInterests', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
