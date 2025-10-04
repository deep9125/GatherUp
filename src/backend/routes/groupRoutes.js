import express from 'express';
import Group from '../models/groupModel.js';
import User from '../models/userModel.js'; 

const route = express.Router();

route.get('/event/:eventId', async (req, res) => {
  try {
    const groups = await Group.find({ eventId: req.params.eventId })
      .populate('createdBy', 'displayName') 
      .populate('members', 'displayName');   
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.get('/:groupId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('createdBy', 'displayName')
      .populate('members', 'displayName')
      .populate('messages.userId', 'displayName'); 
      
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/', async (req, res) => {
  try {
    const { name, eventId, createdBy } = req.body;
    if (!name || !eventId || !createdBy) {
      return res.status(400).json({ message: 'Missing required fields: name, eventId, createdBy' });
    }
    const newGroup = new Group({
      name,
      eventId,
      createdBy,
      members: [createdBy] 
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/:groupId/messages', async (req, res) => {
  try {
    const { userId, username, text } = req.body;
    if (!userId || !username || !text) {
      return res.status(400).json({ message: 'Missing required fields: userId, username, text' });
    }
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    const newMessage = { userId, username, text };
    group.messages.push(newMessage);
    await group.save();
    res.status(201).json(group.messages[group.messages.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default route;