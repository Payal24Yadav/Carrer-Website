const mongoose = require('mongoose');

const collegePartnerSchema = new mongoose.Schema({
  instituteName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  designation: { type: String, required: true },
  officialEmail: { type: String, required: true },
  phone: { type: String, required: true },
  cityState: { type: String, required: true },
  coursesOffered: { type: String, required: true },
  annualIntake: { type: String },
  leadTypeRequired: { type: String },
  additionalRequirements: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CollegePartner', collegePartnerSchema);
