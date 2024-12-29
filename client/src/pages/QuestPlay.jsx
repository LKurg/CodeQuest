import React, { useEffect, useState, useCallback, useRef } from 'react';
import Lottie from 'lottie-react';
import { Howl } from 'howler';
import victory from '../lottie/victory.json';
import { Shield, Timer, Trophy, Users, Check, X, Zap } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import FormattedContent from '../components/FormatedContent';


const QUESTION_TIME = 30;
const ANSWER_DISPLAY_TIME = 10;
const POINTS_PER_CORRECT = 15;
const NUM_PARTICLES = 50;
const TIMER_UPDATE_INTERVAL = 100;

const QuestPlay = () => {
  const [gameState, setGameState] = useState('playing');
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answerDisplayTimeLeft, setAnswerDisplayTimeLeft] = useState(ANSWER_DISPLAY_TIME);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [particles, setParticles] = useState([]);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);

  
  // Refs for managing intervals and game state
  const timerRef = useRef(null);
  const answerTimerRef = useRef(null);
  const socketRef = useRef(null);
  const gameStateRef = useRef({
    active: false,
    serverTime: 0,
    questionStartTime: 0,
  });

  const { roomCode } = useParams();
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
  // Function to update score on the server
  const updateScoreOnServer = async (newScore) => {
    const playerId = localStorage.getItem('playerId');
    
    try {
      const response = await fetch('http://localhost:5000/api/player/update-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: newScore,
          playerId,
          roomCode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update score');
      }

      const data = await response.json();
      console.log('Score updated successfully:', data);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.emit('joinRoom', roomCode);

    const handleGameState = (state) => {
      console.log('Received game state:', state);
      setGameState(state.status);
      setCurrentQuestion(state.currentQuestion);
      
      const now = Date.now();
      setServerTimeOffset(state.serverTime - now);
      gameStateRef.current = {
        active: true,
        serverTime: state.serverTime,
        questionStartTime: state.questionStartTime,
      };
    };

    const handleQuestionUpdate = (data) => {
      //console.log('Question update received:', data);
      
      // Clear existing timers
      clearInterval(timerRef.current);
      clearInterval(answerTimerRef.current);
      
      setCurrentQuestion(data.questionIndex);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setAnswerSubmitted(false);
      setTimeLeft(QUESTION_TIME);
      setAnswerDisplayTimeLeft(ANSWER_DISPLAY_TIME);
      
      gameStateRef.current = {
        ...gameStateRef.current,
        questionStartTime: data.questionStartTime,
      };
    };

    const handleShowAnswer = () => {
      setShowAnswer(true);
      startAnswerDisplayTimer();
    };

    const handleGameOver = () => {
      setGameState('finished');
      gameStateRef.current.active = false;
      clearInterval(timerRef.current);
      clearInterval(answerTimerRef.current);
    };

    // Add handler for player score updates
    const handlePlayerScoreUpdate = (data) => {
      if (data.playerId === localStorage.getItem('playerId')) {
        setScore(data.newScore);
      }
    };

    newSocket.on('gameState', handleGameState);
    newSocket.on('questionUpdate', handleQuestionUpdate);
    newSocket.on('showAnswer', handleShowAnswer);
    newSocket.on('gameOver', handleGameOver);
    newSocket.on('player-score-update', handlePlayerScoreUpdate);

    // Load quiz data
    loadQuizData();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      clearInterval(timerRef.current);
      clearInterval(answerTimerRef.current);
    };
  }, [roomCode]);

  // Load quiz data
  const loadQuizData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/player/game-quiz/${roomCode}`);
      if (!response.ok) throw new Error('Failed to fetch quiz data');
      const data = await response.json();
      setQuizData(data);
    } catch (error) {
      setErrorMessage('Failed to load quiz');
      console.error('Error:', error);
    }
  };

  // Handle answer display timer
  const startAnswerDisplayTimer = useCallback(() => {
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
  }, []);

  // Handle question timer
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

    timerRef.current = setInterval(updateTimer, TIMER_UPDATE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [gameState, showAnswer, serverTimeOffset, socket, roomCode]);

  // Handle answer selection
  const handleAnswerSelected = async (index) => {
    if (showAnswer || answerSubmitted) return;
    
    setSelectedAnswer(index);
    setAnswerSubmitted(true);
    
    const isCorrect = quizData.questions[currentQuestion].correctAnswerIndex === index;
    
    if (isCorrect) {
      const newScore = score + POINTS_PER_CORRECT;
      setScore(newScore);
      
      // Update score both via socket and HTTP
      await updateScoreOnServer(newScore);
      socket?.emit('updateScore', { roomCode, playerId: localStorage.getItem('playerId'), score: newScore });
      
      // Play correct answer sound
      if (soundsLoaded) {
        new Howl({ src: ['/sounds/bonus.mp3'] }).play();
      }
    } else if (soundsLoaded) {
      new Howl({ src: ['/sounds/wrong.mp3'] }).play();
    }
  };


  const getAnswerButtonStyle = (index) => {
    const baseStyle = `
      relative w-full p-8 text-xl font-bold rounded-2xl
      transition-all duration-300 transform
      flex items-center justify-between gap-4
      backdrop-blur-lg shadow-xl border
      group hover:shadow-2xl
    `;

    const getBackgroundStyle = () => {
      if (showAnswer) {
        if (index === quizData.questions[currentQuestion].correctAnswerIndex) {
          return 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-400 text-white';
        }
        if (index === selectedAnswer && index !== quizData.questions[currentQuestion].correctAnswerIndex) {
          return 'bg-gradient-to-r from-red-500 to-rose-500 border-red-400 text-white';
        }
        return 'bg-gradient-to-r from-gray-500/30 to-gray-600/30 border-gray-400/20 text-gray-400';
      }
      if (answerSubmitted && index === selectedAnswer) {
        return 'bg-gradient-to-r from-violet-500 to-purple-500 border-violet-400 text-white';
      }
      return `bg-gradient-to-r from-white/95 to-white/90 border-white/40 text-gray-800 
              hover:border-purple-300 hover:-translate-y-1 active:translate-y-0`;
    };

    return `${baseStyle} ${getBackgroundStyle()}`;
  };

  if (errorMessage || !quizData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-800">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
          <p className="text-2xl text-white">{errorMessage || 'Loading quiz...'}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="relative w-full min-h-screen   bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 overflow-hidden">

      <div className="fixed inset-0 pointer-events-none">
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0"
        />
      )}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {gameState === 'playing' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-3 rounded-xl">
                      <Trophy className="text-purple-100 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Current Score</p>
                      <p className="text-white text-2xl font-bold">{score}</p>
                    </div>
                  </div>
                  <Zap className="text-purple-400/30 w-8 h-8" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-3 rounded-xl">
                      <Users className="text-blue-100 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Question</p>
                      <p className="text-white text-2xl font-bold">{currentQuestion + 1}/{quizData.questions.length}</p>
                    </div>
                  </div>
                  <Shield className="text-blue-400/30 w-8 h-8" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-3 rounded-xl">
                      <Timer className="text-emerald-100 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-emerald-200 text-sm">Time Left</p>
                      <p className="text-white text-2xl font-bold">{timeLeft}s</p>
                    </div>
                  </div>
                  <div className="w-full max-w-[100px] bg-emerald-500/20 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
            <FormattedContent content={quizData.questions[currentQuestion].content} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizData.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={option._id}
                    onClick={() => handleAnswerSelected(index)}
                    disabled={showAnswer || answerSubmitted}
                    className={getAnswerButtonStyle(index)}
                  >
                    <span>{option.text}</span>
                    {showAnswer && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {index === quizData.questions[currentQuestion].correctAnswerIndex ? (
                          <div className="bg-white/20 p-2 rounded-xl">
                            <Check className="w-6 h-6" />
                          </div>
                        ) : index === selectedAnswer ? (
                          <div className="bg-white/20 p-2 rounded-xl">
                            <X className="w-6 h-6" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {showAnswer && (
              <div className="fixed bottom-8 right-8 animate-fade-in">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <Timer className="text-white w-6 h-6" />
                    <p className="text-white font-bold">
                      Next question in <span className="text-purple-300">{answerDisplayTimeLeft}s</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {gameState === 'finished' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto border border-white/20">
            <div className="relative">
              <Lottie animationData={victory} className="w-64 h-64 mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-purple-500/50 pointer-events-none" />
            </div>
            <h2 className="text-5xl font-bold text-center mb-8 text-white">Quiz Complete!</h2>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 inline-block mb-8">
                <p className="text-purple-200 text-sm">Final Score</p>
                <p className="text-4xl font-bold text-white">{score}</p>
              </div>
              <div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-xl
                           text-xl font-bold hover:from-purple-600 hover:to-indigo-600
                           transition-all duration-300 shadow-xl hover:shadow-2xl
                           hover:-translate-y-1 active:translate-y-0
                           border border-white/20"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestPlay;