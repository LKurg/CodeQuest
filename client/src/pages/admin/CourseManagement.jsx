import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faEdit,
  faTrash,
  faBook,
  faGraduationCap,
  faUsers,
  faClock,
  faLock,
  faUnlock,
  faStar,
  faChartLine,
  faSearch,
  faFilter,
  faCode,
  faPuzzlePiece,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../Layout/AdminLayout';

const ProgressBar = ({ value, max, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className={`h-2 rounded-full ${color}`}
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border-2 border-transparent hover:border-blue-500">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <FontAwesomeIcon icon={course.icon} className="text-white text-3xl" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
              <p className="text-sm text-gray-500">{course.description}</p>
            </div>
            <div className="flex gap-2">
              {course.isPro && (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                  PRO
                </span>
              )}
              <span className={`${course.difficulty.color} text-xs px-2 py-1 rounded-full`}>
                {course.difficulty.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Lessons</p>
              <p className="font-bold text-gray-900">{course.stats.lessons}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Students</p>
              <p className="font-bold text-gray-900">{course.stats.students}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">Rating</p>
              <p className="font-bold text-gray-900">{course.stats.rating}/5</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm text-blue-600">{course.completionRate}%</span>
            </div>
            <ProgressBar 
              value={course.completionRate} 
              max={100} 
              color="bg-gradient-to-r from-blue-500 to-purple-500" 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-4">
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <FontAwesomeIcon icon={faEdit} />
            Edit
          </button>
          <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
            <FontAwesomeIcon icon={faPuzzlePiece} />
            Manage Content
          </button>
          {course.isPublished ? (
            <button className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
              <FontAwesomeIcon icon={faUnlock} />
              Published
            </button>
          ) : (
            <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1">
              <FontAwesomeIcon icon={faLock} />
              Draft
            </button>
          )}
        </div>
        <button className="text-sm text-red-600 hover:text-red-700">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Sample course data
  const courses = [
    {
      id: 1,
      title: "Advanced JavaScript Mastery",
      description: "Master modern JavaScript concepts and advanced programming techniques",
      icon: faCode,
      isPro: true,
      isPublished: true,
      difficulty: {
        label: "Advanced",
        color: "bg-red-100 text-red-800"
      },
      stats: {
        lessons: 42,
        students: 1234,
        hours: 28,
        rating: 4.8
      },
      completionRate: 78
    },
    {
      id: 2,
      title: "React Development Journey",
      description: "From fundamentals to advanced React patterns and best practices",
      icon: faRocket,
      isPro: false,
      isPublished: true,
      difficulty: {
        label: "Intermediate",
        color: "bg-yellow-100 text-yellow-800"
      },
      stats: {
        lessons: 36,
        students: 2156,
        hours: 24,
        rating: 4.9
      },
      completionRate: 85
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-500">Create and manage learning journeys</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create New Course
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faBook} className="text-blue-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Active Courses</p>
                  <p className="text-xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-purple-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-xl font-bold text-gray-900">12,847</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGraduationCap} className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-xl font-bold text-gray-900">84%</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Rating</p>
                  <p className="text-xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Full Stack</option>
              <option value="algorithms">Algorithms</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="space-y-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseManagement;