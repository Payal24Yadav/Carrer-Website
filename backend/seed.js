const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Blog = require('./models/Blog');
const Job = require('./models/Job');
const College = require('./models/College');
const Program = require('./models/Program');
const Testimonial = require('./models/Testimonial');
const Inquiry = require('./models/Inquiry');
const News = require('./models/News');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerplatform');
    console.log('MongoDB Connected');

    // Clear existing data
    

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

    // Sample News
    await News.create([
      {
        title: "CAT 2026 Registration Portal Open - Key Deadlines and Eligibility",
        slug: "cat-2026-registration-portal-open",
        shortDescription: "The registration portal for the Common Admission Test (CAT) 2026 is officially live. Candidates can complete online applications until mid-September.",
        isBreakingNews: true,
        publishDate: new Date("2026-05-15"),
        fullContent: [
          {
            type: "Heading/Paragraph",
            sectionHeading: "Official Announcement for CAT 2026",
            sectionParagraph: "The official notification for the Common Admission Test (CAT) 2026 has been released by the coordinating Indian Institute of Management (IIM). The registration window is now active, allowing thousands of aspiring MBA candidates to register online through the official portal. It is critical for candidates to carefully review the eligibility criteria and key timelines before submitting their forms."
          },
          {
            type: "Heading/Paragraph",
            sectionHeading: "Eligibility Requirements",
            sectionParagraph: "Candidates must hold a Bachelor's Degree with at least 50% marks or equivalent CGPA (45% for SC, ST, and PwD categories) from a recognized university. Students currently in their final year of graduation are also eligible to apply, subject to fulfilling requirements upon admission."
          },
          {
            type: "Bullet Points List",
            listItems: [
              "Registration Commencement: May 15, 2026",
              "Registration Deadline: September 20, 2026 (5:00 PM IST)",
              "Admit Card Download: October 25, 2026 onwards",
              "CAT 2026 Exam Date: November 29, 2026 (Sunday)",
              "Result Declaration: Second week of January 2027"
            ]
          }
        ]
      },
      {
        title: "Amity Online MBA Fall 2026 Cohort Admissions Active",
        slug: "amity-online-mba-fall-2026-admissions",
        shortDescription: "Amity University Online has commenced direct admissions for its highly ranked UGC-approved Online MBA programs with specialized data science options.",
        isBreakingNews: false,
        publishDate: new Date("2026-05-12"),
        fullContent: [
          {
            type: "Heading/Paragraph",
            sectionHeading: "Fall 2026 Admissions Open",
            sectionParagraph: "Amity University Online, India's leading digital degree provider, is officially accepting applications for its flagship 2-year Online MBA program for the Fall 2026 session. This degree is fully recognized by the UGC-DEB and offers robust specializations tailored for modern high-growth industries."
          },
          {
            type: "Bullet Points List",
            listItems: [
              "UGC-DEB approved 2-year business administration degree.",
              "Specializations in Data Science, Digital Marketing, and Finance.",
              "Immersive virtual classroom platform with global mentorship sessions.",
              "100% placement support and regular corporate networking masterclasses."
            ]
          }
        ]
      },
      {
        title: "NEET PG 2026 Revised Entrance Exam Schedule Released",
        slug: "neet-pg-2026-revised-exam-schedule-released",
        shortDescription: "The National Board of Examinations (NBE) has released updated schedules and key guidelines for the NEET PG 2026 medical entrance tests.",
        isBreakingNews: true,
        publishDate: new Date("2026-05-10"),
        fullContent: [
          {
            type: "Heading/Paragraph",
            sectionHeading: "Important Notice for NEET PG Candidates",
            sectionParagraph: "The National Board of Examinations in Medical Sciences (NBEMS) has published the official revised timeline for the National Eligibility cum Entrance Test for Post-Graduates (NEET PG) 2026. The revision was undertaken to accommodate request requests from candidates and streamline hospital internships schedules."
          },
          {
            type: "Bullet Points List",
            listItems: [
              "Revised Exam Date: June 21, 2026 (Sunday)",
              "Admit Card Issuance: June 15, 2026",
              "Internship Cutoff Date: August 15, 2026",
              "Official Web Updates: candidates are advised to verify schedules only on natboard.edu.in"
            ]
          }
        ]
      },
      {
        title: "LPUNEST 2026 Phase II Registration Officially Begins",
        slug: "lpunest-2026-phase-2-registration-begins",
        shortDescription: "Apply for the LPU Scholarship Entrance Test (LPUNEST) Phase II. Eligible applicants can secure up to 50% tuition scholarship waivers.",
        isBreakingNews: false,
        publishDate: new Date("2026-05-08"),
        fullContent: [
          {
            type: "Heading/Paragraph",
            sectionHeading: "LPUNEST Phase II Registration Active",
            sectionParagraph: "Lovely Professional University has opened registrations for LPUNEST Phase II entrance examinations. This exam serves as both an admission gate and a major avenue for prospective students to earn up to 50% academic scholarships based on merit performance."
          },
          {
            type: "Bullet Points List",
            listItems: [
              "Available Tracks: Engineering, Management, Design, and Law.",
              "Scholarships awarded up to ₹1.5 Lakhs per annum based on score brackets.",
              "Flexible home-proctored online testing slots are available for students.",
              "Application Deadline: June 5, 2026"
            ]
          }
        ]
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
