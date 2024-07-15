import express from 'express';
import Location from '../models/Location.js';
import User from '../models/User.js'
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('locations');
    res.status(200).json(user.locations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/', authenticate, async (req, res) => {
  const name = req.body.location;
  try {
    const location = new Location({ name, user: req.userId });
    const exists = await Location.findOne({ name: location.name}).exec();
    if (!exists) {
      await location.save();
      const user = await User.findById(req.userId);
      user.locations.push(location._id);
      await user.save();
    } 
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    if (location.user.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
    
    await location.deleteOne();
    await User.findByIdAndUpdate(req.userId, { $pull: { locations: req.params.id } });
    
    res.status(200).json({ message: 'Location deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;