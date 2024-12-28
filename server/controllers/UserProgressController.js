
const { User } = require('../models/User');




const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Course = require('../models/Course');

require('dotenv').config();






const getUserProgress = async (req, res) => {
    try {
        console.log('User Progress');
        
        // Fetch the user by ID
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        // Process the progress array
        const populatedProgress = await Promise.all(user.progress.map(async (progress) => {
            try {
                // Fetch the course with sections and lessons
                const course = await Course.findById(progress.courseId)
                    .populate({
                        path: 'sections',
                        populate: { path: 'lessons' }
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
                const completedLessonsSet = new Set(progress.completedLessons.map(id => id.toString()));
                let nextLesson = null;

                for (const section of course.sections) {
                    for (const lesson of section.lessons) {
                        if (!completedLessonsSet.has(lesson._id.toString())) {
                            nextLesson = lesson;
                            break;
                        }
                    }
                    if (nextLesson) break;
                }

                // Return the structured data for the course
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
                        : null // If no next lesson, course is completed
                };
            } catch (err) {
                console.error('Error processing progress for courseId:', progress.courseId, err);
                return null; // Return null to continue processing other courses
            }
        }));

        // Filter out any null values that result from failed progress processing
        const filteredProgress = populatedProgress.filter(p => p !== null);

        // Respond with the user progress
        res.status(200).json(filteredProgress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: error.message });
    }
};

const postStreak=async(req,res,next)=>{
    const{userId}=req.body;

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

}
const getStreak=async(req,res,next)=>{
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user.streak);
    } catch (error) {
        next(error);
    }
}
const GetDetailedProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch all enrolled courses with progress
        console.log('User hahah:', user);
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

}
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

module.exports = { getUserProgress,postStreak ,getStreak,GetDetailedProgress};
