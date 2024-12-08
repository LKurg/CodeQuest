const mongoose = require('mongoose');


const StreakSchema = new mongoose.Schema({
    days: { type: Number, default: 0 }, 
    lastActivity: { type: Date, default: Date.now }, 
});

// Progress schema
const ProgressSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, // Current lesson being viewed
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Array of completed lessons
    lastAccessed: { type: Date, default: Date.now }, // Timestamp of the last access
});

// Quiz results schema
const QuizResultSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    quizId: { type: String, required: true }, // Unique ID for the quiz
    score: { type: Number, required: true }, // Score obtained in the quiz
    xpEarned: { type: Number, default: 0 }, // XP earned from the quiz
    attemptedAt: { type: Date, default: Date.now },
});

// Enrolled course schema
const EnrolledCourseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: {
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Tracks completed lessons
        currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, // Current lesson being viewed
    },
    isEnrolled: { type: Boolean, default: false },
});

// Main user schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    enrolledCourses: [EnrolledCourseSchema], // Courses the user is enrolled in
    progress: [ProgressSchema], // Overall progress in all enrolled courses
    quizResults: [QuizResultSchema], // Results for quizzes taken
    streak: StreakSchema, // Streak tracking
    xp: { type: Number, default: 0 }, // Total XP earned
    createdAt: { type: Date, default: Date.now },
    recentActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecentActivity' }],
});
const RecentActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['lessonCompleted', 'quizTaken', 'courseEnrolled', 'streakAchieved'] },
    description: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional reference to a course
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, // Optional reference to a lesson
    xpEarned: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
});

const RecentActivity = mongoose.model('RecentActivity', RecentActivitySchema);
module.exports = RecentActivity;

module.exports = mongoose.model('User', UserSchema);
