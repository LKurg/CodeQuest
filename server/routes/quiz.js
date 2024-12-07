const express = require('express');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a quiz
router.post('/create', authMiddleware, async (req, res) => {
    const { lessonId, questions } = req.body;
  
    if (!lessonId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Invalid input. Please provide a valid lesson and questions.' });
    }
  
    try {
      // Validate and structure the questions
      const formattedQuestions = questions.map((question) => {
        // Validate each question type and structure
        if (question.questionType === 'multipleChoice') {
          if (!question.questionText || !question.choices || question.choices.length < 2 || question.correctChoice === undefined) {
            throw new Error('Invalid multiple choice question structure.');
          }
  
          // Format the multiple choice question
          return {
            questionText: question.questionText,
            questionType: 'multipleChoice',
            choices: question.choices.map(choice => ({
              text: choice.text,
              isCorrect: choice.isCorrect
            })),
            correctAnswer: question.correctChoice, // This could be the index of the correct answer
          };
        } else if (question.questionType === 'coding') {
          if (!question.questionText || !question.correctAnswer) {
            throw new Error('Invalid coding question structure.');
          }
  
          // Format the coding question
          return {
            questionText: question.questionText,
            questionType: 'coding',
            correctAnswer: question.correctAnswer, // This is the expected code or output
          };
        } else {
          throw new Error('Unsupported question type.');
        }
      });
  
      // Create the quiz with the validated questions
      const quiz = new Quiz({
        lessonId,
        questions: formattedQuestions,
      });
  
      await quiz.save();
      res.status(201).json({ message: 'Quiz created successfully', quiz });
  
    } catch (error) {
      console.error('Error creating quiz:', error);
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
