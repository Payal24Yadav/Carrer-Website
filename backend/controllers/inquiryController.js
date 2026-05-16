const Inquiry = require('../models/Inquiry');

// @desc    Submit inquiry
// @route   POST /api/inquiry
exports.createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, data: inquiry, message: 'Inquiry submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiry
exports.getInquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Inquiry.countDocuments();
    const inquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiry/:id
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiry/:id
exports.updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
