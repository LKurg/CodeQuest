import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faTrophy, 
  faChartLine, 
  faPlay, 
  faCog, 
  faStar 
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = ({ children }) => {
  const location = useLocation();
  const [activeCourses, setActiveCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized function to get language icon
  const getLanguageIcon = useCallback((language) => {
    const languageIcons = {
      'Python': '🐍',
      'JavaScript': '🟨',
      'React': '⚛️',
      'PHP': '🐘',
      'Java': '☕',
      'default': '📚'
    };
    return languageIcons[language] || languageIcons['default'];
  }, []);

  // Memoized function to calculate course progress
  const calculateCourseProgress = useCallback((progress) => {
    return Math.round(progress.progressPercentage || 0);
  }, []);

  // Centralized API call handler
  const fetchWithErrorHandling = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
      setError(err.message || 'An unexpected error occurred');
      return null;
    }
  };

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const statsData = await fetchWithErrorHandling('http://localhost:5000/api/users/stats');
        if (statsData) {
          setStreak(statsData.streak);
          setXp(statsData.xp);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch user progress
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const progressData = await fetchWithErrorHandling('http://localhost:5000/api/users/progress');
        
        if (progressData) {
          setUserProgress(progressData);

          // Transform progress data into active courses
          const enrichedCourses = progressData
            .map((progress) => ({
              id: progress.courseId,
              title: progress.courseTitle || 'Unnamed Course',
              progress: calculateCourseProgress(progress),
              icon: getLanguageIcon(progress.courseTitle), 
              currentSection: progress.currentSection || 'Not Started',
              nextLesson: progress.nextLesson?.title || 'Course Completed',
              lastAccessed: progress.lastAccessed 
                ? new Date(progress.lastAccessed) 
                : new Date(0)
            }))
            .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
            .slice(0, 2);

          setActiveCourses(enrichedCourses);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [calculateCourseProgress, getLanguageIcon]);

  // Sidebar navigation items
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        {error}
        <button 
          onClick={() => {
            setError(null);
            window.location.reload();
          }} 
          className="ml-4 bg-teal-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-72 sticky top-0 bg-white border-r h-screen overflow-y-auto">
        {/* Active Courses Section */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faBook} className="mr-2 text-teal-600" /> 
            Active Courses
          </h3>
          {activeCourses.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              No active courses found
            </p>
          ) : (
            activeCourses.map(course => (
              <div 
                key={course.id} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg mb-2"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{course.icon}</span>
                  <div>
                    <h4 className="font-medium text-sm">{course.title}</h4>
                    <p className="text-xs text-gray-500">
                      {course.currentSection} | Next: {course.nextLesson}
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
            ))
          )}
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
            <span className="font-bold text-teal-600">{xp}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-orange-500 mr-2" />
              <span className="font-medium">Learning Streak</span>
            </div>
            <span className="font-bold text-orange-600">{streak} Days</span>
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