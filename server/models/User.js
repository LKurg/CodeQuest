const mongoose = require('mongoose');

// Progress schema
const ProgressSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    currentSection: { type: Number, default: 0 },
    completedSections: [Number], 
    lastAccessed: { type: Date, default: Date.now },
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
        sectionsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }], // Tracks completed sections
        isEnrolled: { type: Boolean, default: false },
    },
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
