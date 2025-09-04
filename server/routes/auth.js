import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// Signup Route

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 🔒 Hash password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'Account created successfully', username });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // 🔍 Compare hash
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful', username });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
