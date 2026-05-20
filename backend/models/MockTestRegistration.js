const mongoose = require('mongoose');

const mockTestRegistrationSchema = new mongoose.Schema({
  examTitle: {
    type: String,
    required: [true, 'Please provide the exam title'],
    trim: true,
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please provide your location'],
    trim: true,
  },
}, { timestamps: true });

mockTestRegistrationSchema.index({ examTitle: 1, createdAt: -1 });
mockTestRegistrationSchema.index({ fullName: 'text', email: 'text', phone: 'text', location: 'text', examTitle: 'text' });

module.exports = mongoose.model('MockTestRegistration', mockTestRegistrationSchema);
