var express = require('express');
var router = express.Router();
const User = require('../models/userModel');


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

router.post('/delete/:id', async function(req, res) {
  try {
    await User.findOneAndDelete({ user_id: req.params.id });
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/home/:id', async function(req, res) {
  try {
    const user = await User.findOne({ user_id: req.params.id });
    if (!user) return res.status(404).send('User not found');
    
    res.render('userPage', { user: user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;