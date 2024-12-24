import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Play, ArrowRight, Star } from 'lucide-react';
import MainLayout from '../Layout/MainLayout';
import CodeEditor from '../CodeEditor';

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
  const [editorOutput, setEditorOutput] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const XP_PER_QUESTION = 50;

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

  const validateCodeOutput = (output, expectedOutput) => {
    // Remove any whitespace and newlines from both outputs
    const normalizedOutput = output.run.output.replace(/\s+/g, '').toLowerCase();
    const normalizedExpected = expectedOutput.replace(/\s+/g, '').toLowerCase();
    return normalizedOutput === normalizedExpected;
};
  const updateUserXP = async (xpToAdd) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/update-xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          xpToAdd,
          courseId: courseId,
          quizId: quiz._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update XP');
      }
    } catch (err) {
      console.error('XP update error:', err);
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
          throw new Error(` ${errorText}`);
        }
    
        const quizData = await response.json();
        setQuiz(quizData);
        setTotalQuestions(quizData.questions.length);
        setAnswers(new Array(quizData.questions.length).fill(null));
      } catch (err) {
        setError(`${err.message}`);
      }
    };
    
    fetchQuiz();
  }, [lessonId]);

  const handleEditorRun = async (output) => {
    console.log('Output hahaha:', output);
    console.log('Editor Output:', editorOutput);
    console.log('Current Question Index:', quiz.questions);
    const currentQuestion = quiz.questions[currentQuestionIndex];
    console.log('Current Question:', currentQuestion);
    setEditorOutput(output.run.output);


    
    const isCorrect = validateCodeOutput(output, currentQuestion.correctAnswer);
    
    setQuestionFeedback({
      isCorrect,
      message: isCorrect 
        ? 'Your code produced the correct output!' 
        : 'The output doesn\'t match what we\'re looking for.Please make sure the output is exactly the same from what is asked !'
    });

    if (isCorrect) {
      const earnedXp = XP_PER_QUESTION;
      setXpEarned(prev => prev + earnedXp);
      setShowXPPopup(true);
      await updateUserXP(earnedXp);
      setCorrectAnswersCount(prev => prev + 1);
      
      setTimeout(() => {
        setShowXPPopup(false);
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setEditorOutput(null);
          setQuestionFeedback(null);
        } else {
          const updatedAnswers = [...answers];
          updatedAnswers[currentQuestionIndex] = output;
          submitQuiz(updatedAnswers);
        }
      }, 2000);
    }
  };

  const handleAnswerSubmit = async () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = currentQuestion.choices.find(
      choice => choice._id === selectedAnswer && choice.isCorrect
    );
    
    setQuestionFeedback({
      isCorrect,
      message: isCorrect 
        ? 'Correct! Great job!' 
        : 'Oops! That\'s not quite right.'
    });
  
    const earnedXp = isCorrect ? XP_PER_QUESTION : 0;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);
  
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      setXpEarned(prev => prev + earnedXp);
      setShowXPPopup(true);
      await updateUserXP(earnedXp);
      
      setTimeout(() => {
        setShowXPPopup(false);
      }, 2000);
    }
  
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setQuestionFeedback(null);
      } else {
        submitQuiz(updatedAnswers);
      }
    }, 2000);
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
      setScore(correctAnswersCount);
    } catch (err) {
      setError('Failed to submit quiz');
    }
  };

  const XPPopup = ({ xp }) => (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-yellow-400 text-white p-6 rounded-full shadow-xl animate-bounce flex items-center space-x-2">
        <Star className="w-10 h-10 text-white" />
        <span className="text-3xl font-bold">+{xp} XP</span>
      </div>
    </div>
  );

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

              <span className={`
                block transition-all duration-300
                ${isSelected && !questionFeedback ? 'text-teal-700' : 'text-gray-700'}
                ${isCorrect ? 'text-green-800' : ''}
                ${isIncorrect ? 'text-red-800 line-through' : ''}
              `}>
                {choice.text}
              </span>

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
    const language = extractLanguageFromTitle(currentQuestion.questionText);
    
    return (
      <div className="space-y-4">
        <CodeEditor
          defaultLanguage={language}
          onRunComplete={handleEditorRun}
          
        />
        
        {editorOutput && (
  <div className={`mt-4 p-4 rounded-lg ${
    questionFeedback?.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    <h3 className="font-semibold mb-2">Output:</h3>
    <pre className="whitespace-pre-wrap">{editorOutput}</pre>
    {questionFeedback && (
      <p className="mt-2 font-medium">{questionFeedback.message}</p>
    )}
  </div>
)}

      </div>
    );
  };

  const renderQuizContent = () => {
    if (score !== null) {
      return (
        <div className="text-center bg-gradient-to-r from-teal-400 to-blue-500 p-8 rounded-lg shadow-xl text-white animate-fade-in">
          {showXPPopup && <XPPopup xp={xpEarned} />}
          <h2 className="text-4xl font-bold mb-6">🎉 Quiz Completed! 🎉</h2>
          <div className="bg-white bg-opacity-20 p-6 rounded-xl">
            <p className="text-3xl mb-4">Your Score</p>
            <p className="text-5xl font-extrabold">
              {score} <span className="text-2xl">/ {totalQuestions}</span>
            </p>
            <p className="text-2xl mt-4">XP Earned: {xpEarned}</p>
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

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
      <div className=" mx-auto p-6 bg-white shadow-2xl rounded-xl animate-slide-in">
        {showXPPopup && <XPPopup xp={xpEarned} />}
        {renderProgressIndicator()}

        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Question {currentQuestionIndex + 1}
          </h2>
          <p className="text-lg text-gray-600">{currentQuestion.questionText}</p>
        </div>

        <div className="space-y-4">
          {currentQuestion.questionType === 'multipleChoice' && renderMultipleChoice()}
          {currentQuestion.questionType === 'coding' && renderCodingQuestion()}
        </div>

        {questionFeedback && currentQuestion.questionType === 'multipleChoice' && (
          <div className={`
            mt-4 p-4 rounded-lg text-center text-lg font-semibold
            ${questionFeedback.isCorrect 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'}
          `}>
            {questionFeedback.message}
          </div>
        )}

{currentQuestion.questionType === 'multipleChoice' && (
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
        )}
      </div>
    );
  };

  if (error) return (
    <MainLayout>
      <div className="flex justify-center items-center h-screen text-red-600 p-6">
        <div className="bg-red-50 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! </h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate(`/course/learn/${courseId}`)}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full"
          >
            Return to Course
          </button>
        </div>
      </div>
    </MainLayout>
  );

  if (!quiz) return (
    <MainLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        {renderQuizContent()}
      </div>
    </MainLayout>
  );
}

export default Quiz;