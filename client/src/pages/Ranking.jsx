import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Timer } from 'lucide-react';
import DOMPurify from 'dompurify';
import WinnerPodium from './WinnerPodium';
import { initParticlesEngine,Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
const QUESTION_TIME = 30;
const ANSWER_DISPLAY_TIME = 10;

const Ranking = () => {
  const { roomCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showAnswer, setShowAnswer] = useState(false);
  const [particles, setParticles] = useState([]);
  const [socket, setSocket] = useState(null);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [answerDisplayTimeLeft, setAnswerDisplayTimeLeft] = useState(ANSWER_DISPLAY_TIME);
  const [showWinners, setShowWinners] = useState(false);

  const timerRef = useRef(null);
  const answerTimerRef = useRef(null);
  const gameStateRef = useRef({
    active: false,
    serverTime: 0,
    questionStartTime: 0,
  });

  // Load quiz data
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/player/game-quiz/${roomCode}`);
        if (!response.ok) throw new Error('Failed to fetch quiz data');
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error('Error loading quiz data:', error);
      }
    };
    loadQuizData();
  }, [roomCode]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('joinRoom', roomCode);
    });

    newSocket.on('gameState', (state) => {
      setGameState(state.status);
      setCurrentQuestion(state.currentQuestion);
      
      const now = Date.now();
      setServerTimeOffset(state.serverTime - now);
      gameStateRef.current = {
        active: true,
        serverTime: state.serverTime,
        questionStartTime: state.questionStartTime,
      };
    });

    newSocket.on('questionUpdate', (data) => {
      setCurrentQuestion(data.questionIndex);
      setShowAnswer(false);
      setTimeLeft(QUESTION_TIME);
      setAnswerDisplayTimeLeft(ANSWER_DISPLAY_TIME);
      
      gameStateRef.current = {
        ...gameStateRef.current,
        questionStartTime: data.questionStartTime,
      };
    });
  

    newSocket.on('showAnswer', () => {
      setShowAnswer(true);
      startAnswerDisplayTimer();
    });

    newSocket.on('players-sync', (players) => {
      setPlayers(players.sort((a, b) => b.score - a.score));
    });

    newSocket.on('player-score-update', ({ playerId, newScore }) => {
      setPlayers(prevPlayers => {
        return prevPlayers.map(player =>
          player.playerId === playerId ? { ...player, score: newScore } : player
        ).sort((a, b) => b.score - a.score);
      });
    });

    return () => {
      newSocket.disconnect();
      clearInterval(timerRef.current);
      clearInterval(answerTimerRef.current);
    };
  }, [roomCode]);
  useEffect(() => {
    if (gameState === 'finished' && players.length > 0) {
      // Add a small delay before showing the winners podium
      const timer = setTimeout(() => {
        setShowWinners(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, players]);
  const startAnswerDisplayTimer = () => {
    clearInterval(answerTimerRef.current);
    setAnswerDisplayTimeLeft(ANSWER_DISPLAY_TIME);
    
    answerTimerRef.current = setInterval(() => {
      setAnswerDisplayTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(answerTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
    const [init, setInit] = useState(false);
  
    // Initialize particles
    useEffect(() => {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setInit(true);
      });
    }, []);
  
    const particlesOptions = {
      background: {
        opacity: 0
      },
      particles: {
        number: {
          value: 50
        },
        color: {
          value: "#ffffff"
        },
        opacity: {
          value: 0.3,
          random: true
        },
        size: {
          value: 3,
          random: true
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "bounce"
          }
        }
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse"
          }
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4
          }
        }
      }
    };

  useEffect(() => {
    if (gameState !== 'playing' || showAnswer) {
      clearInterval(timerRef.current);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const adjustedNow = now + serverTimeOffset;
      const questionStart = gameStateRef.current.questionStartTime;
      
      if (!questionStart) return;

      const elapsedTime = Math.floor((adjustedNow - questionStart) / 1000);
      const newTimeLeft = Math.max(0, QUESTION_TIME - elapsedTime);

      setTimeLeft(prev => {
        if (newTimeLeft <= 0 && prev > 0) {
          socket?.emit('timeUp', { roomCode });
          return 0;
        }
        return newTimeLeft;
      });
    };

    timerRef.current = setInterval(updateTimer, 100);
    return () => clearInterval(timerRef.current);
  }, [gameState, showAnswer, serverTimeOffset, socket, roomCode]);

  const getAnswerButtonStyle = (index) => {
    const baseStyle = `
      relative w-full p-6 text-xl font-semibold rounded-2xl
      transition-all duration-300 transform hover:scale-102
      flex items-center justify-between
      border-2 hover:shadow-lg
    `;

    if (showAnswer) {
      if (quizData?.questions[currentQuestion]?.correctAnswerIndex === index) {
        return `${baseStyle} bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400 text-white`;
      }
      return `${baseStyle} bg-gradient-to-r from-gray-500/30 to-gray-600/30 border-gray-400/20 text-gray-400`;
    }
    return `${baseStyle} bg-gradient-to-r from-white/95 to-white/90 border-white/40 text-gray-800 hover:border-purple-300`;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 overflow-hidden">
      {/* Background elements */}
     
      
      {/* Particles */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0"
        />
      )}

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Quiz Section */}
          {quizData && gameState === 'playing' && (
            <div className="lg:w-2/3 w-full">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <span className="bg-purple-500/20 text-purple-100 px-4 py-2 rounded-xl font-bold">
                      Q{currentQuestion + 1}/{quizData.questions.length}
                    </span>
                    <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-xl">
                      <Timer className="text-purple-100" size={20} />
                      <span className="text-xl font-bold text-purple-100">{timeLeft}s</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div 
                    className="text-2xl text-white mb-8 font-medium"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(quizData.questions[currentQuestion]?.content)
                    }}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizData.questions[currentQuestion]?.options.map((option, index) => (
                      <div
                        key={option._id}
                        className={getAnswerButtonStyle(index)}
                      >
                        <span 
                          className="flex-1"
                          dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(option.text)
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {showAnswer && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <p className="text-white text-center">
                      Next question in <span className="font-bold">{answerDisplayTimeLeft}</span> seconds...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rankings Section */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 sticky top-8">
              <h1 className="text-3xl font-bold text-white text-center mb-2">Live Rankings</h1>
              <p className="text-lg text-purple-200 text-center mb-8">
                Room: <span className="font-mono bg-purple-500/20 px-3 py-1 rounded-lg">{roomCode}</span>
              </p>

              <div className="space-y-4">
                {players.map((player, index) => (
                  <div
                    key={player.playerId}
                    className={`
                      relative overflow-hidden rounded-2xl p-4
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30' :
                        index === 1 ? 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border border-gray-400/30' :
                        index === 2 ? 'bg-gradient-to-r from-amber-700/20 to-amber-800/20 border border-amber-700/30' :
                        'bg-white/5 border border-white/10'}
                      transform transition-all duration-300 hover:scale-102 hover:shadow-lg
                    `}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className="w-12 h-12 rounded-full overflow-hidden bg-white/10"
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(player.avatar) 
                            }}
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-500/90 flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{player.name}</h3>
                          <p className="text-sm text-purple-200">Rank {index + 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{player.score}</p>
                        <p className="text-sm text-purple-200">points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Winners Podium */}
      {showWinners && <WinnerPodium topPlayers={players} />}
    </div>
  );
};

export default Ranking;