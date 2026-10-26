const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');

const router = express.Router();

// Creates a login token that is valid for 7 days
const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Only send safe fields to the browser (never the password hash)
const userData = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  phone: user.phone,
  salesCount: user.salesCount,
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: 'Username, email, password and phone number are all required.' });
    }
    if (username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (!/^\+?[0-9\s-]{7,15}$/.test(phone.trim())) {
      return res.status(400).json({ message: 'Please enter a valid phone number (digits only, you may start with +).' });
    }

    const exists = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }],
    });
    if (exists) {
      return res.status(400).json({ message: 'That username or email is already registered.' });
    }

    // Hash the password: the real password is never stored
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ token: createToken(user._id), user: userData(user) });
  } catch (error) {
    res.status(500).json({ message: 'Could not register. ' + error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Compare typed password with the stored hash
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Wrong email or password.' });
    }

    res.json({ token: createToken(user._id), user: userData(user) });
  } catch (error) {
    res.status(500).json({ message: 'Could not log in. ' + error.message });
  }
});

// GET /api/auth/me  (used to keep the user logged in after a page refresh)
router.get('/me', protect, (req, res) => {
  res.json({ user: userData(req.user) });
});

module.exports = router;
