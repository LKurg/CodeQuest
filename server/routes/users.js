const express = require('express');
const { User } = require('../models/User');



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();
const mongoose = require('mongoose');
const { logRecentActivity } = require('../services/activityService');



const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


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

router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; 

 
        const user = await User.findById(userId).select('xp streak');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            xp: user.xp || 0,
            streak: user.streak?.days || 0, // Safely access nested properties
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});
router.get('/recent-activities', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch recent activities, populated with course and lesson details
        const activities = await RecentActivity.find({ userId })
            .sort({ timestamp: -1 }) // Sort by most recent first
            .limit(20) // Limit to 20 recent activities
            .populate('courseId', 'title') // Populate course titles
            .populate('lessonId', 'title'); // Populate lesson titles

        // Transform for frontend
        const formattedActivities = activities.map(activity => ({
            id: activity._id,
            type: activity.type,
            description: activity.description,
            courseTitle: activity.courseId ? activity.courseId.title : null,
            lessonTitle: activity.lessonId ? activity.lessonId.title : null,
            xpEarned: activity.xpEarned,
            timestamp: activity.timestamp,
            relativeTime: getRelativeTime(activity.timestamp),
        }));

        res.json(formattedActivities);
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({ message: 'Failed to fetch recent activities' });
    }
});

