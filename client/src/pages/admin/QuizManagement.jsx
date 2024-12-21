import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { 
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faQuestionCircle,
  faCheckCircle,
  faTimesCircle,
  faFilter,
  faSearch,
  faGamepad,
  faTrophy,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../Layout/AdminLayout';

const QuizCard = ({ quiz }) => {
  const { metrics, performance, courseInfo } = quiz;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border-2 border-transparent hover:border-purple-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            {courseInfo?.courseTitle || 'Untitled Quiz'}
          </h3>
          <p className="text-sm text-gray-500">{quiz.metrics?.totalQuestions || 0} Questions</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            Multiple Choice
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {courseInfo?.sectionTitle || 'General'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Pass Rate</p>
          <p className="text-xl font-bold text-green-600">{metrics?.passRate || 0}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Attempts</p>
          <p className="text-xl font-bold text-blue-600">{metrics?.totalAttempts || 0}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Avg Score</p>
          <p className="text-xl font-bold text-yellow-600">{metrics?.averageScore || 0}%</p>
        </div>
      </div>

      <div className="space-y-2">
        {performance?.questions?.slice(0, 2).map((question, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between">
              <p className="text-sm text-gray-700 truncate">{question.questionText}</p>
              <span className="text-xs text-gray-500">
                {question.successRate}% success rate
              </span>
            </div>
          </div>
        ))}
        {(performance?.questions?.length > 2) && (
          <p className="text-sm text-gray-500 text-center">
            +{performance.questions.length - 2} more questions
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-700">
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            Edit
          </button>
          <button className="text-purple-600 hover:text-purple-700">
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            Preview
          </button>
        </div>
        <button className="text-red-600 hover:text-red-700">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

const QuizManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    averagePassRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/admin/quiz/data', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }

        const data = await response.json();
        
        if (data.success) {
          setQuizzes(data.data);
          setStats(data.stats);
        } else {
          throw new Error(data.message || 'Failed to fetch quiz data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching quiz data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleClick = () => {
    navigate('/admin/create-quize');
  };

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(quiz => {
    const searchMatch = quiz.courseInfo?.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       quiz.courseInfo?.sectionTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const filterMatch = filter === 'all' || quiz.courseInfo?.sectionTitle?.toLowerCase() === filter;
    return searchMatch && filterMatch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">Loading quiz data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quest Challenges</h1>
              <p className="text-gray-500">Create and manage coding quizzes</p>
            </div>
            <button 
              onClick={handleClick}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create New Quiz
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGamepad} className="text-purple-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalQuizzes}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalQuestions}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faTrophy} className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Attempts</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalAttempts}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faChartLine} className="text-yellow-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Pass Rate</p>
                  <p className="text-xl font-bold text-gray-900">{stats.averagePassRate}%</p>
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
              placeholder="Search quizzes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="algorithms">Algorithms</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuizzes.map(quiz => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuizManagement;