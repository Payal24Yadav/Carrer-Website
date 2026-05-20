const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an exam title'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a unique slug'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, 'Please select a mock test category'],
    enum: ['MBA & Management', 'Engineering (B.Tech)', 'Govt Exams', 'SSC', 'Others'],
    trim: true,
  },
  subtitle: {
    type: String,
    required: [true, 'Please provide a subtitle'],
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
  },
  badgeType: {
    type: String,
    enum: ['HOT', 'NEW', 'EXPERT', 'LATEST', ''],
    default: '',
  },
  duration: {
    type: Number,
    default: 30,
    min: [1, 'Duration must be at least 1 minute'],
  },
  totalQuestions: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalMarks: {
    type: Number,
    default: 0,
    min: 0,
  },
  instructions: {
    type: String,
    default: '',
    trim: true,
  },
  examSections: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      default: 30,
      min: 1,
    },
    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },
  }],
  
  // Dynamic CMS Block Builder Field
  sections: [{
    type: {
      type: String,
      required: true,
      enum: [
        'overview', 
        'examPattern', 
        'cutoff', 
        'strategy', 
        'syllabus', 
        'topics', 
        'faq', 
        'resources', 
        'features', 
        'cta'
      ]
    },
    title: { type: String },
    content: { type: mongoose.Schema.Types.Mixed } // Accepts custom JSON shapes per block
  }],

  status: {
    type: String,
    enum: ['active', 'draft', 'closed'],
    default: 'active',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Create indexes for text search
mockTestSchema.index({ title: 'text', category: 'text' });

module.exports = mongoose.model('MockTest', mockTestSchema);
