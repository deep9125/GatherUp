import express from 'express';
import Event from '../models/eventModel.js';

const route = express.Router();

// This is a simple test route to verify that the event routes are working😁
route.get('/', (req, res) => {
  res.send('Event route is working...');
});

route.get('/viewAllEvent', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.delete('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/addEvent', async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.put('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, location } = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { title, description, date, location },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default route;