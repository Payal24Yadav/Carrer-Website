const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  mockTestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockTest',
    required: [true, 'Please select a mock test'],
  },
  question: {
    type: String,
    required: [true, 'Please provide the question'],
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator(options) {
        return Array.isArray(options) && options.length === 4 && options.every(Boolean);
      },
      message: 'Please provide exactly 4 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Please provide the correct answer'],
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    default: '',
    trim: true,
  },
  section: {
    type: String,
    default: 'General',
    trim: true,
  },
  marks: {
    type: Number,
    default: 1,
  },
  negativeMarks: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

questionSchema.index({ mockTestId: 1, section: 1, createdAt: 1 });

module.exports = mongoose.model('Question', questionSchema);
