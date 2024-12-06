const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();
const mongoose = require('mongoose');



const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Log the value of JWT_SECRET to ensure it's being loaded correctly
console.log('JWT_SECRET:', JWT_SECRET);

// Register a new user
router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save to the database
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
});

// Enroll a user in a course
router.post('/enroll/:courseId', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.id; // Now this will be available from the middleware
        const { courseId } = req.params;

        // Verify the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is already enrolled
        const isAlreadyEnrolled = user.enrolledCourses.some(
            enroll => enroll.courseId.toString() === courseId
        );

        if (isAlreadyEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Enroll the user in the course
        user.enrolledCourses.push({ 
            courseId, 
            enrolledAt: new Date(),
            progress: { 
                isEnrolled: true,
                startedAt: new Date()
            } 
        });

        await user.save();

        res.status(201).json({ 
            message: 'Enrolled successfully', 
            enrolledCourses: user.enrolledCourses.map(course => course.courseId)
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        next(error);
    }
});


// Login a user
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Log the payload before signing the token to verify it's correct
        console.log('User Payload:', { id: user._id, email: user.email });

        // Sign the JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
});

// Logout a user (not much to do in this route for now)
router.post('/logout', (req, res, next) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
});
router.post('/progress', authMiddleware, async (req, res, next) => {
    const userId = req.user.id; // Extract user ID from authMiddleware
    const { courseId, currentLesson, completedLessons } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Convert IDs to ObjectId for consistency
      const currentLessonObjectId = new mongoose.Types.ObjectId(currentLesson);
      const completedLessonsObjectIds = completedLessons.map(id => new mongoose.Types.ObjectId(id));
  
      // Check if progress exists for the course
      const progress = user.progress.find(p => p.courseId.toString() === courseId);
  
      if (progress) {
        // Update existing progress
        progress.currentLesson = currentLessonObjectId;
        progress.completedLessons = Array.from(
          new Set([...progress.completedLessons.map(id => id.toString()), ...completedLessonsObjectIds])
        ); // Avoid duplicate lesson entries
        progress.lastAccessed = new Date();
      } else {
        // Create new progress for the course
        user.progress.push({
          courseId,
          currentLesson: currentLessonObjectId,
          completedLessons: completedLessonsObjectIds,
        });
      }
  
      // Save the updated user progress
      await user.save();
  
      res.status(200).json({ message: 'Progress updated successfully', progress: user.progress });
    } catch (error) {
      next(error); // Pass errors to global error handler
    }
  });
  
  router.get('/progress/:courseId', authMiddleware, async (req, res, next) => {
    const userId = req.user.id; // Extract user ID from authMiddleware
    const { courseId } = req.params; // Extract course ID from URL params
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Find progress for the specified course
      const existingProgress = user.progress.find((p) => p.courseId.toString() === courseId);
  
      // If no progress exists, return a default progress object
      const progress = existingProgress || {
        courseId,
        currentLesson: null, // Default for current lesson
        completedLessons: [], // Default for completed lessons
        lastAccessed: null, // Optional: add default lastAccessed
      };
  
      res.status(200).json(progress);
    } catch (error) {
      next(error); // Pass errors to global error handler
    }
  });
  
// Save quiz results
router.post('/quiz-results', async (req, res, next) => {
    const { userId, courseId, quizId, score } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.quizResults.push({ courseId, quizId, score });
        await user.save();
        res.status(200).json({ message: 'Quiz result saved successfully', quizResults: user.quizResults });
    } catch (error) {
        next(error);
    }
});
// Get enrolled courses for a user
router.get('/enrolled-courses', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Find the user and populate the enrolled courses
        const user = await User.findById(userId)
            .populate({
                path: 'enrolledCourses.courseId',
                model: 'Course' // Assuming your Course model is named 'Course'
            });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Map the enrolled courses to include course details
        const enrolledCourses = user.enrolledCourses.map(enrollment => ({
            course: enrollment.courseId,
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress
        }));

        res.status(200).json(enrolledCourses);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        next(error);
    }
});

// Get quiz results of a user for a specific course
router.get('/quiz-results/:userId/:courseId', async (req, res, next) => {
    const { userId, courseId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const quizResults = user.quizResults.filter((qr) => qr.courseId.toString() === courseId);
        res.status(200).json(quizResults);
    } catch (error) {
        next(error);
    }
});

// Update streak (track consecutive days of activity)
router.post('/streak', async (req, res, next) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const today = new Date().toISOString().split('T')[0];
        const lastActivity = new Date(user.streak.lastActivity).toISOString().split('T')[0];

        if (today === lastActivity) {
            // Activity already logged today
            res.status(200).json({ message: 'Streak already updated today', streak: user.streak });
        } else if (new Date(today) - new Date(lastActivity) === 86400000) {
            // Increment streak if consecutive day
            user.streak.days += 1;
        } else {
            // Reset streak if not consecutive
            user.streak.days = 1;
        }

        user.streak.lastActivity = new Date();
        await user.save();
        res.status(200).json({ message: 'Streak updated successfully', streak: user.streak });
    } catch (error) {
        next(error);
    }
});

// Get streak of a user
router.get('/streak/:userId', async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user.streak);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
