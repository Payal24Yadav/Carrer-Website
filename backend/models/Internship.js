const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an internship title'],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  duration: {
    type: String,
    required: [true, 'Please provide internship duration'],
    trim: true,
  },
  stipend: {
    type: String,
    required: [true, 'Please provide stipend details'],
    trim: true,
  },
  skillsRequired: [{
    type: String,
    trim: true,
  }],
  description: {
    type: String,
    required: [true, 'Please provide description details'],
  },
  responsibilities: {
    type: String,
    default: '',
  },
  eligibility: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Please provide an internship category'],
    trim: true,
  },
  applyLink: {
    type: String,
    required: [true, 'Please provide an application link'],
    trim: true,
  },
  lastDate: {
    type: Date,
    required: [true, 'Please provide the last date to apply'],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'closed'],
    default: 'active',
  },
}, { timestamps: true });

internshipSchema.index({ title: 'text', companyName: 'text', location: 'text', category: 'text' });

module.exports = mongoose.model('Internship', internshipSchema);
