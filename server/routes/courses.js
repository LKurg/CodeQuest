const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Create a new course
router.post("/", async (req, res, next) => {
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

// Get all courses
router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
});

// Get a specific course by ID
// Get a specific course by ID
router.get("/:courseId", async (req, res, next) => {
    try {
      const course = await Course.findById(req.params.courseId); // BUG: Using req.params.id instead of req.params.courseId
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  });

// Update a course by ID
router.put("/:id", async (req, res, next) => {
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

// Delete a course by ID
router.delete("/:id", async (req, res, next) => {
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
