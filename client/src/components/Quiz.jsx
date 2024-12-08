import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { CheckCircle, XCircle, Play, ArrowRight } from 'lucide-react';
import Navigation from '../Layout/Navigation';

function Quiz() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [questionFeedback, setQuestionFeedback] = useState(null);
  const [codeOutput, setCodeOutput] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const extractLanguageFromTitle = (title) => {
    const languageMap = {
      'python': 'python',
      'javascript': 'javascript',
      'php': 'php',
      'java': 'java',
      'c++': 'cpp',
      'typescript': 'typescript'
    };

    const foundLanguage = Object.keys(languageMap).find(lang => 
      title.toLowerCase().includes(lang)
    );

    return foundLanguage ? languageMap[foundLanguage] : 'python';
  };

  const runCodeAndValidate = async () => {
    const code = editorRef.current.getValue();
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const language = extractLanguageFromTitle(currentQuestion.questionText);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code,
          language: language,
          expectedOutput: currentQuestion.correctAnswer
        })
      });

      const result = await response.json();
      setCodeOutput(result);
      return result;
    } catch (err) {
      console.error('Code execution error:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/quiz/${lessonId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch quiz: ${errorText}`);
        }
    
        const quizData = await response.json();
        setQuiz(quizData);
        setTotalQuestions(quizData.questions.length);
        setAnswers(new Array(quizData.questions.length).fill(null));
      } catch (err) {
        setError(`Unable to load quiz: ${err.message}`);
      }
    };
    
    fetchQuiz();
  }, [lessonId]);

  const handleAnswerSubmit = async () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    let isCorrect = false;
    let feedbackMessage = '';

    if (currentQuestion.questionType === 'multipleChoice') {
      isCorrect = currentQuestion.choices.find(
        choice => choice._id === selectedAnswer && choice.isCorrect
      );
      feedbackMessage = isCorrect 
        ? 'Correct! Great job!' 
        : 'Oops! Thats not quite right.';
    } else if (currentQuestion.questionType === 'coding') {
      const codeResult = await runCodeAndValidate();
      isCorrect = codeResult && codeResult.passed;
      feedbackMessage = isCorrect 
        ? 'Your code passed the test!' 
        : 'Your code didnt pass. Keep trying!';
    }

    setQuestionFeedback({
      isCorrect,
      message: feedbackMessage
    });

    // Update answers if correct
    if (isCorrect) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(updatedAnswers);

      // Move to next question or submit if last question
      setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setCodeOutput(null);
          setQuestionFeedback(null);
        } else {
          submitQuiz(updatedAnswers);
        }
      }, 2000);
    }
  };

  const submitQuiz = async (submittedAnswers) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quiz/${quiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          answers: submittedAnswers
        })
      });

      const result = await response.json();
      setScore(result.score);
    } catch (err) {
      setError('Failed to submit quiz');
    }
  };

  const renderProgressIndicator = () => {
    return (
      <div className="flex justify-center space-x-2 mb-4">
        {quiz.questions.map((_, index) => (
          <div 
            key={index} 
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index < currentQuestionIndex ? 'bg-green-500 w-6' : 
              index === currentQuestionIndex ? 'bg-teal-500 w-8' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderMultipleChoice = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.choices.map((choice) => {
          const isSelected = selectedAnswer === choice._id;
          const isCorrect = questionFeedback?.isCorrect && choice.isCorrect;
          const isIncorrect = questionFeedback && isSelected && !choice.isCorrect;

          return (
            <button
              key={choice._id}
              onClick={() => !questionFeedback && setSelectedAnswer(choice._id)}
              className={`
                relative transform transition-all duration-300 ease-in-out
                p-4 rounded-xl text-left text-lg font-medium
                border-2 group cursor-pointer
                ${isSelected && !questionFeedback 
                  ? 'bg-teal-100 border-teal-500 scale-105' 
                  : 'bg-white border-gray-200 hover:border-teal-300'}
                ${isCorrect ? 'bg-green-100 border-green-500' : ''}
                ${isIncorrect ? 'bg-red-100 border-red-500 opacity-70' : ''}
              `}
            >
              {/* Checkmark for correct/incorrect answers */}
              {questionFeedback && (
                <div className="absolute top-2 right-2">
                  {isCorrect && (
                    <div className="text-green-500">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  )}
                  {isIncorrect && (
                    <div className="text-red-500">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                </div>
              )}

              {/* Choice text with hover effect */}
              <span className={`
                block transition-all duration-300
                ${isSelected && !questionFeedback ? 'text-teal-700' : 'text-gray-700'}
                ${isCorrect ? 'text-green-800' : ''}
                ${isIncorrect ? 'text-red-800 line-through' : ''}
              `}>
                {choice.text}
              </span>

              {/* Subtle animation for selected state */}
              {isSelected && !questionFeedback && (
                <span className="absolute inset-0 border-2 border-teal-500 rounded-xl animate-ping opacity-50"></span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderCodingQuestion = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    return (
      <div className="space-y-4">
        <Editor
          height="300px"
          language={extractLanguageFromTitle(currentQuestion.questionText)}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
        <div className="flex items-center space-x-2">
          <button 
            onClick={runCodeAndValidate}
            className="bg-teal-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-teal-600 transition duration-300"
          >
            <Play size={16} />
            <span>Run Code</span>
          </button>
        </div>
        
        {codeOutput && (
          <div className={`mt-4 p-4 rounded-lg ${
            codeOutput.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <pre className="whitespace-pre-wrap">{codeOutput.output}</pre>
          </div>
        )}
      </div>
    );
  };

  const renderQuizContent = () => {
    // Quiz completed screen
    if (score !== null) {
      return (
        <div className="text-center bg-gradient-to-r from-teal-400 to-blue-500 p-8 rounded-lg shadow-xl text-white animate-fade-in">
          <h2 className="text-4xl font-bold mb-6">🎉 Quiz Completed! 🎉</h2>
          <div className="bg-white bg-opacity-20 p-6 rounded-xl">
            <p className="text-3xl mb-4">Your Score</p>
            <p className="text-5xl font-extrabold">
              {score} <span className="text-2xl">/ {totalQuestions}</span>
            </p>
          </div>
          <button 
            onClick={() => navigate(`/course/learn/${courseId}`)}
            className="mt-8 bg-white text-teal-600 px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          >
            Back to Course
          </button>
        </div>
      );
    }

    // Current question rendering
    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl animate-slide-in">
        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Question Header */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Question {currentQuestionIndex + 1}
          </h2>
          <p className="text-lg text-gray-600">{currentQuestion.questionText}</p>
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          {currentQuestion.questionType === 'multipleChoice' && renderMultipleChoice()}
          {currentQuestion.questionType === 'coding' && renderCodingQuestion()}
        </div>

        {/* Question Feedback */}
        {questionFeedback && (
          <div className={`
            mt-4 p-4  rounded-lg text-center text-lg  font-semibold
            ${questionFeedback.isCorrect 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'}
          `}>
            {questionFeedback.message}
          </div>
        )}

        {/* Submit/Next Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleAnswerSubmit}
            disabled={!selectedAnswer || questionFeedback?.isCorrect}
            className="
              bg-teal-600 text-white px-6 py-3 rounded-full 
              disabled:opacity-50 hover:bg-teal-700 
              transition duration-300 flex items-center space-x-2
              group
            "
          >
            <span>{currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}</span>
            <ArrowRight 
              className="
                w-5 h-5 transition-transform group-hover:translate-x-1
                group-disabled:translate-x-0
              " 
            />
          </button>
        </div>
      </div>
    );
  };

  // Loading and Error States
  if (error) return (
    <Navigation>
      <div className="flex justify-center items-center h-screen text-red-600 p-6">
        <div className="bg-red-50 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate(`/course/learn/${courseId}`)}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full"
          >
            Return to Course
          </button>
        </div>
      </div>
    </Navigation>
  );

  if (!quiz) return (
    <Navigation>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
      </div>
    </Navigation>
  );

  return (
    <Navigation>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        {renderQuizContent()}
      </div>
    </Navigation>
  );
}

export default Quiz;