const mongoose = require("mongoose");

// Lesson schema
const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // HTML content for the lesson
});

// Section schema
const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema], // Array of lessons
});

// Course schema
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // HTML content for the course
  sections: [SectionSchema], // Array of sections
  createdAt: { type: Date, default: Date.now },
});

// Export Course model
const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
