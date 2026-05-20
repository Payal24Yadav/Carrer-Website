const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a news title'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: [true, 'Please provide a short description'],
  },
  fullContent: {
    type: mongoose.Schema.Types.Mixed, // Supporting dynamic content blocks array
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  isBreakingNews: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: 'General',
  },
  tags: {
    type: [String],
    default: [],
  },
  author: {
    type: String,
    default: 'Admin',
  },
}, { timestamps: true });

// Create text index for search
newsSchema.index({ title: 'text', shortDescription: 'text' });

module.exports = mongoose.model('News', newsSchema);
