const MockTestRegistration = require('../models/MockTestRegistration');

// @desc    Submit mock test registration
// @route   POST /api/mock-test-registrations
// @access  Public
exports.createMockTestRegistration = async (req, res) => {
  try {
    const registration = await MockTestRegistration.create(req.body);
    res.status(201).json({
      success: true,
      data: registration,
      message: 'Mock test registration submitted successfully!',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all mock test registrations
// @route   GET /api/mock-test-registrations
// @access  Private/Admin
exports.getMockTestRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.examTitle) {
      query.examTitle = req.query.examTitle;
    }

    if (req.query.search) {
      const search = { $regex: req.query.search, $options: 'i' };
      query.$or = [
        { examTitle: search },
        { fullName: search },
        { email: search },
        { phone: search },
        { location: search },
      ];
    }

    const [total, registrations, exams] = await Promise.all([
      MockTestRegistration.countDocuments(query),
      MockTestRegistration.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      MockTestRegistration.distinct('examTitle'),
    ]);

    res.json({
      success: true,
      data: registrations,
      exams: exams.sort(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete mock test registration
// @route   DELETE /api/mock-test-registrations/:id
// @access  Private/Admin
exports.deleteMockTestRegistration = async (req, res) => {
  try {
    const registration = await MockTestRegistration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    res.json({ success: true, message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
