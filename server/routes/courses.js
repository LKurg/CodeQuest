const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { User } = require('../models/User');
const authMiddleware = require('../middleware/auth'); // Import the auth middleware



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

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Use findOne instead of findById if findById is not working
    const user = await User.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const enrolledCourseIds = user.enrolledCourses.map(ec => ec.courseId.toString());

    const courses = await Course.aggregate([
      {
        $addFields: {
          isEnrolled: {
            $in: [{ $toString: '$_id' }, enrolledCourseIds]
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
router.get("/:courseId/sections", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: "sections.lessons.quiz", // Populate quiz data for each lesson
      select: "title description", // Select relevant quiz fields
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const sections = course.sections; // Extract sections from the course
    res.status(200).json(sections); // Return only sections (without the full course details)
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ message: 'Error fetching sections', error: error.message });
  }
});

router.get("/:courseId/sections/:sectionId/lessons", authMiddleware, async (req, res) => {


  try {
    const { courseId, sectionId } = req.params;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Find the section by ID within the course
    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found." });
    }

    // Return the lessons of the found section
    res.status(200).json(section.lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Error fetching lessons', error: error.message });
  }
});



module.exports = router;