const Question = require('../models/Question');
const MockTest = require('../models/MockTest');

const publicQuestionFields = 'question options section marks negativeMarks';

exports.getQuestionsForTest = async (req, res) => {
  try {
    const questions = await Question.find({ mockTestId: req.params.testId })
      .select(publicQuestionFields)
      .sort({ createdAt: 1 });

    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const query = {};
    if (req.query.mockTestId) query.mockTestId = req.query.mockTestId;

    const questions = await Question.find(query)
      .populate('mockTestId', 'title slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const mockTest = await MockTest.findById(req.body.mockTestId);
    if (!mockTest) return res.status(404).json({ success: false, message: 'Mock test not found' });

    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
