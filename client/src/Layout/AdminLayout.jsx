import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  // Sidebar navigation items for admin
  const adminSidebarItems = [
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
      path: '/admin/create-quize',
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-72 sticky top-0 bg-gray-100 h-screen overflow-y-auto border-r">
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-700 mb-6">Admin Dashboard</h3>
          {adminSidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg mb-3 ${
                location.pathname === item.path
                  ? 'bg-teal-50 text-teal-700'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3 w-5 h-5" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
