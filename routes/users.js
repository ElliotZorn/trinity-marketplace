var express = require('express');
var router = express.Router();
const User = require('../models/userModel');

router.get('/', async function(req, res) {
  try {
    const users = await User.find({});
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async function(req, res) {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
})

module.exports = router;
