const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  hrEmail: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  interviewDate: {
    type: String,
    required: true,
  },
  interviewTime: {
    type: String,
    required: true,
  },
  interviewType: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  }
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
