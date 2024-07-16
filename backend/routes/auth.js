import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    const exists = await User.findOne({email: user.email})
    var token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    if (!exists) {
      await user.save();
    } else {
      token = jwt.sign({ id: exists._id }, 'secret', { expiresIn: '1h' });
    }
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default authRouter;