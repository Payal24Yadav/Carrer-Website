const Internship = require('../models/Internship');

// @desc    Get all internships (with optional pagination, search, category, and status filters)
// @route   GET /api/internships
// @access  Public
exports.getInternships = async (req, res) => {
  try {
    let query = {};

    // Search query via regex on title, company name, or location
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { companyName: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
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
      query.status = 'active'; // default for public users
    }

    // Featured filter
    if (req.query.isFeatured) {
      query.isFeatured = req.query.isFeatured === 'true';
    }

    const sort = req.query.sort || '-createdAt';

    // If page parameter is present, return paginated results, otherwise simple array
    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await Internship.countDocuments(query);
      const internships = await Internship.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        data: internships,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } else {
      const limit = parseInt(req.query.limit) || 100;
      const internships = await Internship.find(query).sort(sort).limit(limit);

      res.status(200).json({
        success: true,
        count: internships.length,
        data: internships,
      });
    }
  } catch (error) {
    console.error('Failed to get internships:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
// @access  Public
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    console.error('Failed to get internship by ID:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create internship (Admin only)
// @route   POST /api/internships
// @access  Private/Admin
exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    console.error('Failed to create internship:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update internship (Admin only)
// @route   PUT /api/internships/:id
// @access  Private/Admin
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    console.error('Failed to update internship:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete internship (Admin only)
// @route   DELETE /api/internships/:id
// @access  Private/Admin
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete internship:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
