import express from 'express';
import Group from '../models/groupModel.js';

const route = express.Router();

route.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const group = await Group.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default route;