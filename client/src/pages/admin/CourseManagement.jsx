import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faBook, faGraduationCap, 
  faUsers, faLock, faUnlock, faStar, faSearch,
  faPuzzlePiece
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../Layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
const ProgressBar = ({ value, max, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className={`h-2 rounded-full ${color}`}
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

const extractImageUrl = (description) => {
  const match = description.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
};

console.log(extractImageUrl)

const CourseCard = ({ course }) => {
  const imageUrl = extractImageUrl(course.description);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border-2 border-transparent hover:border-blue-500">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden">
          {imageUrl ? (
            <img 
              src={`${imageUrl}`} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} className="text-white text-3xl" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
              <p className="text-sm text-gray-500">
                {course.description.replace(/<[^>]+>/g, '').substring(0, 100)}...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Lessons</p>
              <p className="font-bold text-gray-900">{course.metrics.totalLessons}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Students</p>
              <p className="font-bold text-gray-900">{course.metrics.enrolledStudents}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="font-bold text-gray-900">{course.metrics.averageTimeSpentMinutes}m</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Sections</p>
              <p className="font-bold text-gray-900">{course.metrics.totalSections}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm text-blue-600">{course.metrics.averageCompletionRate}%</span>
            </div>
            <ProgressBar 
              value={course.metrics.averageCompletionRate} 
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
          <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1">
            <FontAwesomeIcon icon={faLock} />
            Draft
          </button>
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
  const [coursesData, setCoursesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await fetch('http://localhost:5000/api/admin/courses/data', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }

        const data = await response.json();
        setCoursesData(data.data);
        console.log(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/admin/create-tutorial'); 
  };
  // Filter courses based on search term
  const filteredCourses = coursesData?.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Loading courses...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
      </AdminLayout>
    );
  }

  // Calculate overview stats
  const overviewStats = coursesData ? {
    totalCourses: coursesData.length,
    totalStudents: coursesData.reduce((sum, course) => sum + course.metrics.enrolledStudents, 0),
    averageCompletion: Math.round(
      coursesData.reduce((sum, course) => sum + course.metrics.averageCompletionRate, 0) / 
      coursesData.length
    ),
    averageTimeSpent: Math.round(
      coursesData.reduce((sum, course) => sum + course.metrics.averageTimeSpentMinutes, 0) / 
      coursesData.length
    )
  } : null;

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
            <button onClick={handleButtonClick} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
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
                  <p className="text-xl font-bold text-gray-900">{overviewStats?.totalCourses}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-purple-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-xl font-bold text-gray-900">{overviewStats?.totalStudents}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGraduationCap} className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Completion</p>
                  <p className="text-xl font-bold text-gray-900">{overviewStats?.averageCompletion}%</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Time</p>
                  <p className="text-xl font-bold text-gray-900">{overviewStats?.averageTimeSpent}m</p>
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
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="space-y-6">
          {filteredCourses?.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseManagement;