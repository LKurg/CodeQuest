import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faBook, faSpinner } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header", "font", "size", "bold", "italic", "underline", "strike",
  "color", "background", "script", "list", "bullet", "indent", 
  "align", "blockquote", "code-block", "link", "image", "video"
];

const CreateCourse = () => {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    sections: [],
  });
  const [currentSection, setCurrentSection] = useState("");
  const [currentLesson, setCurrentLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addSection = () => {
    if (currentSection.trim() === "") return;
    setCourse((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: currentSection, lessons: [] }],
    }));
    setCurrentSection("");
  };

  const addLesson = (sectionIndex) => {
    if (currentLesson.trim() === "") return;
    const updatedSections = [...course.sections];
    updatedSections[sectionIndex].lessons.push({
      title: currentLesson,
      description: "",
    });
    setCourse({ ...course, sections: updatedSections });
    setCurrentLesson("");
  };

  const updateLessonContent = (sectionIndex, lessonIndex, content) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIndex].lessons[lessonIndex].description = content;
    setCourse({ ...course, sections: updatedSections });
  };

  const deleteSection = (indexToRemove) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== indexToRemove)
    }));
  };

  const deleteLesson = (sectionIndex, lessonIndex) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIndex].lessons.splice(lessonIndex, 1);
    setCourse({ ...course, sections: updatedSections });
  };

  const saveCourse = async () => {
    // Validate course before submission
    if (!course.title.trim()) {
      setErrorMessage("Course title is required");
      return;
    }

    setLoading(true);
    setSuccessMessage(""); // Clear any previous success messages
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Use axios for more comprehensive error handling
      const response = await axios.post("http://localhost:5000/api/courses", course, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Clear the form after successful submission
      setCourse({
        title: "",
        description: "",
        sections: [],
      });

      // Set success message with returned course data
      setSuccessMessage(`Course "${response.data.title}" created successfully!`);
      
      // Optional: You might want to add a way to redirect or refresh the course list
      console.log("Saved course:", response.data);
    } catch (error) {
      // More detailed error handling
      const errorMsg = error.response?.data?.message || 
                       error.message || 
                       "An unexpected error occurred";
      setErrorMessage(errorMsg);
      console.error("Error saving course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <FontAwesomeIcon icon={faBook} className="mr-2 text-teal-500" />
        Create a New Course
      </h1>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-2">Course Title *</label>
        <input
          type="text"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Enter course title (required)"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Course Description</label>
        <ReactQuill
          value={course.description}
          onChange={(value) => setCourse({ ...course, description: value })}
          modules={modules}
          formats={formats}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Sections</label>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={currentSection}
            onChange={(e) => setCurrentSection(e.target.value)}
            className="w-full p-2 border rounded mr-2"
            placeholder="Enter section title"
          />
          <button
            onClick={addSection}
            className="bg-teal-500 text-white px-4 py-2 rounded"
            disabled={!currentSection.trim()}
          >
            Add Section
          </button>
        </div>

        {course.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4 p-4 border rounded bg-gray-50 relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{section.title}</h3>
              <button 
                onClick={() => deleteSection(sectionIndex)}
                className="text-red-500 hover:text-red-700"
                title="Delete Section"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>

            {section.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="mb-2 p-2 border rounded bg-white relative">
                <button 
                  onClick={() => deleteLesson(sectionIndex, lessonIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Delete Lesson"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <input
                  type="text"
                  value={lesson.title}
                  onChange={(e) => {
                    const updatedLessons = [...section.lessons];
                    updatedLessons[lessonIndex].title = e.target.value;
                    const updatedSections = [...course.sections];
                    updatedSections[sectionIndex].lessons = updatedLessons;
                    setCourse({ ...course, sections: updatedSections });
                  }}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Lesson title"
                />
                <ReactQuill
                  value={lesson.description}
                  onChange={(value) =>
                    updateLessonContent(sectionIndex, lessonIndex, value)
                  }
                  modules={modules}
                  formats={formats}
                />
              </div>
            ))}

            <div className="flex items-center mt-2">
              <input
                type="text"
                value={currentLesson}
                onChange={(e) => setCurrentLesson(e.target.value)}
                className="w-full p-2 border rounded mr-2"
                placeholder="Enter lesson title"
              />
              <button
                onClick={() => addLesson(sectionIndex)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={!currentLesson.trim()}
              >
                Add Lesson
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveCourse}
        className={`px-6 py-2 rounded text-white ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600"
        }`}
        disabled={loading || !course.title.trim()}
      >
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        ) : (
          "Save Course"
        )}
      </button>
    </div>
  );
};

export default CreateCourse;