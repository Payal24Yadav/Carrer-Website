const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    trim: true,
  },
  course: {
    type: String,
    required: [true, 'Please select a course'],
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
