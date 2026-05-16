const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  fees: { type: String, required: true }, // Display string e.g. "₹2.5L - 8L"
  minFees: { type: Number }, // For sorting/filtering
  rating: { type: Number, default: 0 },
  placementPercentage: { type: Number, default: 0 },
  highestPackage: { type: String },
  averagePackage: { type: String },
  ownershipType: { type: String, enum: ['Private', 'Government'], default: 'Private' },
  degreeType: { type: [String], default: ['MBA'] }, // ['MBA', 'BTech', 'Law']
  courses: [{
    name: String,
    duration: String,
    fees: String,
    eligibility: String
  }],
  topRecruiters: [String],
  facilities: [String],
  eligibility: { type: String },
  admissionProcess: { type: String },
  ranking: { type: String },
  establishedYear: { type: Number },
  websiteUrl: { type: String },
  featured: { type: Boolean, default: false },
  faqs: [{
    question: String,
    answer: String
  }],
  reviews: [{
    userName: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  testimonials: [{
    name: String,
    role: String,
    message: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// Text search index
collegeSchema.index({ name: 'text', description: 'text', state: 'text', city: 'text' });

module.exports = mongoose.model('College', collegeSchema);
