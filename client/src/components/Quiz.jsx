import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { CheckCircle, XCircle } from 'lucide-react';
import Navigation from '../Layout/Navigation';

function Quiz() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);
  const [codeOutput, setCodeOutput] = useState(null);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const runCodeAndValidate = async () => {
    const code = editorRef.current.getValue();
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
          language: 'python'
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
        setAnswers(new Array(quizData.questions.length).fill(null));
        setQuestionResults(new Array(quizData.questions.length).fill(null));
      } catch (err) {
        setError(`Unable to load quiz: ${err.message}`);
      }
    };
    
    fetchQuiz();
  }, [lessonId]);

  const handleAnswerSubmit = async () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.questionType === 'multipleChoice') {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.questionType === 'coding') {
      const codeResult = await runCodeAndValidate();
      isCorrect = codeResult && codeResult.passed;
    }

    const updatedAnswers = [...answers];
    const updatedQuestionResults = [...questionResults];
    
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    updatedQuestionResults[currentQuestionIndex] = isCorrect;
    
    setAnswers(updatedAnswers);
    setQuestionResults(updatedQuestionResults);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setCodeOutput(null);
    } else {
      await submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (submittedAnswers) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes/${quiz._id}/submit`, {
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

  const handleGoBack = () => {
    navigate(`/course/learn/${courseId}`);
  };

  if (error) return (
    <Navigation>
      <div className="text-red-600 p-6">{error}</div>
    </Navigation>
  );

  if (!quiz) return (
    <Navigation>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
      </div>
    </Navigation>
  );

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const renderQuestionResult = (index) => {
    const result = questionResults[index];
    if (result === null) return null;
    return result ? (
      <CheckCircle className="text-green-500 inline-block ml-2" />
    ) : (
      <XCircle className="text-red-500 inline-block ml-2" />
    );
  };

  const renderQuestionResultSection = () => {
    return (
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Previous Question Results</h3>
        <div className="flex space-x-2">
          {questionResults.map((result, index) => (
            <div 
              key={index} 
              className={`w-8 h-8 rounded-full ${
                result === true ? 'bg-green-500' : 
                result === false ? 'bg-red-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderQuizContent = () => {
    if (score !== 0) {
      return (
        <div className="text-center bg-gradient-to-r from-teal-400 to-blue-500 p-8 rounded-lg shadow-xl text-white">
          <h2 className="text-3xl font-bold mb-4">🎉 Quiz Completed! 🎉</h2>
          <p className="text-2xl">Your Score: {score} / {quiz.questions.length}</p>
          <div className="mt-4">
            {questionResults.map((result, index) => (
              <div 
                key={index} 
                className={`inline-block w-4 h-4 mx-1 rounded-full ${
                  result === true ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={handleGoBack}
            className="mt-6 bg-white text-teal-600 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-300"
          >
            Back to Course
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-xl">
        {renderQuestionResultSection()}
        
        <h2 className="text-2xl font-bold mb-6">
          Question {currentQuestionIndex + 1} 
          {renderQuestionResult(currentQuestionIndex)}
        </h2>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-lg mb-4">{currentQuestion.questionText}</p>
          
          {currentQuestion.questionType === 'multipleChoice' && (
            <div className="space-y-3">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={choice._id}
                  onClick={() => setSelectedAnswer(choice._id)}
                  className={`w-full text-left p-3 rounded-lg transition duration-300 ${
                    selectedAnswer === choice._id
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {choice.text || `Choice ${index + 1}`}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.questionType === 'coding' && (
            <div>
              <Editor
                height="300px"
                language="python"
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
              {codeOutput && (
                <div className={`mt-4 p-4 rounded ${
                  codeOutput.passed ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <pre>{codeOutput.output}</pre>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
            <button 
              onClick={handleAnswerSubmit}
              disabled={selectedAnswer === null}
              className="bg-teal-600 text-white px-6 py-3 rounded-full disabled:opacity-50 hover:bg-teal-700 transition duration-300"
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Navigation>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {renderQuizContent()}
      </div>
    </Navigation>
  );
}

export default Quiz;