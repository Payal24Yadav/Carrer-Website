const News = require('../models/News');

// @desc    Get all news (with optional pagination, search, and filtering)
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
  try {
    let query = {};

    // Search query via title or description regex
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { shortDescription: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const sort = req.query.sort || '-publishDate';

    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await News.countDocuments(query);
      const news = await News.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        data: news,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } else {
      const limit = parseInt(req.query.limit) || 10;
      const news = await News.find(query).sort(sort).limit(limit);

      res.status(200).json({
        success: true,
        count: news.length,
        data: news,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single news by slug
// @route   GET /api/news/:slug
// @access  Public
exports.getNewsBySlug = async (req, res) => {
  try {
    const newsItem = await News.findOne({ slug: req.params.slug });

    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.status(200).json({
      success: true,
      data: newsItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get news by ID
// @route   GET /api/news/id/:id
// @access  Public
exports.getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);

    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.status(200).json({
      success: true,
      data: newsItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create news (Admin only)
// @route   POST /api/news
// @access  Private
exports.createNews = async (req, res) => {
  try {
    const newsItem = await News.create(req.body);
    res.status(201).json({
      success: true,
      data: newsItem,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A news article with this slug already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update news
// @route   PUT /api/news/update/:id
// @access  Private
exports.updateNews = async (req, res) => {
  try {
    const newsItem = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.status(200).json({
      success: true,
      data: newsItem,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A news article with this slug already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete news
// @route   DELETE /api/news/delete/:id
// @access  Private
exports.deleteNews = async (req, res) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);

    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.status(200).json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