// Helper function for relative time
function getRelativeTime(timestamp) {
    const now = new Date();
    const diffInMilliseconds = now - timestamp;
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${Math.round(diffInMinutes)} minutes ago`;
    if (diffInHours < 24) return `${Math.round(diffInHours)} hours ago`;
    return `${Math.round(diffInDays)} days ago`;
}

router.get('/detailed-progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch all enrolled courses with progress
        const enrolledCourses = await Promise.all(user.progress.map(async (progress) => {
            const course = await Course.findById(progress.courseId).populate({
                path: 'sections',
                populate: { path: 'lessons' }
            });

            if (!course) return null;

            // Calculate total and completed lessons
            const totalLessons = course.sections.reduce(
                (count, section) => count + section.lessons.length, 
                0
            );
            const completedLessons = progress.completedLessons.length;
            const progressPercentage = ((completedLessons / totalLessons) * 100).toFixed(2);

            return {
                _id: course._id,
                title: course.title,
                progressPercentage: parseFloat(progressPercentage),
                completedLessons,
                totalLessons
            };
        })).then(courses => courses.filter(Boolean));

        // Calculate overall progress
        const overallProgress = enrolledCourses.length > 0
            ? (enrolledCourses.reduce((sum, course) => sum + course.progressPercentage, 0) / enrolledCourses.length).toFixed(2)
            : 0;

        // Dynamically calculate skill progress based on completed courses
        const skillProgress = await calculateSkillProgress(user, enrolledCourses);

        // Dynamically generate achievements
        const achievements = await generateAchievements(user, enrolledCourses);

        // Prepare final response
        const response = {
            courses: enrolledCourses,
            overallProgress: parseFloat(overallProgress),
            totalCoursesCompleted: enrolledCourses.filter(course => course.progressPercentage === 100).length,
            totalXP: user.xp || 0,
            skillProgress,
            achievements
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching detailed progress:', error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to calculate skill progress dynamically
async function calculateSkillProgress(user, enrolledCourses) {
    // This could be expanded to use more sophisticated tracking
    const skillMap = {
        'Python': ['Learn Python'],
        'JavaScript': ['JavaScript Fundamentals'],
        'React': ['React Basics']
    };

    const skillProgress = Object.entries(skillMap).map(([skill, courseTitles]) => {
        const relevantCourses = enrolledCourses.filter(course => 
            courseTitles.includes(course.title)
        );

        const averageProgress = relevantCourses.length > 0
            ? relevantCourses.reduce((sum, course) => sum + course.progressPercentage, 0) / relevantCourses.length
            : 0;

        return {
            name: skill,
            percentage: Math.round(averageProgress)
        };
    });

    return skillProgress;
}

// Helper function to generate achievements dynamically
async function generateAchievements(user, enrolledCourses) {
    const achievements = [];

    // Achievement for first course completion
    if (enrolledCourses.some(course => course.progressPercentage === 100)) {
        achievements.push({
            title: 'Course Completer',
            description: 'Completed your first course',
            dateEarned: new Date(),
            icon: 'faTrophy'
        });
    }

    // Achievement for reaching certain XP milestones
    const xpMilestones = [
        { threshold: 100, title: 'Beginner Learner', icon: 'faBook' },
        { threshold: 500, title: 'Intermediate Scholar', icon: 'faBookOpen' },
        { threshold: 1000, title: 'Advanced Learner', icon: 'faGraduationCap' }
    ];

    const xpAchievement = xpMilestones.find(milestone => 
        user.xp >= milestone.threshold
    );

    if (xpAchievement) {
        achievements.push({
            title: xpAchievement.title,
            description: `Reached ${xpAchievement.threshold} XP`,
            dateEarned: new Date(),
            icon: xpAchievement.icon
        });
    }

    return achievements;
}
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


router.post('/update-xp', authMiddleware, async (req, res) => {
    const { xpToAdd, courseId, quizId } = req.body;
    console.log('Update XP Request:', { 
        userId: req.user?.id, 
        xpToAdd, 
        courseId, 
        quizId 
    });

    try {
        if (!req.user || !req.user.id) {
            console.error('No authenticated user found');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const userId = req.user.id;

        // Validate userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid user ID:', userId);
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Update XP for the authenticated user
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { xp: xpToAdd } }, // Increment the XP by xpToAdd
            { new: true } // Return the updated document
        );

        if (!user) {
            console.error('User not found for ID:', userId);
            return res.status(404).json({ error: 'User not found' });
        }

        // Log the updated user details
        console.log('Updated User XP:', user.xp);

        // Send success response
        res.status(200).json({ message: 'XP updated successfully', xp: user.xp });
    } catch (error) {
        console.error('XP Update Error:', error);
        res.status(500).json({ error: error.message });
    }
});


// Helper function to check consecutive day activity
function isConsecutiveDay(lastActivity) {
  const today = new Date();
  const last = new Date(lastActivity);
  const oneDayAgo = new Date(today);
  oneDayAgo.setDate(today.getDate() - 1);

  return (
    last.getFullYear() === oneDayAgo.getFullYear() &&
    last.getMonth() === oneDayAgo.getMonth() &&
    last.getDate() === oneDayAgo.getDate()
  );
}

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Login attempt failed: No user found with email ${email}`);
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login attempt failed: Incorrect password for email ${email}`);
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Log successful login attempt
        console.log(`Successful login for user: ${user.email}, Role: ${user.role}`);

        // Sign the JWT token with additional user information
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role, // Include user role
                name: user.name // Include other user details as needed
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Send back user data along with the token
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
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
router.get('/progress', authMiddleware, async (req, res) => {
    try {
        console.log('Request received to /progress');
        const user = await User.findById(req.user.id);
        if (!user) {
          
            return res.status(404).json({ error: 'User not found' });
        }
     

        // Populate progress with full course, sections, and lessons
        const populatedProgress = await Promise.all(user.progress.map(async (progress) => {
            try {
             

                // Fetch course with sections and lessons
                const course = await Course.findById(progress.courseId)
                    .populate({
                        path: 'sections',
                        populate: {
                            path: 'lessons'
                        }
                    });

                if (!course) {
                    console.log('Course not found for ID:', progress.courseId);
                    return null;
                }

                console.log('Course found:', course.title);

                // Calculate total lessons and completed lessons
                const totalLessons = course.sections.reduce(
                    (count, section) => count + section.lessons.length,
                    0
                );

                const completedLessons = progress.completedLessons.length;

                // Progress percentage
                const progressPercentage = ((completedLessons / totalLessons) * 100).toFixed(2);

                // Determine the next lesson
                let nextLesson = null;
                const completedLessonsSet = new Set(progress.completedLessons.map(id => id.toString()));

                for (const section of course.sections) {
                    for (const lesson of section.lessons) {
                        if (!completedLessonsSet.has(lesson._id.toString())) {
                            nextLesson = lesson;
                            break;
                        }
                    }
                    if (nextLesson) break;
                }

                return {
                    courseId: course._id,
                    courseTitle: course.title,
                    totalLessons,
                    completedLessons,
                    progressPercentage,
                    nextLesson: nextLesson
                        ? {
                              _id: nextLesson._id,
                              title: nextLesson.title
                          }
                        : null, // No next lesson means course is fully completed
                };
            } catch (err) {
                console.error('Error processing progress for courseId:', progress.courseId, err);
                return null;
            }
        }));

        // Filter out any null results
        const filteredProgress = populatedProgress.filter(p => p !== null);
      

        res.status(200).json(filteredProgress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: error.message });
    }
});

  
  // GET /api/users/progress
  router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

router.get('/active-courses', authMiddleware, async (req, res) => {
    try {
      // Access the authenticated user's ID from the auth middleware
      const userId = req.user._id;
  
      // Fetch user data with enrolled courses and related course details
      const user = await User.findById(userId).populate({
        path: "enrolledCourses.courseId", // Populate course details
        populate: {
          path: "sections.lessons", // Populate lessons within sections
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const activeCourses = user.enrolledCourses.map((course) => {
        const completedLessons = course.progress?.completedLessons || [];
        const allLessons =
          course.courseId?.sections?.flatMap((section) => section.lessons) || [];
  
        const lastCompletedLesson =
          completedLessons[completedLessons.length - 1]; // Latest completed lesson
  
        const currentProgressIndex = allLessons.indexOf(lastCompletedLesson) + 1;
  
        const currentProgress =
          currentProgressIndex < allLessons.length
            ? allLessons[currentProgressIndex]
            : null; // Next lesson ID or null if all completed
  
        return {
          courseId: course.courseId?._id || null,
          courseTitle: course.courseId?.title || "Untitled",
          currentProgress,
          completedLessons,
        };
      });
  
      res.status(200).json({ activeCourses });
    } catch (error) {
      console.error("Error fetching active courses:", error);
      res
        .status(500)
        .json({ message: "Error fetching active courses", error: error.message });
    }
  });
  
  
  

module.exports = router;
