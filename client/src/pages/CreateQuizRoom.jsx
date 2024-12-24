import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Copy, CheckCircle, Plus, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';

const CreateQuizRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    { 
      questionContent: '', 
      options: ['', '', '', ''], 
      correctAnswer: 0 
    }
  ]);
  const navigate = useNavigate();

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'code-block'],
      ['clean']
    ]
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addQuestion = () => {
    setQuestions([...questions, { 
      questionContent: '', 
      options: ['', '', '', ''], 
      correctAnswer: 0 
    }]);
  };

  const removeQuestion = (indexToRemove) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, index) => index !== indexToRemove));
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'option') {
      const [optionIndex, optionValue] = value;
      newQuestions[index].options[optionIndex] = optionValue;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const validateQuiz = () => {
    if (!quizName.trim()) {
      throw new Error('Quiz name is required');
    }
    if (!roomCode.trim()) {
      throw new Error('Room code is required');
    }
    
    questions.forEach((question, index) => {
      if (!question.questionContent.trim()) {
        throw new Error(`Question ${index + 1} content is required`);
      }
      
      const validOptions = question.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        throw new Error(`Question ${index + 1} must have at least 2 valid options`);
      }
      
      if (question.correctAnswer >= validOptions.length) {
        throw new Error(`Question ${index + 1} has an invalid correct answer selection`);
      }
    });
  };

  const createRoom = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate inputs
      validateQuiz();

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to create a quiz');
      }

      // Format questions according to backend schema
      const formattedQuestions = questions.map(q => ({
        content: q.questionContent,
        options: q.options.map(optionText => ({
          text: optionText.trim()
        })).filter(opt => opt.text), // Remove empty options
        correctAnswerIndex: q.correctAnswer
      }));
      console.log('Formatted Questions', formattedQuestions);

      const response = await fetch('http://localhost:5000/api/game/create-quiz-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomCode,
          quizName,
          questions: formattedQuestions
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create quiz room');
      }

      navigate(`/join/room/${roomCode}`);
    } catch (err) {
      setError(err.message || 'An error occurred while creating the quiz room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
        
          <h1 className="text-3xl font-bold text-gray-800">Create Quiz Room</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Name</label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter quiz name"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Room Code</label>
              <button
                onClick={generateRoomCode}
                className="text-purple-600 hover:text-purple-700"
              >
                Generate New Code
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomCode}
                readOnly
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <button
                onClick={copyRoomCode}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="mb-6">
                  <ReactQuill
                    value={question.questionContent}
                    onChange={(content) => updateQuestion(index, 'questionContent', content)}
                    modules={quillModules}
                    className="bg-white rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option {optionIndex + 1}
                      </label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateQuestion(index, 'option', [optionIndex, e.target.value])}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer
                  </label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(index, 'correctAnswer', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    {question.options.map((_, i) => (
                      <option key={i} value={i}>Option {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
            <button
              onClick={createRoom}
              disabled={loading}
              className={`px-6 py-3 bg-purple-600 text-white rounded-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizRoom;