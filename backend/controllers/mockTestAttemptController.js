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
    const sectionMap = new Map();

    const getSectionScore = (sectionName) => {
      const key = sectionName || 'General';
      if (!sectionMap.has(key)) {
        sectionMap.set(key, {
          sectionName: key,
          score: 0,
          totalMarks: 0,
          correctCount: 0,
          wrongCount: 0,
          unansweredCount: 0,
          totalQuestions: 0,
        });
      }
      return sectionMap.get(key);
    };

    const gradedAnswers = questions.map((question) => {
      const sectionName = question.sectionName || question.section || 'General';
      const sectionScore = getSectionScore(sectionName);
      totalMarks += question.marks;
      sectionScore.totalMarks += question.marks;
      sectionScore.totalQuestions += 1;
      const selectedAnswer = submittedAnswers.has(String(question._id))
        ? submittedAnswers.get(String(question._id))
        : null;

      if (selectedAnswer === null || selectedAnswer === undefined || selectedAnswer === '') {
        unansweredCount += 1;
        sectionScore.unansweredCount += 1;
        return {
          questionId: question._id,
          selectedAnswer: null,
          correctAnswer: question.correctAnswer,
          status: 'skipped',
          isCorrect: false,
          marksAwarded: 0,
          sectionName,
        };
      }

      const numericAnswer = Number(selectedAnswer);
      const isCorrect = numericAnswer === question.correctAnswer;
      const marksAwarded = isCorrect ? question.marks : -Math.abs(question.negativeMarks || 0);

      if (isCorrect) correctCount += 1;
      else wrongCount += 1;
      if (isCorrect) sectionScore.correctCount += 1;
      else sectionScore.wrongCount += 1;

      score += marksAwarded;
      sectionScore.score += marksAwarded;
      return {
        questionId: question._id,
        selectedAnswer: numericAnswer,
        correctAnswer: question.correctAnswer,
        status: isCorrect ? 'correct' : 'wrong',
        isCorrect,
        marksAwarded,
        sectionName,
      };
    });

    const sectionScores = Array.from(sectionMap.values());
    const sectionWiseScore = sectionScores.map((section) => ({
      sectionName: section.sectionName,
      score: section.score,
      totalMarks: section.totalMarks,
      correctCount: section.correctCount,
      wrongCount: section.wrongCount,
      skippedCount: section.unansweredCount,
      totalQuestions: section.totalQuestions,
    }));

    const attempt = await MockTestAttempt.create({
      userName,
      email,
      examSlug: mockTest.slug,
      examTitle: mockTest.title,
      answers: gradedAnswers,
      score,
      totalScore: score,
      totalMarks,
      correctCount,
      wrongCount,
      unansweredCount,
      skippedCount: unansweredCount,
      sectionScores,
      sectionWiseScore,
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
        skippedCount: unansweredCount,
        sectionScores,
        sectionWiseScore,
        totalQuestions: questions.length,
        percentage: totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAttemptById = async (req, res) => {
  try {
    const attempt = await MockTestAttempt.findById(req.params.id)
      .populate('answers.questionId', 'question options explanation marks negativeMarks sectionName section');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    const data = attempt.toObject();
    data.answers = (data.answers || []).map((answer) => {
      const correctAnswer = answer.correctAnswer ?? answer.questionId?.correctAnswer ?? 0;
      const status = answer.status || (answer.selectedAnswer === null || answer.selectedAnswer === undefined
        ? 'skipped'
        : answer.isCorrect
        ? 'correct'
        : 'wrong');

      return { ...answer, correctAnswer, status };
    });
    const totalQuestions = data.answers.length;
    const score = data.totalScore ?? data.score ?? 0;
    const skippedCount = data.skippedCount ?? data.unansweredCount ?? 0;
    const sectionScores = data.sectionWiseScore?.length ? data.sectionWiseScore : (data.sectionScores || []).map((section) => ({
      ...section,
      skippedCount: section.skippedCount ?? section.unansweredCount ?? 0,
    }));

    res.json({
      success: true,
      data: {
        ...data,
        score,
        totalScore: score,
        skippedCount,
        unansweredCount: skippedCount,
        sectionScores,
        sectionWiseScore: sectionScores,
        totalQuestions,
        attemptedCount: Math.max(totalQuestions - skippedCount, 0),
        percentage: data.totalMarks > 0 ? Math.round((score / data.totalMarks) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
