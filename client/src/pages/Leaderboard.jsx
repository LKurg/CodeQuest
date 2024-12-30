import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, Zap, Timer } from 'lucide-react';
import MainLayout from '../Layout/MainLayout';
import DashboardSidebar from '../Layout/DashboardSideBar';

const LeaderboardCard = ({ rank, user, xp, isCurrentUser }) => {
  const rankIcons = {
    1: { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    2: { icon: Medal, color: 'text-gray-500', bg: 'bg-gray-100' },
    3: { icon: Award, color: 'text-orange-500', bg: 'bg-orange-100' },
    default: { icon: Star, color: 'text-blue-500', bg: 'bg-blue-50' }
  };

  const { icon: RankIcon, color, bg } = rankIcons[rank] || rankIcons.default;

  return (
    <div 
      className={`p-4 rounded-lg mb-4 ${
        isCurrentUser 
          ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500' 
          : 'bg-white'
      } shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}>
            <RankIcon className={`w-6 h-6 ${color}`} />
            <span className="ml-1 font-bold">{rank}</span>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {user.username}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Zap className="w-4 h-4 text-yellow-500 mr-1" />
                {xp.toLocaleString()} XP
              </span>
              <span className="flex items-center">
                <Timer className="w-4 h-4 text-blue-500 mr-1" />
                {user.streak?.days || 0} day streak
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/users/leaderboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        const data = await response.json();
        setLeaderboardData(data.rankings);
        setUserRank(data.userRank);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error loading leaderboard: {error}
      </div>
    );
  }

  return (
    <MainLayout>
        <DashboardSidebar>
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
        <p className="text-gray-600">Compare your progress with other learners</p>
      </div>

      {userRank && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Ranking</h2>
          <div className="text-lg">
            <span className="font-bold">Rank: #{userRank.rank}</span>
            <span className="mx-4">|</span>
            <span className="text-yellow-500">
              <Zap className="w-5 h-5 inline mr-1" />
              {userRank.xp.toLocaleString()} XP
            </span>
            <span className="mx-4">|</span>
            <span className="text-blue-500">
              <Timer className="w-5 h-5 inline mr-1" />
              {userRank.streakDays} day streak
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Top Learners</h2>
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <LeaderboardCard
              key={entry.user._id}
              rank={index + 1}
              user={entry.user}
              xp={entry.xp}
              isCurrentUser={entry.user._id === userRank?.userId}
            />
          ))}
        </div>
      </div>
    </div>
    </DashboardSidebar>
    </MainLayout>
  );
};

export default Leaderboard;