const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lesson' },
    questions: [
      {
        questionText: { type: String, required: true },
        questionType: {
          type: String,
          enum: ['multipleChoice', 'coding'],
          required: true,
        },
        choices: [{ 
          _id: { type: mongoose.Schema.Types.ObjectId },
          text: String // Add this if you want to include text
        }],
        correctAnswer: { type: String },
      }
    ],
  });
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;