import mongoose from 'mongoose';

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  upcoming: {
    type: Boolean,
    reqired: true,
  },
  success: {
    type: Boolean,
    reqired: true,
    default: true,
  },
  customers: {
    type: [String],
  },
});

export default mongoose.model('Launch', launchesSchema);
