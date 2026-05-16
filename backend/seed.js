const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Blog = require('./models/Blog');
const Job = require('./models/Job');
const College = require('./models/College');
const Program = require('./models/Program');
const Testimonial = require('./models/Testimonial');
const Inquiry = require('./models/Inquiry');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerpath');
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Blog.deleteMany();
    await Job.deleteMany();
    await College.deleteMany();
    await Program.deleteMany();
    await Testimonial.deleteMany();
    await Inquiry.deleteMany();

    // Admin User
    await User.create({
      name: 'Admin User',
      email: 'admin@career.com',
      password: 'admin123',
      role: 'admin'
    });

    // Sample Programs
    await Program.create([
      {
        title: "Online MBA in Data Science",
        slug: "online-mba-data-science",
        universityName: "Amity University Online",
        degreeType: "MBA",
        grade: "A++",
        fees: "₹2,50,000",
        minFees: 250000,
        duration: "2 Years",
        eligibility: "Bachelor's Degree in any discipline with 50% marks.",
        rating: 4.8,
        shortDescription: "Master business analytics and data-driven decision making with this UGC-approved MBA.",
        fullDescription: "The Online MBA in Data Science is a premier program designed for future leaders who want to leverage the power of data. This program combines core business management principles with advanced data science techniques.\n\nYou will learn from industry experts and world-class faculty through an immersive digital learning platform.",
        curriculum: [
          { semester: "Semester 1", subjects: ["Management Concepts", "Statistics for Business", "Financial Accounting"] },
          { semester: "Semester 2", subjects: ["Data Visualization", "Python for Data Science", "Marketing Management"] }
        ],
        careerOpportunities: ["Data Analyst", "Business Intelligence Manager", "Data Science Consultant"],
        admissionProcess: "1. Register Online\n2. Document Verification\n3. Fee Payment\n4. Batch Commencement",
        featured: true
      },
      {
        title: "Online BBA (General)",
        slug: "online-bba-general",
        universityName: "LPU Online",
        degreeType: "BBA",
        grade: "A+",
        fees: "₹1,20,000",
        minFees: 120000,
        duration: "3 Years",
        eligibility: "10+2 from a recognized board.",
        rating: 4.5,
        shortDescription: "Start your management career with a flexible and industry-aligned BBA program.",
        fullDescription: "The Online BBA program at LPU is designed to provide a strong foundation in business and management principles. It is ideal for students who want to start their own business or join corporate organizations.",
        curriculum: [
          { semester: "Semester 1", subjects: ["Principles of Management", "Business Communication", "Economics"] }
        ],
        careerOpportunities: ["Business Development Executive", "HR Assistant", "Marketing Coordinator"],
        admissionProcess: "Direct admission based on 10+2 marks.",
        featured: true
      }
    ]);

    // Colleges and other data can be re-seeded if needed, but I'll focus on the new ones
    console.log('✅ Database seeded with new modules!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
