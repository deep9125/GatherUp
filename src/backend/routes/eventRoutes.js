import express from 'express';
import multer from 'multer';
import path from 'path';
import Event from '../models/eventModel.js';

const route = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

route.get('/viewAllEvent', async (req, res) => {
  try {
    const events = await Event.find({}).populate('managerId', 'displayName');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.get('/:eventId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('managerId', 'displayName') 
      .populate('attendees', 'displayName') 
      .populate('ratings.userId', 'displayName'); 
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.delete('/:eventId', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/addEvent', upload.single('eventImage'), async (req, res) => {
  try {
    const { name, description, date, location, capacity, managerId,ticketPrice } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Please upload an event image' });
    if (!name || !description || !date || !location || !capacity || !managerId || !ticketPrice) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }
    const newEvent = new Event({
      name, description, date, location, capacity, managerId,ticketPrice,
      imageUrl: req.file.path,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

route.put('/:eventId', upload.single('eventImage'), async (req, res) => {
  try {
    const { name, description, date, location, capacity,ticketPrice  } = req.body;
    const updateData = { name, description, date, location, capacity,ticketPrice  };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/:eventId/join', async (req, res) => {
  try {
    const { userId } = req.body; // User ID should be sent in the request body
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();
    }
    res.json({ message: 'Successfully joined event', event });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/:eventId/rate', async (req, res) => {
  try {
    const { userId, score, comment } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const newRating = { userId, score, comment };
    event.ratings.push(newRating);
    await event.save();
    res.status(201).json({ message: 'Rating added successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.get('/manager/:managerId', async (req, res) => {
  try {
    const events = await Event.find({ managerId: req.params.managerId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/:eventId/attendance', async (req, res) => 
  {
    try {
    const { presentUserIds, absentUserIds } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.presentAttendees.addToSet(...presentUserIds);
    event.presentAttendees.pull(...absentUserIds);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
  });

export default route;