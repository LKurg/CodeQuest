import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Users, Copy, CheckCircle } from 'lucide-react';

const JoinQuizRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [avatar, setAvatar] = useState(''); // Store the avatar (either from Multiavatar or another source)
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  // Particle effect setup
  useEffect(() => {
    const initialParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      velocityX: (Math.random() - 0.5) * 3,
      velocityY: (Math.random() - 0.5) * 3,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.6 ? '#ffffff' : Math.random() > 0.3 ? '#8B5CF6' : '#A855F7',
    }));
    setParticles(initialParticles);

    let animationFrameId;
    const animate = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.velocityX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.velocityY + window.innerHeight) % window.innerHeight,
          velocityX: particle.velocityX * 0.99,
          velocityY: particle.velocityY * 0.99,
        }))
      );
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const joinRoom = async () => {
    if (roomCode && playerName) {
      try {
        const response = await fetch('http://localhost:5000/api/player/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerName }),
        });
  
        const data = await response.json();
       
        if (response.ok) {
          localStorage.setItem('playerId', data.player.playerId);  // Store playerId
          console.log('Player joined:', data);
          const PlayerId= localStorage.getItem('playerId');
        
          navigate(`/game/${roomCode}`);  // Navigate to the game room
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  
  

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#46178F] to-[#2C1063] overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `rotate(${particle.x * particle.y % 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Join Form */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4">Join Quiz</h1>
            <p className="text-white/80 text-xl">Enter room code to join the game</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter room code"
                  maxLength={6}
                />
              </div>

              <button
                onClick={joinRoom}
                className="w-full bg-purple-600 text-white py-3 rounded-xl shadow-xl hover:bg-purple-700 transition duration-200"
              >
                Join Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinQuizRoom;
