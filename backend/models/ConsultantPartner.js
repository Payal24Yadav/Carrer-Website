const mongoose = require('mongoose');

const consultantPartnerSchema = new mongoose.Schema({
  firmName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  cityLocation: { type: String, required: true },
  experience: { type: String },
  specialization: { type: String },
  expectedLeads: { type: String },
  partnershipModel: { type: String },
  additionalNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ConsultantPartner', consultantPartnerSchema);
