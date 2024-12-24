import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faClock,
  faCode,
  faTrophy,
  faGraduationCap,
  faStar,
  faFire,
  faCalendar,
  faEdit,
  faCheck
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

const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} rounded-lg p-4`}>
    <div className="flex items-center gap-3">
      <FontAwesomeIcon icon={icon} className="text-xl" />
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const SkillCard = ({ skill, level, color }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium text-gray-700">{skill}</span>
      <span className={`${color} text-sm px-2 py-1 rounded-full`}>Level {level}</span>
    </div>
    <ProgressBar value={level} max={10} color={`bg-gradient-to-r ${color}`} />
  </div>
);

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Replace with actual API call using user ID from route params
        const response = await fetch(`http://localhost:5000/api/admin/users/6755969e557977a6c3a18d79`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        setUser(data);
        setEditedUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/1`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error('Failed to update user');
      
      setUser(editedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <AdminLayout><div className="text-center py-8">Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="text-red-500 text-center py-8">Error: {error}</div></AdminLayout>;
  if (!user) return <AdminLayout><div className="text-center py-8">User not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-6">
              <img
                src={user.avatar || '/api/placeholder/150/150'}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  {user.isPro && (
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-gray-500">{user.title}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Joined {new Date(user.joinedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={isEditing ? faCheck : faEdit} />
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              icon={faChartLine}
              label="Completion Rate"
              value="85%"
              color="bg-blue-50 text-blue-700"
            />
            <StatCard 
              icon={faClock}
              label="Learning Hours"
              value="126"
              color="bg-purple-50 text-purple-700"
            />
            <StatCard 
              icon={faTrophy}
              label="Quests Completed"
              value="24"
              color="bg-green-50 text-green-700"
            />
            <StatCard 
              icon={faFire}
              label="Current Streak"
              value="7 days"
              color="bg-orange-50 text-orange-700"
            />
          </div>
        </div>

        {/* Skills & Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
            <div className="space-y-4">
              <SkillCard 
                skill="Frontend Development"
                level={8}
                color="from-blue-500 to-blue-700 text-blue-700 bg-blue-50"
              />
              <SkillCard 
                skill="Backend Development"
                level={7}
                color="from-purple-500 to-purple-700 text-purple-700 bg-purple-50"
              />
              <SkillCard 
                skill="Database Management"
                level={6}
                color="from-green-500 to-green-700 text-green-700 bg-green-50"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Quests</h2>
            <div className="space-y-6">
              {user.currentQuests?.map((quest, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">{quest.title}</h3>
                    <span className="text-sm text-blue-600">{quest.progress}%</span>
                  </div>
                  <ProgressBar 
                    value={quest.progress}
                    max={100}
                    color="bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                  <p className="text-sm text-gray-500">{quest.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {user.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FontAwesomeIcon icon={faStar} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserProfile;