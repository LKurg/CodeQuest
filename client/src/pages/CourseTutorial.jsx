import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhp } from '@fortawesome/free-brands-svg-icons';
import { 
  faCheckCircle, 
  faStar, 
  faLock, 
  faCode, 
  faImage, 
  faBookOpen, 
  faChalkboardTeacher 
} from '@fortawesome/free-solid-svg-icons';
import Navigation from '../Layout/Navigation';
import Editor from '@monaco-editor/react';
import ContentRenderer from '../components/ContentRenderer';

import PythonQuiz from '../components/PythonQuize';

const ProgressTracker = ({ xp, completedLessons, totalLessons }) => {
  const progressPercentage = (completedLessons.length / totalLessons) * 100;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-2" />
          <span className="font-bold text-lg">{xp} XP</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
          <span>{completedLessons.length} / {totalLessons} Lessons</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const CodeChallenge = ({ lesson, onSuccess }) => {
  const [code, setCode] = useState(lesson?.challenge?.starterCode || '');
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = () => {
    try {
      if (!lesson?.challenge?.testCases) {
        setOutput('No test cases available');
        return;
      }

      const testResults = lesson.challenge.testCases.map(testCase => {
        const testFunction = new Function(
          ...testCase.input.map((_, i) => `arg${i}`), 
          `return (${code})(...arguments)`
        );

        const result = testFunction(...testCase.input);
        return result === testCase.expectedOutput;
      });

      const allTestsPassed = testResults.every(result => result);
      setIsCorrect(allTestsPassed);

      if (allTestsPassed) {
        onSuccess();
        setOutput('All tests passed successfully!');
      } else {
        setOutput('Some test cases failed. Keep trying!');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsCorrect(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <FontAwesomeIcon icon={faCode} className="mr-2 text-teal-600" />
        Coding Challenge
      </h3>
      <p className="mb-4 text-gray-600">{lesson.challenge?.prompt || 'No challenge prompt available'}</p>
      
      <div className="mb-4 h-64">
        <Editor
          theme="vs-dark"
          defaultLanguage="php"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
      
      <div className="flex space-x-4 mb-4">
        <button 
          onClick={runCode}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
        >
          Run Code
        </button>
        <button 
          onClick={() => setShowHints(!showHints)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>
      </div>
      
      {showHints && lesson.challenge?.hints && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-bold mb-2 flex items-center">
            <FontAwesomeIcon icon={faBookOpen} className="mr-2 text-blue-600" />
            Hints
          </h4>
          <ul className="list-disc list-inside">
            {lesson.challenge.hints.map((hint, index) => (
              <li key={index} className="text-blue-800">{hint}</li>
            ))}
          </ul>
        </div>
      )}
      
      {isCorrect !== null && (
        <div className={`mt-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect 
            ? 'Congratulations! All tests passed!' 
            : 'Oops, some tests failed. Keep trying!'}
        </div>
      )}
    </div>
  );
};

function CourseTutorial() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [xp, setXp] = useState(0);
  const [error, setError] = useState(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token'); 
     
  
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add the token here
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setCourseData(data);
  
        if (data?.sections?.length > 0) {
          const firstSection = data.sections[0];
          setActiveSection(firstSection._id);
  
          if (firstSection.lessons?.length > 0) {
            setActiveLesson(firstSection.lessons[0]._id);
          }
        }
  
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Failed to load course content');
      }
    };
  
    fetchCourseData();
  }, [courseId]);
  

  const handleLessonSuccess = () => {
    setXp(prevXp => prevXp + 100);
    if (activeLesson && !completedLessons.includes(activeLesson)) {
      setCompletedLessons(prev => [...prev, activeLesson]);
    }
  };

  const handleQuizComplete = (score) => {
    setXp(prevXp => prevXp + score);
    setIsQuizMode(false);
    if (activeSection && courseData.sections) {
      const currentSectionIndex = courseData.sections.findIndex(s => s._id === activeSection);
      if (currentSectionIndex < courseData.sections.length - 1) {
        setActiveSection(courseData.sections[currentSectionIndex + 1]._id);
        if (courseData.sections[currentSectionIndex + 1].lessons?.length > 0) {
          setActiveLesson(courseData.sections[currentSectionIndex + 1].lessons[0]._id);
        }
      }
    }
  };

  const getActiveLessonDetails = () => {
    if (!courseData?.sections) return null;
    
    return courseData.sections
      .flatMap(section => section.lessons)
      .find(lesson => lesson._id === activeLesson);
  };

  const renderLessonContent = () => {
    const lesson = getActiveLessonDetails();
    if (!lesson) return null;

    const contents = lesson.description 
      ? [{ type: 'text', text: lesson.description }] 
      : (lesson.contents || []);

    return (
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center">
          <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-teal-600" />
          {lesson.title}
        </h2>

        {contents.map((content, index) => (
          <ContentRenderer 
            key={index} 
            content={content.text || content} 
            type={content.type || 'text'} 
          />
        ))}

        {lesson.challenge && (
          <CodeChallenge 
            lesson={lesson} 
            onSuccess={handleLessonSuccess} 
          />
        )}
      </div>
    );
  };

  if (!courseData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
          <p className="mt-4 text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  if (!courseData.sections || courseData.sections.length === 0) {
    return <div className="text-center py-10 text-xl">No course content available</div>;
  }

  const totalLessons = courseData.sections.flatMap(s => s.lessons).length;

  return (
    <Navigation>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 bg-white border-r p-6 overflow-auto">
          <div className="flex flex-col mb-8">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon 
                icon={faPhp} 
                className="text-3xl mr-4 text-teal-600" 
              />
              <h1 className="text-xl font-bold text-gray-800">
                {courseData.title}
              </h1>
            </div>

            <ProgressTracker 
              xp={xp} 
              completedLessons={completedLessons}
              totalLessons={totalLessons} 
            />
          </div>

          {courseData.sections.map((section) => (
            <div key={section._id} className="mb-6">
              <div 
                onClick={() => setActiveSection(section._id)}
                className={`cursor-pointer p-3 rounded-lg transition duration-300 ${
                  activeSection === section._id 
                    ? 'bg-teal-100 text-teal-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <h3 className="font-semibold">{section.title}</h3>
              </div>

              {activeSection === section._id && (
                <div className="mt-2 space-y-2">
                  {section.lessons.map((lesson) => (
                    <div 
                      key={lesson._id} 
                      onClick={() => setActiveLesson(lesson._id)}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition duration-300 ${
                        activeLesson === lesson._id 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon 
                        icon={completedLessons.includes(lesson._id) ? faCheckCircle : faLock}
                        className={`mr-2 transition duration-300 ${
                          completedLessons.includes(lesson._id) 
                            ? 'text-green-500' 
                            : 'text-gray-400'
                        }`}
                      />
                      <span>{lesson.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 p-6 bg-white overflow-auto relative">
          {isQuizMode ? (
            <PythonQuiz onQuizComplete={handleQuizComplete} />
          ) : (
            <>
              {activeLesson ? renderLessonContent() : (
                <div className="text-center text-gray-500 flex items-center justify-center h-full">
                  <p className="text-xl">Please select a lesson to begin!</p>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button 
                  onClick={() => setIsQuizMode(true)}
                  className="bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-teal-700 transition duration-300 flex items-center"
                >
                  <FontAwesomeIcon icon={faCode} className="mr-2" />
                  Take Python Quiz
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Navigation>
  );
}

export default CourseTutorial;