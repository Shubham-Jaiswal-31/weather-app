import express from 'express';
import User from '../models/User.js';
import auth from './auth.js';

const router = express.Router();

// User registration
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({ username, password });
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// User logout
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out' });
  }
});

// Add location to user's saved locations
router.post('/add-location', auth, async (req, res) => {
  const { locationId } = req.body;
  try {
    const user = req.user;
    user.savedLocations.push(locationId);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error adding location' });
  }
});

// Remove location from user's saved locations
router.post('/remove-location', auth, async (req, res) => {
  const { locationId } = req.body;
  try {
    const user = req.user;
    user.savedLocations = user.savedLocations.filter(id => id.toString() !== locationId);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error removing location' });
  }
});

export default router;
