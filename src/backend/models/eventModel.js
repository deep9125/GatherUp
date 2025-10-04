import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
});

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  imageUrl: { type: String, required: true },
  ticketPrice: {
    type: Number,
    required: true,
    default: 0 
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
  presentAttendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [ratingSchema], 
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
export default Event;