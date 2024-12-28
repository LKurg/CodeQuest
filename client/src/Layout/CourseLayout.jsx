import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhp } from '@fortawesome/free-brands-svg-icons';
import { 
  faCheckCircle, 
  faStar, 
  faLock
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../Layout/MainLayout';
import ProgressTracker from '../components/ProgressTracker';
import { PremiumBanner } from '../components/PremiumBanner';

const CourseLayout = ({ 
  children,
  courseData,
  activeSection,
  setActiveSection,
  activeLesson,
  setActiveLesson,
  completedLessons,
  xp,
  userProgress,
  userSubscription
}) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleLessonClick = (lessonId) => {
    setActiveLesson(lessonId);
    navigate(`/course/learn/${courseId}/${lessonId}`);
  };

  const totalLessons = courseData?.sections?.flatMap(s => s.lessons).length || 0;

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

  return (
    <MainLayout>
      <div className="relative z-20">
        {userSubscription === 'free' && <PremiumBanner userSubscription={userSubscription} />}
      </div>
      <div className="flex min-h-screen bg-gray-50 relative">
        <div className="w-64 bg-white border-r p-6 overflow-y-auto sticky top-0 h-screen z-10">
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
                    const isUnlocked = 
                      index === 0 || 
                      completedLessons.includes(section.lessons[index - 1]._id);

                    return (
                      <div 
                        key={lesson._id} 
                        onClick={() => isUnlocked && handleLessonClick(lesson._id)}
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
        
        <div className="flex-1 p-6 bg-white overflow-auto relative z-0">
          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseLayout;