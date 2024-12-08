const express = require('express');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const authMiddleware = require('../middleware/auth');

const router = express.Router();



router.post('/create', authMiddleware, async (req, res) => {
  const { lessonId, questions } = req.body;

  if (!lessonId || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Invalid input. Please provide a valid lesson and questions.' });
  }

  try {
    const formattedQuestions = questions.map((question) => {
      if (question.questionType === 'multipleChoice') {
        console.log('Processing question:', question);
    
        if (!Array.isArray(question.choices) || question.choices.length === 0) {
          throw new Error('Multiple choice question must have choices.');
        }
    
        // Check for correct choice
        const correctChoice = question.choices.findIndex(choice => choice.isCorrect);
        console.log('Correct choice index:', correctChoice);
    
        if (correctChoice === -1) {
          throw new Error('At least one choice must be marked as correct.');
        }
    
        return {
          questionText: question.questionText,
          questionType: 'multipleChoice',
          choices: question.choices.map(choice => ({
            text: choice.text,
            isCorrect: choice.isCorrect,
          })),
          correctChoice: correctChoice.toString(), // Convert index to string
        };
      } else if (question.questionType === 'coding') {
        if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {
          throw new Error('Coding questions must have a valid correct answer.');
        }
    
        return {
          questionText: question.questionText,
          questionType: 'coding',
          choices: [],
          correctAnswer: question.correctAnswer,
        };
      } else {
        throw new Error('Unsupported question type.');
      }
    });
    

    const quiz = new Quiz({
      lessonId,
      questions: formattedQuestions,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




  router.get('/:lessonId', authMiddleware, async (req, res) => {
    try {
        console.log('Received lessonId:', req.params.lessonId);

        // Correct way to create ObjectId
        const lessonObjectId = new mongoose.Types.ObjectId(req.params.lessonId);

        // Attempt to find the quiz based on the lessonId
        const quiz = await Quiz.findOne({ 
            lessonId: lessonObjectId 
        });

        console.log('Quiz fetched from database:', quiz);

        if (!quiz) {
            return res.status(404).json({ error: 'No quiz found for this lesson' });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error('Quiz fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Submit quiz answers and compute score
router.post('/:quizId/submit', authMiddleware, async (req, res) => {
  const { quizId } = req.params;
  const { userId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach((question, index) => {
      const answer = answers[index];
      if (question.questionType === 'multipleChoice') {
        if (question.choices.find((choice) => choice.text === answer && choice.isCorrect)) {
          score += 1;
        }
      } else if (question.questionType === 'coding') {
        // Handle code verification logic here (e.g., compare answer with expected output)
        const isCorrect = verifyCodeAnswer(answer, question);
        if (isCorrect) score += 1;
      }
    });

    res.status(200).json({ message: 'Quiz submitted', score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to verify code answers (example)
const verifyCodeAnswer = (submittedCode, question) => {
  // You can implement more complex code verification logic here.
  return submittedCode === question.correctAnswer; // For simplicity
};

module.exports = router;
