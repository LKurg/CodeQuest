import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faEllipsisVertical,
  faCode,
  faTrophy,
  faFire,
  faStar,
  faGem,
  faCodeBranch,
  faTerminal,
  faGraduationCap,
  faChartLine
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

const AchievementBadge = ({ icon, color, count }) => (
  <div className={`${color} p-2 rounded-full relative`}>
    <FontAwesomeIcon icon={icon} className="text-white" />
    {count && (
      <span className="absolute -top-1 -right-1 bg-white rounded-full text-xs px-1 shadow-sm">
        {count}
      </span>
    )}
  </div>
);

const CodingLevel = ({ level, title }) => (
  <div className="flex items-center gap-2 text-sm font-medium">
    <div className={`w-3 h-3 rounded-full ${
      level >= 8 ? 'bg-purple-500' :
      level >= 6 ? 'bg-blue-500' :
      level >= 4 ? 'bg-green-500' :
      'bg-gray-500'
    }`} />
    {title}
  </div>
);

const UserCard = ({ user }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border-2 border-transparent hover:border-blue-500">
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        <div className="relative">
          <img
            src={user.avatar || '/api/placeholder/150/150'}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500"
          />
          <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Lvl {user.level}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{user.name}</h3>
            {user.isPro && (
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                PRO
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{user.title}</p>
          <div className="flex items-center gap-3 mt-2">
            <CodingLevel level={user.skills.frontend} title="Frontend" />
            <CodingLevel level={user.skills.backend} title="Backend" />
    
          </div>
        </div>
      </div>
    </div>

    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">Current Quest Progress</span>
        <span className="text-sm text-blue-600">{user.currentQuest.progress}%</span>
      </div>
      <ProgressBar 
        value={user.currentQuest.progress} 
        max={100} 
        color="bg-gradient-to-r from-blue-500 to-purple-500" 
      />
    </div>

    <div className="mt-4 flex justify-between items-center">
      <div className="flex gap-2">



      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          View Profile
        </button>
        <button className="px-3 py-1 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
          Manage
        </button>
      </div>
    </div>
  </div>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    activeQuesters: 0,
    questsCompleted: 0,
    learningHours: 0,
    avgCompletion: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        
        const response = await fetch(
          `http://localhost:5000/api/admin/users/analytics?page=${page}&search=${searchTerm}&skillLevel=${filter}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users);
        setStats(data.dashboardStats);
        setTotalPages(data.pagination.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchTerm, filter]);

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-500 text-center p-4">
          Error: {error}
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
              <h1 className="text-2xl font-bold text-gray-900">Code Questers</h1>
              <p className="text-gray-500">Track and manage user progress</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              Add New Quester
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faTerminal} className="text-blue-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Active Questers</p>
                  <p className="text-xl font-bold text-gray-900">{stats.activeQuesters.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faTrophy} className="text-purple-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Quests Completed</p>
                  <p className="text-xl font-bold text-gray-900">{stats.questsCompleted.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGraduationCap} className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Learning Hours</p>
                  <p className="text-xl font-bold text-gray-900">{stats.learningHours.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faChartLine} className="text-yellow-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Completion</p>
                  <p className="text-xl font-bold text-gray-900">{stats.avgCompletion}%</p>
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
              placeholder="Search questers..."
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
              <option value="all">All Levels</option>
              <option value="beginner">Beginners</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* User Grid */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.map(user => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users;