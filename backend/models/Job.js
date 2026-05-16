const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
  },
  salary: {
    type: String,
    required: [true, 'Please provide salary information'],
  },
  skills: [{
    type: String,
    trim: true,
  }],
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'],
    default: 'Full-time',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
