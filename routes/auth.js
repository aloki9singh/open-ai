const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel=require('../models/user.model.js')

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      res.status(401).json({ error: 'User Already Exist' });
      return;
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new UserModel({ email, password: hashedPass });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ email: user.email }, 'secret_key', { expiresIn: '1h' });
      res.status(200).json({ message: 'Authentication successful', token });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
