import express from 'express';
import Group from '../models/groupModel.js';

const route = express.Router();


// This is a simple test route to verify that the group routes are working😁
route.get('/', (req, res) => {
  res.send('Group route is working...');
});

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

route.post('/addGroup', async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const newGroup = new Group({
      name,
      description,
      members // Assuming members is an array of user IDs
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/addMember/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Add the member to the group's members array
    group.members.push(memberId);
    await group.save();

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

route.post('/removeMember/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Remove the member from the group's members array
    group.members.pull(memberId);
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

route.get('/viewAllGroups', async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



route.put('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, members } = req.body;

    const group = await Group.findByIdAndUpdate(
      groupId,
      { name, description, members },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

route.delete('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default route;