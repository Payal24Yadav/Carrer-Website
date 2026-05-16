const Program = require('../models/Program');

// @desc    Get all programs with filters
// @route   GET /api/programs
exports.getPrograms = async (req, res) => {
  try {
    const { search, grade, courseType, duration, sort, page = 1, limit = 9 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { universityName: { $regex: search, $options: 'i' } }
      ];
    }

    if (grade) query.grade = grade;
    if (courseType) query.degreeType = courseType;
    if (duration) query.duration = duration;

    // Fees filtering logic
    if (req.query.maxFees) {
        query.minFees = { $lte: parseInt(req.query.maxFees) };
    }

    let sortQuery = { createdAt: -1 };
    if (sort) {
      if (sort === 'fees') sortQuery = { minFees: 1 };
      if (sort === 'rating') sortQuery = { rating: -1 };
    }

    const total = await Program.countDocuments(query);
    const programs = await Program.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: programs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single program
// @route   GET /api/programs/:id
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create program
exports.createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update program
exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete program
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json({ success: true, message: 'Program deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
