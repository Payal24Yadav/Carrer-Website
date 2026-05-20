const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog title'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide content'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['MBA', 'Engineering', 'Medical', 'Law', 'Career Tips', 'Exam Updates', 'Study Abroad', 'General'],
  },
  
  author: {
    type: String,
    default: 'Admin',
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  tags: {
    type: [String],
    default: [],
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  relatedBlogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Create text index for search
blogSchema.index({ title: 'text', description: 'text', content: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
