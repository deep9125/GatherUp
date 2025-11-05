import express from 'express';
import multer from 'multer';
import path from 'path';
import Event from '../models/eventModel.js';
import User from '../models/userModel.js';
import { generateTicketCode } from '../utils/codeGenerator.js';
import { sendEmail } from '../utils/emailService.js';
import Group from '../models/groupModel.js';
import fs from 'fs';
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
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const imageUrl = event.imageUrl;
    await Event.findByIdAndDelete(req.params.eventId);
    Group.findOneAndDelete({ eventId: req.params.eventId }).catch(err => {
      console.error('Error deleting associated group:', err);
    });
    if (imageUrl) {
      const imagePath = path.resolve(imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Failed to delete image: ${imagePath}`, err.message);
        } else {
          console.log(`Successfully deleted image: ${imagePath}`);
        }
      });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/addEvent', upload.single('eventImage'), async (req, res) => {
  try {
    const { name, description, startTime,endTime, location, capacity, managerId,ticketPrice } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Please upload an event image' });
    if (!name || !description || !startTime || !endTime || !location || !capacity || !managerId || !ticketPrice) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }
    const newEvent = new Event({
      name, description, startTime,endTime, location, capacity, managerId,ticketPrice,
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
    const { name, description,startTime,endTime, location, capacity,ticketPrice  } = req.body;
    const updateData = { name, description, startTime,endTime, location, capacity,ticketPrice  };
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
    const { userId } = req.body; 
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();
      const user = await User.findById(userId);
      if (user && user.email) {
      const ticketCode = generateTicketCode(event._id, user._id);
      const eventTime = new Date(event.startTime).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      const subject = `Your Ticket for ${event.name}!`;
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Booking Confirmed!</h2>
          <p>Hi ${user.displayName},</p>
          <p>You're all set for <strong>${event.name}</strong>. We're excited to see you there!</p>
          
          <h3>Event Details:</h3>
          <ul>
            <li><strong>Event:</strong> ${event.name}</li>
            <li><strong>When:</strong> ${eventTime}</li>
            <li><strong>Where:</strong> ${event.location}</li>
          </ul>
          
          <h3>Your Confirmation Code:</h3>
          <p>Please present this code at the event entrance.</p>
          <h2 style="color: #333; font-family: monospace; font-size: 24px; background: #f4f4f4; padding: 10px; border-radius: 5px;">
            ${ticketCode}
          </h2>
          
          <p>See you soon,<br/>The GatherUp Team</p>
        </div>
      `;
      sendEmail({
        to: user.email,
        subject: subject,
        html: html,
      });
    }
    }
    res.json({ message: 'Successfully joined event', event });
  } catch (error) {
    console.error(error);
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