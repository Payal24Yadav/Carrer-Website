const Blog = require('../models/Blog');
const Job = require('../models/Job');
const College = require('../models/College');
const Inquiry = require('../models/Inquiry');
const Testimonial = require('../models/Testimonial');
const CollegePartner = require('../models/CollegePartner');
const ConsultantPartner = require('../models/ConsultantPartner');

// @desc    Get dashboard stats
// @route   GET /api/stats
exports.getStats = async (req, res) => {
  try {
    const [blogs, jobs, colleges, inquiries, testimonials, collegePartners, consultantPartners] = await Promise.all([
      Blog.countDocuments(),
      Job.countDocuments(),
      College.countDocuments(),
      Inquiry.countDocuments(),
      Testimonial.countDocuments(),
      CollegePartner.countDocuments(),
      ConsultantPartner.countDocuments(),
    ]);

    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug category createdAt');

    res.json({
      success: true,
      data: {
        counts: { blogs, jobs, colleges, inquiries, testimonials, collegePartners, consultantPartners },
        recentInquiries,
        recentBlogs,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
