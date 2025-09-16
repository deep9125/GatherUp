import express from 'express';
import Event from '../models/eventModel.js';
const route=express.Router();

route.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default route;