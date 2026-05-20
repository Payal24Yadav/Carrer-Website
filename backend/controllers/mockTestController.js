const MockTest = require('../models/MockTest');

// @desc    Get all mock tests (with optional filters: search, category, status, featured)
// @route   GET /api/mock-tests
// @access  Public
exports.getMockTests = async (req, res) => {
  try {
    let query = {};

    // Search filter
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { subtitle: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Status filter (Active by default for public, customizable for admin panel)
    if (req.query.status) {
      query.status = req.query.status;
    } else if (req.query.admin !== 'true') {
      query.status = 'active'; // public only sees active tests
    }

    // Featured filter
    if (req.query.isFeatured) {
      query.isFeatured = req.query.isFeatured === 'true';
    }

    const sort = req.query.sort || '-createdAt';

    // Pagination
    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await MockTest.countDocuments(query);
      const mockTests = await MockTest.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        data: mockTests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } else {
      const mockTests = await MockTest.find(query).sort(sort);
      res.status(200).json({
        success: true,
        count: mockTests.length,
        data: mockTests,
      });
    }
  } catch (error) {
    console.error('Failed to get mock tests:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get mock test by slug
// @route   GET /api/mock-tests/slug/:slug
// @access  Public
exports.getMockTestBySlug = async (req, res) => {
  try {
    const mockTest = await MockTest.findOne({ slug: req.params.slug.toLowerCase() });

    if (!mockTest) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }

    res.status(200).json({
      success: true,
      data: mockTest,
    });
  } catch (error) {
    console.error('Failed to get mock test by slug:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get mock test by ID
// @route   GET /api/mock-tests/id/:id
// @access  Public/Admin
exports.getMockTestById = async (req, res) => {
  try {
    const mockTest = await MockTest.findById(req.params.id);

    if (!mockTest) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }

    res.status(200).json({
      success: true,
      data: mockTest,
    });
  } catch (error) {
    console.error('Failed to get mock test by ID:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new mock test (Admin only)
// @route   POST /api/mock-tests
// @access  Private/Admin
exports.createMockTest = async (req, res) => {
  try {
    const mockTest = await MockTest.create(req.body);
    res.status(201).json({
      success: true,
      data: mockTest,
    });
  } catch (error) {
    console.error('Failed to create mock test:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update mock test (Admin only)
// @route   PUT /api/mock-tests/:id
// @access  Private/Admin
exports.updateMockTest = async (req, res) => {
  try {
    const mockTest = await MockTest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mockTest) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }

    res.status(200).json({
      success: true,
      data: mockTest,
    });
  } catch (error) {
    console.error('Failed to update mock test:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete mock test (Admin only)
// @route   DELETE /api/mock-tests/:id
// @access  Private/Admin
exports.deleteMockTest = async (req, res) => {
  try {
    const mockTest = await MockTest.findByIdAndDelete(req.params.id);

    if (!mockTest) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Mock test deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete mock test:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
