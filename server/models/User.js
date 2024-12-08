const mongoose = require('mongoose');

// Streak Schema
const StreakSchema = new mongoose.Schema({
    days: { type: Number, default: 0 }, 
    lastActivity: { type: Date, default: Date.now }, 
});

// Progress schema
const ProgressSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, 
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    lastAccessed: { type: Date, default: Date.now },
});

// Quiz results schema
const QuizResultSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    quizId: { type: String, required: true }, 
    score: { type: Number, required: true }, 
    xpEarned: { type: Number, default: 0 }, 
    attemptedAt: { type: Date, default: Date.now },
});

// Enrolled course schema
const EnrolledCourseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: {
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
        currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    },
    isEnrolled: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    enrolledCourses: [EnrolledCourseSchema],
    progress: [ProgressSchema],
    quizResults: [QuizResultSchema],
    streak: StreakSchema,
    xp: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'superAdmin'], 
        default: 'user' // Default role is 'user'
    }
});



const User = mongoose.model('User', UserSchema);

module.exports = { User };
