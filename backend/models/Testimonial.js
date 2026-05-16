const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Please provide a role'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a testimonial message'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5,
    default: 5,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
