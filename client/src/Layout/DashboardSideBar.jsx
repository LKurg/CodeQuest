import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faTrophy, 
  faChartLine, 
  faPlay, 
  faCog, 
  faBullseye, 
  faStar 
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = ({ children }) => {
  const location = useLocation();
  const [activeCourses, setActiveCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user's progress
        const progressResponse = await fetch('http://localhost:5000/api/users/progress', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const progressData = await progressResponse.json();
        setUserProgress(progressData);

        // Prepare active courses with progress
        const enrichedCourses = progressData
          .map(progress => {
            // Course details are now directly in the progress response
            const course = {
              _id: progress.courseId,
              title: progress.courseTitle,
              sections: [] // We'll add this if needed
            };

            // Find the current section 
            const currentSection = progress.currentSection;
            
            // Determine the next lesson
            const nextLesson = progress.nextLesson;

            return {
              id: course._id,
              title: course.title || 'Unnamed Course',
              progress: calculateCourseProgress(progress),
              icon: getLanguageIcon(course.language), // You might need to modify how language is retrieved
              currentSection: 'Current Section', // Update this based on your data structure
              nextLesson: nextLesson 
                ? nextLesson.title 
                : 'Course Completed',
              lastAccessed: progress.lastAccessed 
                ? new Date(progress.lastAccessed) 
                : new Date(0)
            };
          })
          // Sort by most recently accessed
          .sort((a, b) => b.lastAccessed - a.lastAccessed)
          // Take only the top 2 courses
          .slice(0, 2);

        setActiveCourses(enrichedCourses);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load dashboard data');
      }
    };

    fetchUserData();
  }, []);


const calculateCourseProgress = (progress) => {

  return Math.round(progress.progressPercentage || 0);
};

  // Helper function to get language icon
  const getLanguageIcon = (language) => {
    const languageIcons = {
      'Python': '🐍',
      'JavaScript': '🟨',
      'React': '⚛️',
      'PHP': '🐘',
      'Java': '☕',
      'default': '📚'
    };
    return languageIcons[language] || languageIcons['default'];
  };

  // Sidebar items remain the same
  const sidebarItems = [
    { 
      icon: faBook, 
      title: 'My Courses', 
      path: '/dashboard/courses' 
    },
    { 
      icon: faChartLine, 
      title: 'Progress', 
      path: '/client/progress' 
    },
 
 
    { 
      icon: faCog, 
      title: 'Account Settings', 
      path: '/client/settings' 
    }
  ];

  if (error) {
    return (
      <div className="text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-72 sticky top-10 bg-white border-r h-screen overflow-y-auto">
        {/* Active Courses Section */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faBook} className="mr-2 text-teal-600" /> Active Courses
          </h3>
          {activeCourses.map(course => (
            <div 
              key={course.id} 
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg mb-2"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{course.icon}</span>
                <div>
                  <h4 className="font-medium text-sm">{course.title}</h4>
                  <p className="text-xs text-gray-500">
                    Current Section | Next: {course.nextLesson}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div 
                  className="w-12 h-1 bg-gray-200 rounded-full mr-2"
                  title={`${course.progress}% Complete`}
                >
                  <div 
                    className="h-full bg-teal-500 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <Link 
                  to={`/course/learn/${course.id}`} 
                  className="text-teal-600 hover:bg-teal-50 p-1 rounded"
                >
                  <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Items */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Dashboard</h3>
          {sidebarItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center p-3 rounded-lg mb-2 
                ${location.pathname === item.path 
                  ? 'bg-teal-50 text-teal-700' 
                  : 'hover:bg-gray-50 text-gray-700'}
              `}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3 w-5 h-5" />
              {item.title}
            </Link>
          ))}
        </div>

        {/* XP and Streak */}
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="font-medium">Total XP</span>
            </div>
            <span className="font-bold text-teal-600">1,250</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-orange-500 mr-2" />
              <span className="font-medium">Learning Streak</span>
            </div>
            <span className="font-bold text-orange-600">12 Days</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default DashboardSidebar;