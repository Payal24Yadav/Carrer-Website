const MockTest = require('../models/MockTest');
const Question = require('../models/Question');
const MockTestAttempt = require('../models/MockTestAttempt');

exports.submitAttempt = async (req, res) => {
  try {
    const { userName, email, examSlug, answers = [] } = req.body;
    const mockTest = await MockTest.findOne({ slug: String(examSlug || '').toLowerCase() });

    if (!mockTest) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }

    const questions = await Question.find({ mockTestId: mockTest._id });
    const submittedAnswers = new Map(
      answers.map((answer) => [String(answer.questionId), answer.selectedAnswer])
    );

    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const gradedAnswers = questions.map((question) => {
      totalMarks += question.marks;
      const selectedAnswer = submittedAnswers.has(String(question._id))
        ? submittedAnswers.get(String(question._id))
        : null;

      if (selectedAnswer === null || selectedAnswer === undefined || selectedAnswer === '') {
        unansweredCount += 1;
        return { questionId: question._id, selectedAnswer: null, isCorrect: false, marksAwarded: 0 };
      }

      const numericAnswer = Number(selectedAnswer);
      const isCorrect = numericAnswer === question.correctAnswer;
      const marksAwarded = isCorrect ? question.marks : -Math.abs(question.negativeMarks || 0);

      if (isCorrect) correctCount += 1;
      else wrongCount += 1;

      score += marksAwarded;
      return { questionId: question._id, selectedAnswer: numericAnswer, isCorrect, marksAwarded };
    });

    const attempt = await MockTestAttempt.create({
      userName,
      email,
      examSlug: mockTest.slug,
      examTitle: mockTest.title,
      answers: gradedAnswers,
      score,
      totalMarks,
      correctCount,
      wrongCount,
      unansweredCount,
      submittedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: {
        attemptId: attempt._id,
        examTitle: mockTest.title,
        score,
        totalMarks,
        correctCount,
        wrongCount,
        unansweredCount,
        totalQuestions: questions.length,
        percentage: totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
