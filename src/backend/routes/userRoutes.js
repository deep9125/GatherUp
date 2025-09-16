import express from 'express';
import User from '../models/userModel.js';
const route=express.Router();

route.get('/:displayName', async (req, res) => {
  try {
    const { displayName } = req.params;
    const user = await User.findOne({ displayName: new RegExp(`^${displayName}$`, 'i') });
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
    const user = new User({
      displayName,
      email,
      password,
      role, 
    });
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

export default route