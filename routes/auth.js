const express = require('express');
const User = require('../models/userModel'); // your user schema
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { error: null });
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', { error: 'User not found' });
    }

    if (user.password !== password) {
      return res.render('login', { error: 'Incorrect password' });
    }

    res.redirect(`/products?seller_id=${user.user_id}`);

  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Server error' });
  }
});

module.exports = router;