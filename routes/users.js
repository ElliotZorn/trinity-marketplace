var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Purchases = require('../models/purchasesModel');
const Interested = require('../models/interestedModel');


router.get('/register', function(req, res) {
  res.render('register', { error: null });
});


router.post('/register', async function(req, res) {
  try {
    const userData = {
      ...req.body,
      user_id: Date.now() 
    };

    const newUser = new User(userData);
    await newUser.save();
    
    res.redirect('/auth'); 
  } catch (error) {
    if (error.code === 11000) {
        return res.render('register', { error: 'Username or Email already exists.' });
    }
    res.status(400).render('register', { error: error.message });
  }
});

router.get('/edit/:id', async function(req, res) {
  try {
    const user = await User.findOne({ user_id: req.params.id });
    if (!user) return res.status(404).send('User not found');
    res.render('editUser', { user: user, error: null });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/update/:id', async function(req, res) {
  try {
    const { username, first_name, last_name, email, phone } = req.body;
    
    await User.findOneAndUpdate(
      { user_id: req.params.id }, 
      { username, first_name, last_name, email, phone },
      { runValidators: true }
    );

    res.redirect(`/users/home/${req.params.id}`);
  } catch (error) {
    const user = await User.findOne({ user_id: req.params.id });
    res.render('editUser', { user: user, error: 'Update failed: ' + error.message });
  }
});

router.get('/delete/:id', async function(req, res) {
  try {
    const userId = req.params.id; 
    await Product.deleteMany({ seller_id: userId });

    await Purchases.deleteMany({ 
      $or: [
        { sell_id: userId }, 
        { buyer_id: userId }
      ] 
    });

    await Interested.updateMany(
      { user_id: userId },
      { $pull: { user_id: userId } }
    );

    await User.findOneAndDelete({ user_id: userId });

    req.session.destroy(err => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error logging out');
      }
      res.redirect('/auth');
    });  
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/home/:id', async function(req, res) {
  try {
    if (!req.session.userId) {
      return res.redirect('/auth'); 
    }

    const user = await User.findOne({ user_id: req.params.id });
    if (!user) return res.status(404).send('User not found');
    
    res.render('userPage', { user: user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;