const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

router.get('/new', (req, res) => {
    res.render('addProduct');
});

router.post('/', async (req, res) => {
    try {
        const productData = {
            product_id: req.body.product_id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            condition: req.body.condition,
            location: req.body.location,
            payment_Method: Array.isArray(req.body.payment_Method) ? req.body.payment_Method : [req.body.payment_Method],
            contact_info: req.body.contact_info,
            photos: req.body.photos ? req.body.photos.split(',') : [],
            seller_id: req.body.seller_id
        };

        const newProduct = new Product(productData);
        await newProduct.save();
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.send('Error adding product: ' + err.message);
    }
});

router.get('/', async (req, res) => {
    const products = await Product.find( {seller_id: req.query.seller_id });
    res.render('listProducts', { products });
});

module.exports = router;
