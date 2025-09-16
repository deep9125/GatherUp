import express from 'express';
import mongoose from 'mongoose';

import UserRoute from './routes/userRoutes.js';
import EventRoute from './routes/eventRoutes.js';
import GroupRoute from './routes/groupRoutes.js';

const PORT = 3000;
const mongoURI = 'mongodb://127.0.0.1:27017/GatherUp';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection error:', err.message));

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('GatherUp API is running...');
});
app.use('/api/events',EventRoute);
app.use('/api/groups',GroupRoute);
app.use('/api/users',UserRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});