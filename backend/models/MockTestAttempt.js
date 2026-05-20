const mongoose = require('mongoose');

const mockTestAttemptSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please provide the user name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide the email'],
    lowercase: true,
    trim: true,
  },
  examSlug: {
    type: String,
    required: [true, 'Please provide the exam slug'],
    lowercase: true,
    trim: true,
  },
  examTitle: {
    type: String,
    default: '',
    trim: true,
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedAnswer: {
      type: Number,
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    marksAwarded: {
      type: Number,
      default: 0,
    },
  }],
  score: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    default: 0,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  wrongCount: {
    type: Number,
    default: 0,
  },
  unansweredCount: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

mockTestAttemptSchema.index({ examSlug: 1, submittedAt: -1 });
mockTestAttemptSchema.index({ email: 1, submittedAt: -1 });

module.exports = mongoose.model('MockTestAttempt', mockTestAttemptSchema);
