const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const authMiddleware = require('../middleware/auth'); // Import the auth middleware
const User = require('../models/User');
// Create a new course (protected route)
router.post("/", authMiddleware, async (req, res, next) => {
   try {
     const { title, description, sections } = req.body;
     
     // Validate input
     if (!title || !description) {
       return res.status(400).json({ message: "Title and description are required." });
     }
     
     // Create and save the course
     const newCourse = new Course({ title, description, sections });
     const savedCourse = await newCourse.save();
     res.status(201).json(savedCourse);
   } catch (error) {
     next(error);
   }
});

// Get all courses (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get the user's ID from the authentication middleware
    const userId = req.user.id;

    // First, find the user to get their enrolled courses
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a set of enrolled course IDs for quick lookup
    const enrolledCourseIds = new Set(
      user.enrolledCourses.map(ec => ec.courseId.toString())
    );

    // Fetch courses and mark enrollment status
    const courses = await Course.aggregate([
      {
        $addFields: {
          isEnrolled: {
            $in: [{ $toString: '$_id' }, Array.from(enrolledCourseIds)]
          }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          sections: 1,
          isEnrolled: 1
        }
      }
    ]);

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});
// Get a specific course by ID (protected route)
router.get("/:courseId", authMiddleware, async (req, res, next) => {
   try {
     const course = await Course.findById(req.params.courseId);
     
     if (!course) {
       return res.status(404).json({ message: "Course not found." });
     }
     res.status(200).json(course);
   } catch (error) {
     next(error);
   }
});

// Update a course by ID (protected route)
router.put("/:id", authMiddleware, async (req, res, next) => {
   try {
     const { title, description, sections } = req.body;
     const updatedCourse = await Course.findByIdAndUpdate(
       req.params.id,
       { title, description, sections },
       { new: true, runValidators: true }
     );
     
     if (!updatedCourse) {
       return res.status(404).json({ message: "Course not found." });
     }
     res.status(200).json(updatedCourse);
   } catch (error) {
     next(error);
   }
});

// Delete a course by ID (protected route)
router.delete("/:id", authMiddleware, async (req, res, next) => {
   try {
     const deletedCourse = await Course.findByIdAndDelete(req.params.id);
     if (!deletedCourse) {
       return res.status(404).json({ message: "Course not found." });
     }
     res.status(200).json({ message: "Course deleted successfully." });
   } catch (error) {
     next(error);
   }
});

module.exports = router;