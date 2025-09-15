import express from 'express';
import mongoose from 'mongoose';

import User from './models/userModel.js';
import Event from './models/eventModel.js';
import Group from './models/groupModel.js';

const PORT = 3000;
const mongoURI = 'mongodb://127.0.0.1:27017/GatherUp';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection error:', err.message));

const app = express();

app.get('/', (req, res) => {
  res.send('GatherUp API is running...');
});


app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});