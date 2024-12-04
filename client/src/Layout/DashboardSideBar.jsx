import React from 'react';
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
  
  const activeCourses = [
    {
      id: 1,
      title: 'Python Fundamentals',
      progress: 65,
      icon: '🐍',
      currentSection: 'Functions and Modules'
    },
    {
      id: 2,
      title: 'React Web Development',
      progress: 40,
      icon: '⚛️',
      currentSection: 'State Management'
    }
  ];

  const sidebarItems = [
    { 
      icon: faBook, 
      title: 'My Courses', 
      path: '/dashboard/courses' 
    },
    { 
      icon: faChartLine, 
      title: 'Progress', 
      path: '/dashboard/progress' 
    },
    { 
      icon: faTrophy, 
      title: 'Achievements', 
      path: '/dashboard/achievements' 
    },
    { 
      icon: faBullseye, 
      title: 'Learning Paths', 
      path: '/dashboard/paths' 
    },
    { 
      icon: faCog, 
      title: 'Account Settings', 
      path: '/dashboard/settings' 
    }
  ];

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
                  <p className="text-xs text-gray-500">{course.currentSection}</p>
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
                  to={`/course/${course.id}`} 
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