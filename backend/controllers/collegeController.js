const College = require('../models/College');

// @desc    Get all colleges with advanced filters
// @route   GET /api/colleges
exports.getColleges = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // 1. Search (Name, Location, State)
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { city: { $regex: req.query.search, $options: 'i' } },
        { state: { $regex: req.query.search, $options: 'i' } },
        { 'courses.name': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // 2. Filters
    if (req.query.state) query.state = req.query.state;
    if (req.query.city) query.city = req.query.city;
    if (req.query.ownershipType) query.ownershipType = req.query.ownershipType;
    if (req.query.degreeType) query.degreeType = { $in: [req.query.degreeType] };
    if (req.query.rating) query.rating = { $gte: parseFloat(req.query.rating) };
    if (req.query.placementPercentage) query.placementPercentage = { $gte: parseInt(req.query.placementPercentage) };
    
    // Fees filter (assuming minFees is stored for range filtering)
    if (req.query.maxFees) {
      query.minFees = { $lte: parseInt(req.query.maxFees) };
    }

    // 3. Sort
    let sortQuery = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'rating': sortQuery = { rating: -1 }; break;
        case 'fees': sortQuery = { minFees: 1 }; break;
        case 'placement': sortQuery = { placementPercentage: -1 }; break;
        case 'az': sortQuery = { name: 1 }; break;
        case 'newest': sortQuery = { createdAt: -1 }; break;
      }
    }

    const total = await College.countDocuments(query);
    const colleges = await College.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: colleges,
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

// @desc    Get single college by slug
// @route   GET /api/colleges/:slug
exports.getCollegeBySlug = async (req, res) => {
  try {
    const college = await College.findOne({ slug: req.params.slug });
    if (!college) return res.status(404).json({ message: 'College not found' });
    res.json({ success: true, data: college });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get college by ID (Admin)
exports.getCollegeById = async (req, res) => {
    try {
      const college = await College.findById(req.params.id);
      if (!college) return res.status(404).json({ message: 'College not found' });
      res.json({ success: true, data: college });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// @desc    Create college
exports.createCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({ success: true, data: college });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Slug must be unique' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update college
exports.updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!college) return res.status(404).json({ message: 'College not found' });
    res.json({ success: true, data: college });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete college
exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return res.status(404).json({ message: 'College not found' });
    res.json({ success: true, message: 'College deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
