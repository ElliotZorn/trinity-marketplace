const express = require('express');
const User = require('../models/userModel'); 
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
    req.session.userId = user.user_id;
    res.redirect(`/users/home/${user.user_id}`);

  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Server error' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth');
  });
});

module.exports = router;