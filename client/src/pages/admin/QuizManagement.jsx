import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faQuestionCircle,
  faCheckCircle,
  faTimesCircle,
  faFilter,
  faSearch,
  faGamepad,
  faTrophy,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../Layout/AdminLayout';

const QuizCard = ({ quiz }) => {
  const passRate = Math.floor(Math.random() * 30) + 70; // Simulated pass rate
  const attempts = Math.floor(Math.random() * 1000) + 100; // Simulated attempts

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border-2 border-transparent hover:border-purple-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">PHP Fundamentals Quiz</h3>
          <p className="text-sm text-gray-500">{quiz.questions.length} Questions</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            Multiple Choice
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Backend
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Pass Rate</p>
          <p className="text-xl font-bold text-green-600">{passRate}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Attempts</p>
          <p className="text-xl font-bold text-blue-600">{attempts}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Avg. Time</p>
          <p className="text-xl font-bold text-purple-600">4:30</p>
        </div>
      </div>

      <div className="space-y-2">
        {quiz.questions.slice(0, 2).map((question, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between">
              <p className="text-sm text-gray-700 truncate">{question.questionText}</p>
              <span className="text-xs text-gray-500">
                {question.choices.filter(c => c.isCorrect).length} correct
              </span>
            </div>
          </div>
        ))}
        {quiz.questions.length > 2 && (
          <p className="text-sm text-gray-500 text-center">
            +{quiz.questions.length - 2} more questions
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-700">
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            Edit
          </button>
          <button className="text-purple-600 hover:text-purple-700">
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            Preview
          </button>
        </div>
        <button className="text-red-600 hover:text-red-700">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

const CreateQuizModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Create New Quiz</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter quiz title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500">
              <option>Frontend Development</option>
              <option>Backend Development</option>
              <option>Algorithms</option>
              <option>Database Design</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="difficulty" className="mr-2" />
                Beginner
              </label>
              <label className="flex items-center">
                <input type="radio" name="difficulty" className="mr-2" />
                Intermediate
              </label>
              <label className="flex items-center">
                <input type="radio" name="difficulty" className="mr-2" />
                Advanced
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Sample quiz data based on your structure
  const quizzes = [
    {
      _id: "6755c19d2fdba95db7fcfec9",
      lessonId: "6755bff32fdba95db7fcfe7a",
      questions: [
        {
          questionText: "What does PHP stand for",
          questionType: "multipleChoice",
          choices: [
            { text: "Private Home Page", isCorrect: false },
            { text: "PHP Hypertext Preprocessor", isCorrect: true },
            { text: "Personal Hypertext Processor", isCorrect: false },
            { text: "None of the above", isCorrect: false }
          ],
          correctChoice: 1
        },
        // ... other questions from your data
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quest Challenges</h1>
              <p className="text-gray-500">Create and manage coding quizzes</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create New Quiz
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGamepad} className="text-purple-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                  <p className="text-xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-xl font-bold text-gray-900">312</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faTrophy} className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-xl font-bold text-gray-900">84%</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faChartLine} className="text-yellow-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Score</p>
                  <p className="text-xl font-bold text-gray-900">76%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search quizzes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="algorithms">Algorithms</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizzes.map(quiz => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>

        <CreateQuizModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
      </div>
    </AdminLayout>
  );
};

export default QuizManagement;