import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Event from '../models/eventModel.js';
const route = express.Router();

route.get('/:displayName', async (req, res) => {
  try {
    const { displayName } = req.params;
    const user = await User.findOne({ 
      displayName: new RegExp(`^${displayName}$`, 'i') 
    }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/register', async (req, res) => {
  try {
    const { displayName, email, password, role } = req.body;
    if (!displayName || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ displayName, email, password, role });
    await user.save();
    res.status(201).json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET , { expiresIn: '1h' });
    return res.status(200).json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

route.get('/:userId/events', async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.params.userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
export default route;