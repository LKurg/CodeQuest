import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Copy, CheckCircle, User, Play } from 'lucide-react';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000';
const socket = io(API_BASE_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5
});

const PlayerAvatar = ({ player, index }) => {
  const createSVGMarkup = () => {
    return { __html: player.avatar };
  };

  return (
    <div
      className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-[pop-in_0.5s_ease-out_forwards] overflow-hidden"
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={createSVGMarkup()}
      />
    </div>
  );
};

const Room = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState([]);
  const [timer, setTimer] = useState(30);
  const [isStarting, setIsStarting] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Socket connection and reconnection handling
  useEffect(() => {
   
    const setupSocket = () => {
      socket.on('connect', () => {
        console.log('Connected to socket server');
        setSocketConnected(true);
       
        socket.emit('enterRoom', roomCode);
      
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setSocketConnected(false);
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
        setSocketConnected(true);
      });

      // Request initial player list when connecting
      socket.emit('requestPlayers', roomCode);
   
    };
    

    setupSocket();

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('reconnect');
    };
  }, [roomCode]);

  // Player updates handling
  useEffect(() => {
   console.log('Room code:', roomCode);
    socket.on('players-sync', (playerList) => {

      console.log('Received player list:', playerList);
      setPlayers(playerList);
    });

    // Real-time player updates
    socket.on('player-joined', (newPlayer) => {
      console.log('New player joined:', newPlayer);
      setPlayers(prevPlayers => {
        // Check if player already exists to prevent duplicates
        if (!prevPlayers.some(p => p.playerId === newPlayer.playerId)) {
          return [...prevPlayers, newPlayer];
        }
        return prevPlayers;
      });
    });

    socket.on('player-removed', (playerId) => {
      console.log('Player removed:', playerId);
      setPlayers(prevPlayers => prevPlayers.filter(p => p.playerId !== playerId));
    });

    socket.on('game-started', () => {
      navigate(`/game/${roomCode}`);
    });

    return () => {
      socket.off('player-sync');
      socket.off('player-joined');
      socket.off('player-removed');
      socket.off('game-started');
    };
  }, [roomCode, navigate])
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startGame = async () => {
    try {
      setIsStarting(true);
  
      // Send POST request to /start-game
      const response = await fetch(`${API_BASE_URL}/api/game/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomCode }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to start the game');
      }
  
      const data = await response.json();

     
      navigate(`/ranking/${roomCode}`);
    } catch (error) {
      console.error('Error starting the game:', error);
      setIsStarting(false); // Reset the starting state on failure
    }
  };
  

  const removePlayer = (playerId) => {
    socket.emit('remove-player', { roomCode, playerId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Room Info & Players */}
          <div className="space-y-6">
            {/* Room Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-800">Join Room</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-gray-600" />
                  <span className="text-xl font-bold text-gray-600">
                    {players.length} / 50
                  </span>
                </div>
              </div>

              {/* Room Code Display */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Room Code
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl p-4">
                    <span className="text-4xl font-bold tracking-wider text-gray-800">
                      {roomCode}
                    </span>
                  </div>
                  <button
                    onClick={copyRoomCode}
                    className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Copy className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Start Game Button */}
              <button
                onClick={startGame}
                disabled={players.length < 1 || isStarting}
                className="w-full py-4 bg-purple-600 text-white rounded-xl text-xl font-bold hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6" />
                {isStarting ? `Starting in ${timer}s` : 'Start Game'}
              </button>
            </div>

            {/* Player List */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Players</h2>
                <span className="text-sm text-gray-600">
                  Click on a player to remove them
                </span>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex flex-wrap gap-4">
                  {players.map((player, index) => (
                    <div key={player._id} onClick={() => removePlayer(player.playerId)}>
                      <PlayerAvatar player={player} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Display for Players */}
          <div className="bg-purple-900 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[600px]">
            <h2 className="text-4xl font-bold text-white mb-8">Join the Game!</h2>
            
            {/* Large Room Code Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 w-full text-center">
              <div className="text-7xl font-bold text-white tracking-wider mb-4">
                {roomCode}
              </div>
              <p className="text-white/80 text-xl">Enter this code to join</p>
            </div>

            {/* Player Count and Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <User className="w-12 h-12 text-white/80" />
                <span className="text-5xl font-bold text-white">
                  {players.length}
                </span>
              </div>
              <p className="text-white/80 text-xl">
                {isStarting 
                  ? `Starting in ${timer} seconds...`
                  : 'Players have joined'}
              </p>
            </div>

            {/* Player Avatars */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {players.map((player, index) => (
                <PlayerAvatar key={player._id} player={player} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pop-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Room;