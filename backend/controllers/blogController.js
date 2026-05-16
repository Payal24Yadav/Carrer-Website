const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blogs
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: blogs,
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

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
