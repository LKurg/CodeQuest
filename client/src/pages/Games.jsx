import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import { Plus, Users, Gamepad2, Loader2 } from 'lucide-react';

const Games = () => {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/game/challenges', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch challenges');
        const data = await response.json();
        setChallenges(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleGameClick = (roomCode) => {
    navigate(`/room/${roomCode}`);
  };

  const handleNewChallenge = () => {
    navigate('/create-room');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-gray-600 font-medium">Loading challenges...</span>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Games</h1>
              <p className="text-gray-600">Join an existing game or create a new challenge</p>
            </div>
            <button
              onClick={handleNewChallenge}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Challenge
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <span className="font-medium">Error:</span>
                <span className="ml-2">{error}</span>
              </div>
            </div>
          )}

          {challenges.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge, index) => (
                <div
                  key={index}
                  onClick={() => handleGameClick(challenge.roomCode)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Gamepad2 className="w-6 h-6 text-indigo-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        {challenge.quizName}
                      </h2>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                        Room: {challenge.roomCode}
                      </div>
                      {challenge.playerCount && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          {challenge.playerCount} players
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8">
              <div className="text-center">
                <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No games available at the moment.<br />
                  Create a new challenge to get started!
                </p>
                <button
                  onClick={handleNewChallenge}
                  className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Challenge
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Games;