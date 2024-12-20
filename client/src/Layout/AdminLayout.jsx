import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faBook, 
  faQuestionCircle, 
  faSearch, 
  faBell, 
  faChevronLeft,
  faSun,
  faMoon,
  faShoppingCart,
  faChartLine,
  faCog,
  faSignOutAlt,
  faEnvelope,
  faTasks,
  faUserCircle,
  faCode,
  faGraduationCap,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const adminSidebarItems = [
    {
      section: 'MAIN',
      items: [
        {
          icon: faChartLine,
          title: 'Dashboard',
          path: '/admin/dashboard',
        },
        /*
        {
          icon: faCode,
          title: 'Challenges',
          path: '/admin/challenges',
          badge: '5'
       
        }
             */
      ]
    },
    {
      section: 'MANAGEMENT',
      items: [
        {
          icon: faUser,
          title: 'Users',
          path: '/admin/users',
        },
        {
          icon: faBook,
          title: 'Courses',
          path: '/admin/courses',
        },
        {
          icon: faQuestionCircle,
          title: 'Quizzes',
          path: '/admin/quizzes',
        },
        /*

        {
          icon: faGraduationCap,
          title: 'Learning Paths',
          path: '/admin/learning-paths',
        }
          */
      ]
    },
  
    /*

  
    {
      section: 'ANALYTICS',
      items: [
        {
          icon: faChartLine,
          title: 'Performance',
          path: '/admin/performance',
        },
        {
          icon: faTasks,
          title: 'Progress Tracking',
          path: '/admin/progress',
        }
      ]
    }
          */
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Course Submission',
      message: 'A new Python course has been submitted for review',
      time: '5m ago',
      unread: true
    },
    {
      id: 2,
      title: 'User Milestone',
      message: 'User John Doe completed all JavaScript challenges',
      time: '1h ago',
      unread: true
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed h-full bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out z-30
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-4' : 'px-6 py-8'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <FontAwesomeIcon icon={faCode} className="w-6 h-6" />
            </div>
            {!isSidebarCollapsed && (
              <h3 className="ml-3 text-xl font-bold text-gray-800 dark:text-white">CodeQuest</h3>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {adminSidebarItems.map((section, index) => (
              <div key={index} className="px-4 py-4">
                {!isSidebarCollapsed && (
                  <h6 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4 px-4">
                    {section.section}
                  </h6>
                )}
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-all duration-300
                        ${location.pathname === item.path
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                        group relative
                      `}
                    >
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className={`
                          w-5 h-5 transition-transform duration-300
                          ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'}
                        `} 
                      />
                      {!isSidebarCollapsed && (
                        <>
                          <span className="ml-4 font-medium">{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isSidebarCollapsed && item.badge && (
                        <span className="absolute -right-1 -top-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FontAwesomeIcon 
                icon={faChevronLeft} 
                className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
              />
              {!isSidebarCollapsed && <span className="ml-2">Collapse</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex items-center flex-1 max-w-xl ml-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon 
                  icon={isDarkMode ? faSun : faMoon} 
                  className="w-5 h-5 text-gray-600 dark:text-gray-300" 
                />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-30">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      <h6 className="text-sm font-semibold">Notifications</h6>
                    </div>
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="relative"
                >
                  <img 
                    src="/api/placeholder/40/40" 
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-30">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">admin@codequest.com</p>
                    </div>
                    <Link 
                      to="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;