import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faBookOpen, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useCourseAnalytics from '../hooks/useCourseAnalytics';
import ContentRenderer from '../components/ContentRenderer';
import CodeChallenge from '../components/CodeChallenge';
import TakeQuiz from '../components/Quiz';
import CourseLayout from '../Layout/CourseLayout';

function CourseTutorial() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [courseData, setCourseData] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeLesson, setActiveLesson] = useState(lessonId || null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [xp, setXp] = useState(0);
  const [error, setError] = useState(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);

  // Analytics hook
  useCourseAnalytics(courseId, activeLesson, completedLessons, userProgress);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      try {
        const [progressResponse, courseResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/users/progress/${courseId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/courses/${courseId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
        ]);
  
        const progressData = await progressResponse.json();
        const courseData = await courseResponse.json();
  
        // Update states with fetched data
        setUserSubscription(courseData.subscription);
        setCourseData(courseData.course);
        setUserProgress(progressData);
        setCompletedLessons(progressData.completedLessons || []);
  
        // Handle lesson and section selection based on URL or default
        if (lessonId) {
          const sectionWithLesson = courseData.course.sections.find(
            section => section.lessons.some(lesson => lesson._id === lessonId)
          );
          if (sectionWithLesson) {
            setActiveSection(sectionWithLesson._id);
            setActiveLesson(lessonId);
          }
        } else {
          // Set default section and lesson if no lessonId in URL
          const defaultSection = courseData.course.sections[0]?._id;
          const progressSection = progressData?.currentSection || defaultSection;
          setActiveSection(progressSection);
          
          const firstLesson = courseData.course.sections
            .find(section => section._id === progressSection)?.lessons[0];
          
          if (firstLesson) {
            setActiveLesson(firstLesson._id);
            navigate(`/course/learn/${courseId}/${firstLesson._id}`);
          }
        }
  
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load course content');
      }
    };
    
    fetchData();
  }, [courseId, lessonId, navigate]);

  // Quiz handlers
  const handleTakeQuiz = () => {
    navigate(`/course/quiz/${courseId}/${activeLesson}`);
  };

  const handleQuizComplete = (score) => {
    setXp(prevXp => prevXp + score);
    setIsQuizMode(false);
    progressToNextSection();
  };

  // Lesson completion handlers
  const handleLessonSuccess = () => {
    setXp(prevXp => prevXp + 100);
    if (activeLesson && !completedLessons.includes(activeLesson)) {
      setCompletedLessons(prev => [...prev, activeLesson]);
    }
  };

  // Navigation handlers
  const progressToNextSection = () => {
    if (!courseData?.sections) return;

    const currentSectionIndex = courseData.sections.findIndex(s => s._id === activeSection);
    const currentSection = courseData.sections[currentSectionIndex];
    const currentLessonIndex = currentSection.lessons.findIndex(l => l._id === activeLesson);

    // Try to move to next lesson in current section
    if (currentLessonIndex < currentSection.lessons.length - 1) {
      const nextLesson = currentSection.lessons[currentLessonIndex + 1];
      setActiveLesson(nextLesson._id);
      navigate(`/course/${courseId}/${nextLesson._id}`);
    }
    // If no more lessons in current section, try to move to next section
    else if (currentSectionIndex < courseData.sections.length - 1) {
      const nextSection = courseData.sections[currentSectionIndex + 1];
      setActiveSection(nextSection._id);
      
      if (nextSection.lessons?.length > 0) {
        const firstLesson = nextSection.lessons[0];
        setActiveLesson(firstLesson._id);
        navigate(`/course/${courseId}/${firstLesson._id}`);
      }
    }
  };

  const handleNextButton = async () => {
    handleLessonSuccess();

    try {
      const token = localStorage.getItem('token');
      
      const currentSectionLessons = courseData.sections
        .find(section => section._id === activeSection)?.lessons || [];
      
      const completedSectionsArray = 
        currentSectionLessons.every(lesson => completedLessons.includes(lesson._id)) 
          ? [activeSection.toString()] 
          : [];

      // Update progress on server
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

  // Content rendering helpers
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

  // Error handling
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  // Main render
  return (
    <CourseLayout
      courseData={courseData}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      activeLesson={activeLesson}
      setActiveLesson={setActiveLesson}
      completedLessons={completedLessons}
      xp={xp}
      userProgress={userProgress}
      userSubscription={userSubscription}
    >
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
              Take Quiz
            </button>
          </div>
        </>
      )}
    </CourseLayout>
  );
}

export default CourseTutorial;