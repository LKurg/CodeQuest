import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGamepad, 
  faCheckCircle, 
  faTimesCircle, 
  faTrophy,
  faLightbulb,
  faCode,
  faRedo
} from '@fortawesome/free-solid-svg-icons';
import Editor from '@monaco-editor/react';
import Confetti from 'react-confetti';

// Expanded Quiz Questions
const PYTHON_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Write a function to calculate the factorial of a number recursively",
    starterCode: "def factorial(n):\n    # Your code here\n",
    testCases: [
      { input: [5], expectedOutput: 120 },
      { input: [0], expectedOutput: 1 },
      { input: [3], expectedOutput: 6 }
    ],
    hints: [
      "Use recursion to solve this problem",
      "Consider the base cases for factorial",
      "Recursive call should reduce the number by 1"
    ],
    difficulty: 'Easy'
  },
  {
    id: 2,
    question: "Create a function that checks if a number is prime",
    starterCode: "def is_prime(n):\n    # Your code here\n",
    testCases: [
      { input: [2], expectedOutput: true },
      { input: [7], expectedOutput: true},
      { input: [10], expectedOutput: false }
    ],
    hints: [
      "Check for divisibility from 2 to sqrt(n)",
      "Consider edge cases like 0 and 1",
      "Use a square root optimization for efficiency"
    ],
    difficulty: 'Medium'
  },
  {
    id: 3,
    question: "Implement a function to reverse a string",
    starterCode: "def reverse_string(s):\n    # Your code here\n",
    testCases: [
      { input: ["hello"], expectedOutput: "olleh" },
      { input: ["Python"], expectedOutput: "nohtyP" },
      { input: [""], expectedOutput: "" }
    ],
    hints: [
      "Use string slicing or list manipulation",
      "Consider different approaches like reverse indexing",
      "Handle edge cases like empty strings"
    ],
    difficulty: 'Easy'
  }
];

// Modal Component for Results and Feedback
const ResultModal = ({ isOpen, score, totalQuestions, onClose }) => {
  if (!isOpen) return null;

  const getFeedback = () => {
    const percentage = (score / (totalQuestions * 100)) * 100;
    if (percentage === 100) return "Perfect Score! 🏆 You're a Python Master!";
    if (percentage >= 75) return "Great Job! 👏 You're becoming a Python Pro!";
    if (percentage >= 50) return "Good Effort! 💪 Keep practicing!";
    return "Keep Learning! 📚 Practice makes perfect!";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Quiz Complete!</h2>
        <div className="text-6xl font-bold text-green-500 mb-4">{score}</div>
        <p className="text-xl mb-6">{getFeedback()}</p>
        <button 
          onClick={onClose} 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const PythonQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState(PYTHON_QUIZ_QUESTIONS[0].starterCode);
  const [quizResults, setQuizResults] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [score, setScore] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes total
  const editorRef = useRef(null);
  const timerRef = useRef(null);

  const currentQuestion = PYTHON_QUIZ_QUESTIONS[currentQuestionIndex];

  // Timer Logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          completeQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = () => {
    try {
      const testResults = currentQuestion.testCases.map(testCase => {
        const testFunction = new Function(
          ...testCase.input.map((_, i) => `arg${i}`), 
          `return (${code})(...arguments)`
        );

        const result = testFunction(...testCase.input);
        return result === testCase.expectedOutput;
      });

      const allTestsPassed = testResults.every(result => result);
      
      const newResult = {
        questionId: currentQuestion.id,
        passed: allTestsPassed,
        testResults
      };

      setQuizResults(prev => [...prev, newResult]);
      
      if (allTestsPassed) {
        setScore(prevScore => prevScore + 100);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      // Move to next question or complete quiz
      if (currentQuestionIndex < PYTHON_QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setCode(PYTHON_QUIZ_QUESTIONS[prev + 1].starterCode);
        setShowHints(false);
      } else {
        completeQuiz();
      }
    } catch (error) {
      console.error('Code execution error:', error);
    }
  };

  const completeQuiz = () => {
    clearInterval(timerRef.current);
    setShowResultModal(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen flex flex-col">
      {showConfetti && <Confetti />}
      <ResultModal 
        isOpen={showResultModal} 
        score={score} 
        totalQuestions={PYTHON_QUIZ_QUESTIONS.length * 100}
        onClose={() => setShowResultModal(false)}
      />
      <div className="container mx-auto p-6 flex-grow">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <FontAwesomeIcon icon={faGamepad} className="mr-3" />
              Python Code Challenge
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-xl font-semibold">
                Score: {score} <FontAwesomeIcon icon={faTrophy} className="ml-2 text-yellow-300" />
              </div>
              <div className="text-xl font-semibold">
                Time: {formatTime(timeRemaining)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Question Column */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FontAwesomeIcon icon={faCode} className="mr-2" />
                Challenge
              </h3>
              <p className="text-gray-700 mb-2">{currentQuestion.question}</p>
              <div className="text-sm text-gray-500 mb-4">
                Difficulty: {currentQuestion.difficulty}
              </div>
              
              <button 
                onClick={() => setShowHints(!showHints)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>

              {showHints && (
                <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">Hints:</h4>
                  <ul className="list-disc list-inside text-blue-800">
                    {currentQuestion.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Monaco Editor Column */}
            <div className="col-span-1">
              <Editor
                height="400px"
                theme="vs-dark"
                defaultLanguage="python"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
              <div className="flex space-x-4 mt-4">
                <button 
                  onClick={runCode}
                  className="flex-grow bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faRedo} className="mr-2" />
                  Run & Submit
                </button>
              </div>
            </div>

            {/* Results Column */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4">Test Results</h3>
              {quizResults.map((result, index) => (
                <div 
                  key={result.questionId} 
                  className={`mb-3 p-3 rounded-lg ${
                    result.passed ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Question {index + 1}</span>
                    <FontAwesomeIcon 
                      icon={result.passed ? faCheckCircle : faTimesCircle}
                      className={result.passed ? 'text-green-600' : 'text-red-600'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonQuiz;