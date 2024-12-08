import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhp } from '@fortawesome/free-brands-svg-icons';
import { 
  faCheckCircle, 
  faStar, 
  faLock, 
  faCode, 
  faBookOpen, 
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../Layout/MainLayout';
import ContentRenderer from '../components/ContentRenderer';

import ProgressTracker from '../components/ProgressTracker';
import CodeChallenge from '../components/CodeChallenge';
import TakeQuiz from '../components/Quiz';

function CourseTutorial() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [xp, setXp] = useState(0);
  const [error, setError] = useState(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const [progressResponse, courseResponse] = await Promise.all([
                fetch(`http://localhost:5000/api/users/progress/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
            
                fetch(`http://localhost:5000/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })
            ]);
    
            const progressData = await progressResponse.json();
            const courseData = await courseResponse.json();
    
            setCourseData(courseData);
            setUserProgress(progressData);
            console.log(progressData);
    
            // Use completedLessons from backend directly
            setCompletedLessons(progressData.completedLessons || []);
    
            // Set initial section and lesson based on backend progress
            const defaultSection = courseData.sections[0]?._id;
            const progressSection = progressData?.currentSection || defaultSection;
            setActiveSection(progressSection);
    
            const activeSectionLessons = courseData.sections
                .find(section => section._id === progressSection)?.lessons;
            
            if (activeSectionLessons?.length) {
                setActiveLesson(activeSectionLessons[0]._id);
            }
    
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load course content');
        }
    };
    
    fetchData();
}, [courseId]);
const handleTakeQuiz = () => {
  navigate(`/course/quize/${courseId}/${activeLesson}`);

};

  const handleLessonSuccess = () => {
    setXp(prevXp => prevXp + 100);
    if (activeLesson && !completedLessons.includes(activeLesson)) {
      setCompletedLessons(prev => [...prev, activeLesson]);
    }
  };

  const progressToNextSection = () => {
    if (!courseData?.sections) return;

    const currentSectionIndex = courseData.sections.findIndex(s => s._id === activeSection);
    const currentLessonIndex = courseData.sections[currentSectionIndex].lessons
      .findIndex(l => l._id === activeLesson);

    // Check if there are more lessons in the current section
    if (currentLessonIndex < courseData.sections[currentSectionIndex].lessons.length - 1) {
      // Move to next lesson in the same section
      setActiveLesson(courseData.sections[currentSectionIndex].lessons[currentLessonIndex + 1]._id);
    } else if (currentSectionIndex < courseData.sections.length - 1) {
      // Move to next section
      const nextSection = courseData.sections[currentSectionIndex + 1];
      setActiveSection(nextSection._id);
      
      // Set the first lesson of the next section
      if (nextSection.lessons?.length > 0) {
        setActiveLesson(nextSection.lessons[0]._id);
      }
    }
  };

  const handleNextButton = async () => {
    handleLessonSuccess();

    try {
        const token = localStorage.getItem('token');
        
        // Determine if all lessons in the current section are completed
        const currentSectionLessons = courseData.sections
            .find(section => section._id === activeSection)?.lessons || [];
        
        const completedSectionsArray = 
            currentSectionLessons.every(lesson => completedLessons.includes(lesson._id)) 
                ? [activeSection.toString()] 
                : [];

        await fetch('http://localhost:5000/api/users/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                courseId,
                currentSection: activeSection.toString(),
                completedSections: completedSectionsArray,
                completedLessons: [activeLesson.toString()]
            })
        });
    } catch (error) {
        console.error('Error updating progress:', error);
    }

    progressToNextSection();
};

  const handleQuizComplete = (score) => {
    setXp(prevXp => prevXp + score);
    setIsQuizMode(false);
    progressToNextSection();
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

        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleNextButton}
            className="bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-teal-700 transition duration-300 flex items-center"
          >
            Next Lesson
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
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
    <MainLayout>
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
              userProgress={userProgress} 
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
        {section.lessons.map((lesson, index) => {
          // Determine if lesson should be unlocked
          const isUnlocked = 
            index === 0 || // First lesson always unlocked
            completedLessons.includes(section.lessons[index - 1]._id);

          return (
            <div 
              key={lesson._id} 
              onClick={() => isUnlocked && setActiveLesson(lesson._id)}
              className={`flex items-center p-2 rounded-lg transition duration-300 ${
                !isUnlocked 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-gray-100'
              } ${
                activeLesson === lesson._id 
                  ? 'bg-blue-100 text-blue-800' 
                  : ''
              }`}
            >
              <FontAwesomeIcon 
                icon={
                  completedLessons.includes(lesson._id) 
                    ? faCheckCircle 
                    : (isUnlocked ? faStar : faLock)
                }
                className={`mr-2 transition duration-300 ${
                  completedLessons.includes(lesson._id) 
                    ? 'text-green-500' 
                    : (isUnlocked ? 'text-yellow-500' : 'text-gray-400')
                }`}
              />
              <span>{lesson.title}</span>
            </div>
          );
        })}
      </div>
    )}
  </div>
))}
        </div>

        <div className="flex-1 p-6 bg-white overflow-auto relative">
          {isQuizMode ? (
            <TakeQuiz 
            activeLesson={activeLesson.toString()} 
            onQuizComplete={handleQuizComplete} 
          />
          ) : (
            <>
              {activeLesson ? renderLessonContent() : (
                <div className="text-center text-gray-500 flex items-center justify-center h-full">
                  <p className="text-xl">Please select a lesson to begin!</p>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button 
      onClick={handleTakeQuiz}
      className="bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-teal-700 transition duration-300 flex items-center"
    >
      <FontAwesomeIcon icon={faCode} className="mr-2" />
      Take  Quiz
    </button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default CourseTutorial;