const CollegePartner = require('../models/CollegePartner');
const ConsultantPartner = require('../models/ConsultantPartner');

// College Partners
exports.createCollegePartner = async (req, res) => {
  try {
    const partner = await CollegePartner.create(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getCollegePartners = async (req, res) => {
  try {
    const partners = await CollegePartner.find().sort({ createdAt: -1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteCollegePartner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
    
    const partner = await CollegePartner.findByIdAndDelete(id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    res.json({ success: true, message: 'College partnership application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Consultant Partners
exports.createConsultantPartner = async (req, res) => {
  try {
    const partner = await ConsultantPartner.create(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getConsultantPartners = async (req, res) => {
  try {
    const partners = await ConsultantPartner.find().sort({ createdAt: -1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteConsultantPartner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'ID is required' });

    const partner = await ConsultantPartner.findByIdAndDelete(id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    res.json({ success: true, message: 'Consultant partnership application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
