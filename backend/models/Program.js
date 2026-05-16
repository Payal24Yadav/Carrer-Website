const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  universityName: { type: String, required: true },
  degreeType: { type: String, required: true }, // MBA, BBA, etc.
  grade: { type: String }, // A++, A+, etc.
  fees: { type: String, required: true }, // Display string
  minFees: { type: Number }, // For filtering
  duration: { type: String, required: true },
  eligibility: { type: String },
  rating: { type: Number, default: 0 },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  curriculum: [{
    semester: String,
    subjects: [String]
  }],
  careerOpportunities: [String],
  admissionProcess: { type: String },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Program', programSchema);
