const mongoose = require('mongoose');

// Streak Schema
const StreakSchema = new mongoose.Schema({
    days: { type: Number, default: 0 }, 
    lastActivity: { type: Date, default: Date.now }, 
});

const SubscriptionSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['free', 'premium'], 
        default: 'free' // Default is 'free'
    },
    startedAt: { type: Date, default: Date.now }, // Date the subscription started
    expiresAt: { type: Date }, // Expiry date for premium users
});

// Progress schema
const ProgressSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    startTime: { type: Date }, 
    completionTime: { type: Date }, 
    totalTimeSpent: { type: Number, default: 0 }, 
    clicks: { type: Number, default: 0 },
});

const QuizResultSchema = new mongoose.Schema({
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    quizId: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to the Quiz model
        ref: 'Quiz', 
        required: true 
    },
    score: { 
        type: Number, 
        required: true 
    },
    xpEarned: { 
        type: Number, 
        default: 0 
    },
    attemptedAt: { 
        type: Date, 
        default: Date.now 
    },
    incorrectAnswers: [{
        questionId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Question',  // Assuming Question is another model or can be a reference to Quiz.questions
            required: true
        },
        userAnswer: { 
            type: String,  // Store the user's incorrect answer
            required: true
        },
        correctAnswer: { 
            type: String,  // Store the correct answer for comparison
            required: true
        },
        explanation: { 
            type: String,  // Optional explanation for the incorrect answer
            required: false
        },
    }],
    reattempts: { 
        type: Number, 
        default: 0  // Track number of reattempts for this quiz
    },
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

// User schema with reset token fields added
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordExpire: { type: Date }, // Expiration time for reset token
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    progress: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    }],
    quizResults: [QuizResultSchema], // Embed quiz results directly into the user schema
    streak: {
        days: { type: Number, default: 0 },
        lastActivity: { type: Date, default: Date.now },
    },
    xp: { type: Number, default: 0 }, // User's XP
    createdAt: { type: Date, default: Date.now },
    role: {
        type: String,
        enum: ['user', 'admin', 'superAdmin'],
        default: 'user'
    },
    subscription: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
