const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');

// Progress schema
const ProgressSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, // Track the current lesson
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Array of completed lessons
    lastAccessed: { type: Date, default: Date.now }, // Timestamp of the last access
  });
  


// Quiz results schema
const QuizResultSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    quizId: { type: String, required: true }, // Unique ID for the quiz
    score: { type: Number, required: true },
    attemptedAt: { type: Date, default: Date.now },
});

// Streak schema
const StreakSchema = new mongoose.Schema({
    days: { type: Number, default: 0 }, // Consecutive days of activity
    lastActivity: { type: Date, default: Date.now }, // Timestamp of the last activity
});

const EnrolledCourseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: {
      completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Tracks completed lessons
      currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, // Current lesson being viewed
    },
    isEnrolled: { type: Boolean, default: false },
  });
  

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    enrolledCourses: [EnrolledCourseSchema],
    progress: [ProgressSchema], // Added progress as part of schema
    quizResults: [QuizResultSchema],
    streak: StreakSchema,
    createdAt: { type: Date, default: Date.now },
});





module.exports = mongoose.model('User', userSchema);
