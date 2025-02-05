import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faLayerGroup, 
  faFileAlt, 
  faPlus, 
  faCheckCircle, 
  faQuestionCircle,
  faChevronDown,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from '../Layout/AdminLayout';

const QuestionPreview = ({ question, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg mb-4 overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-grow">
          <p className="font-semibold text-gray-800 truncate">{question.questionText}</p>
          <span className="text-sm text-gray-500">
            {question.questionType === 'multipleChoice' ? 'Multiple Choice' : 'Coding'}
          </span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 mr-4"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          {question.questionType === 'multipleChoice' && (
            <div>
              <h4 className="font-semibold mb-2">Choices:</h4>
              {question.choices.map((choice, index) => (
            <div 
            key={index} 
            className={`p-2 rounded ${
              index === question.correctChoice 
                ? 'bg-green-100 border-2 border-green-300' 
                : 'bg-white'
            }`}
          >
            {choice}
            {index === question.correctChoice && (
              <span className="ml-2 text-green-600 font-bold">(Correct Answer)</span>
            )}
          </div>
          
              ))}
            </div>
          )}
          
          {question.questionType === 'coding' && (
            <div>
              <h4 className="font-semibold mb-2">Expected Output:</h4>
              <p className="bg-white p-2 rounded">{question.correctAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CreateQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    questionType: 'multipleChoice',
    choices: ['', '', '', ''],
    correctAnswer: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [token]);

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setSelectedSection('');
    setSelectedLesson('');
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleSectionSelect = async (sectionId) => {
    setSelectedSection(sectionId);
    setSelectedLesson('');
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${selectedCourse}/sections/${sectionId}/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleAddQuestion = () => {
    let updatedQuestion;
    
    if (newQuestion.questionType === 'multipleChoice') {
      const correctAnswerIndex = parseInt(newQuestion.correctAnswer);
      const updatedChoices = newQuestion.choices.map((choice, index) => ({
        text: choice,
        isCorrect: index === correctAnswerIndex,
      }));
      
      updatedQuestion = {
        questionText: newQuestion.questionText,
        questionType: newQuestion.questionType,
        choices: updatedChoices,
        correctAnswer: correctAnswerIndex,
      };
    } else {
      // Handle coding questions
      updatedQuestion = {
        questionText: newQuestion.questionText,
        questionType: newQuestion.questionType,
        choices: [], // Empty array for coding questions
        correctAnswer: newQuestion.correctAnswer, // Store the actual answer string
      };
    }
  
    // Add the question to the list of questions
    setQuestions([...questions, updatedQuestion]);
  
    // Reset the question form
    setNewQuestion({
      questionText: '',
      questionType: 'multipleChoice',
      choices: ['', '', '', ''],
      correctAnswer: '',
    });
  };
  
  
  
  

  const handleSubmitQuiz = async () => {
    try {
      console.log('questions',questions);
      await axios.post(
        'http://localhost:5000/api/quiz/create',
        { lessonId: selectedLesson, questions },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('questions',questions);

      alert('Quiz created successfully!');
      // Reset everything after successful submission
      setQuestions([]);
      setSelectedLesson('');
    } catch (error) {
      console.error('Error creating quiz:', error);
      console.log("questions",questions);
      alert('Error creating quiz');
    }
  };

  return (
    <AdminLayout>
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content Area */}
            <div className="flex-grow lg:w-2/3">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-center text-indigo-700 mb-8 flex items-center justify-center">
                <FontAwesomeIcon icon={faQuestionCircle} className="mr-4 text-indigo-500" />
                Create Quiz
              </h1>

              {/* Course, Section, Lesson Selections */}
              <div className="space-y-4 mb-8">
                <select
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg"
                  value={selectedCourse}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                >
                  <option value="">Choose a Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>

                {selectedCourse && (
                  <select
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg"
                    value={selectedSection}
                    onChange={(e) => handleSectionSelect(e.target.value)}
                  >
                    <option value="">Choose a Section</option>
                    {sections.map((section) => (
                      <option key={section._id} value={section._id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                )}

                {selectedSection && (
                  <select
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg"
                    value={selectedLesson}
                    onChange={(e) => setSelectedLesson(e.target.value)}
                  >
                    <option value="">Choose a Lesson</option>
                    {lessons.map((lesson) => (
                      <option key={lesson._id} value={lesson._id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Question Creation Section */}
              <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
                <input
                  type="text"
                  value={newQuestion.questionText}
                  onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg mb-4"
                  placeholder="Enter your question"
                />

                <select
                  value={newQuestion.questionType}
                  onChange={(e) => setNewQuestion({...newQuestion, questionType: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg mb-4"
                >
                  <option value="multipleChoice">Multiple Choice</option>
                  <option value="coding">Coding</option>
                </select>

                {newQuestion.questionType === 'multipleChoice' && (
                  <div className="space-y-2">
                    {newQuestion.choices.map((choice, index) => (
                      <input
                        key={index}
                        type="text"
                        value={choice}
                        onChange={(e) => {
                          const newChoices = [...newQuestion.choices];
                          newChoices[index] = e.target.value;
                          setNewQuestion({...newQuestion, choices: newChoices});
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder={`Choice ${index + 1}`}
                      />
                    ))}

                    <select
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg mt-4"
                    >
                      <option value="">Select Correct Answer</option>
                      {newQuestion.choices.map((choice, index) => (
                        choice && <option key={index} value={index}>{choice}</option>
                      ))}
                    </select>
                  </div>
                )}

                {newQuestion.questionType === 'coding' && (
                  <input
                    type="text"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg"
                    placeholder="Expected Code Output"
                  />
                )}

                <button 
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.questionText || 
                    (newQuestion.questionType === 'multipleChoice' && !newQuestion.correctAnswer)}
                  className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Add Question
                </button>
              </div>

              <button 
                onClick={handleSubmitQuiz}
                disabled={!selectedLesson || questions.length === 0}
                className="w-full mt-6 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Create Quiz
              </button>
            </div>

            {/* Question List Section */}
            <div className="lg:w-1/3">
              <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
                <h2 className="text-xl lg:text-2xl font-bold mb-6">Added Questions</h2>
                <div className="space-y-4">
                  {questions.length === 0 ? (
                    <p className="text-gray-500 text-center">No questions added yet</p>
                  ) : (
                    questions.map((question, index) => (
                      <QuestionPreview 
                        key={index} 
                        question={question} 
                        onDelete={() => setQuestions(questions.filter((_, i) => i !== index))}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  );
};

export default CreateQuiz;