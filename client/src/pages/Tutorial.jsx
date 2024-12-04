import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const TutorialCreator = () => {
  // State for tutorial metadata
  const [tutorialMetadata, setTutorialMetadata] = useState({
    language: '',
    title: '',
    description: '',
    difficulty: 'Beginner'
  });

  // State for sections
  const [sections, setSections] = useState([
    { 
      id: Date.now(), 
      title: '', 
      lessons: [{ 
        id: Date.now() + 1, 
        title: '', 
        theory: '', 
        code: '',
        expectedOutput: ''
      }] 
    }
  ]);

  // Add a new section
  const addSection = () => {
    setSections([
      ...sections, 
      { 
        id: Date.now(), 
        title: '', 
        lessons: [{ 
          id: Date.now() + 1, 
          title: '', 
          theory: '', 
          code: '',
          expectedOutput: ''
        }]
      }
    ]);
  };

  // Add a new lesson to a specific section
  const addLesson = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].lessons.push({
      id: Date.now(),
      title: '',
      theory: '',
      code: '',
      expectedOutput: ''
    });
    setSections(updatedSections);
  };

  // Update section details
  const updateSection = (sectionIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex][field] = value;
    setSections(updatedSections);
  };

  // Update lesson details
  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].lessons[lessonIndex][field] = value;
    setSections(updatedSections);
  };

  // Remove a section
  const removeSection = (sectionIndex) => {
    const updatedSections = sections.filter((_, index) => index !== sectionIndex);
    setSections(updatedSections);
  };

  // Remove a lesson from a section
  const removeLesson = (sectionIndex, lessonIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].lessons = updatedSections[sectionIndex].lessons
      .filter((_, index) => index !== lessonIndex);
    setSections(updatedSections);
  };

  // Submit tutorial
  const handleSubmit = () => {
    const tutorialData = {
      ...tutorialMetadata,
      sections
    };
    
    console.log('Full Tutorial Data:', tutorialData);
    // Implement your backend submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Create Interactive Tutorial
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Craft engaging, comprehensive learning experiences with intuitive course creation
          </p>
        </header>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Metadata Section */}
          <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 transform transition-all hover:scale-[1.02]">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-3 border-indigo-100">
                Tutorial Details
              </h2>
              
              {/* Language Selector with Enhanced Design */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-3">
                  Programming Language
                </label>
                <div className="relative">
                  <select 
                    value={tutorialMetadata.language}
                    onChange={(e) => setTutorialMetadata(prev => ({...prev, language: e.target.value}))}
                    className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-300 transition-all appearance-none"
                  >
                    <option value="">Select Language</option>
                    <option value="Python">Python</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="React">React</option>
                    <option value="TypeScript">TypeScript</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Input Fields with Enhanced Styling */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Tutorial Title</label>
                  <input 
                    type="text"
                    value={tutorialMetadata.title}
                    onChange={(e) => setTutorialMetadata(prev => ({...prev, title: e.target.value}))}
                    placeholder="Enter a compelling tutorial title"
                    className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-300 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea 
                    value={tutorialMetadata.description}
                    onChange={(e) => setTutorialMetadata(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe the tutorial's learning objectives and outcomes"
                    className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-300 transition-all h-32"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Difficulty Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setTutorialMetadata(prev => ({...prev, difficulty: level}))}
                        className={`p-2 rounded-lg transition-all ${
                          tutorialMetadata.difficulty === level 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sections and Lessons Section */}
          <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 transform transition-all hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-indigo-700 border-b pb-3 border-indigo-100">
                Tutorial Structure
              </h2>
              <button 
                onClick={addSection}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Section
              </button>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto space-y-6 pr-2">
              {sections.map((section, sectionIndex) => (
                <div key={section.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <input 
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                      placeholder="Section Title (e.g., Fundamentals of React)"
                      className="w-2/3 p-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-300"
                    />
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => addLesson(sectionIndex)}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all"
                        title="Add Lesson"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => removeSection(sectionIndex)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                        title="Delete Section"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <input 
                          value={lesson.title}
                          onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                          placeholder="Lesson Title"
                          className="w-2/3 p-2 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-300"
                        />
                        <button 
                          onClick={() => removeLesson(sectionIndex, lessonIndex)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                          title="Delete Lesson"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-gray-700 mb-2 font-semibold">Lesson Theory</label>
                          <textarea 
                            value={lesson.theory}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'theory', e.target.value)}
                            placeholder="Provide a detailed explanation of the lesson's key concepts"
                            className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-300 h-24"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2 font-semibold">Code Example</label>
                          <Editor
                            height="200px"
                            defaultLanguage={tutorialMetadata.language?.toLowerCase() || 'javascript'}
                            value={lesson.code}
                            onChange={(value) => updateLesson(sectionIndex, lessonIndex, 'code', value || '')}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              wordWrap: 'on'
                            }}
                            className="rounded-lg overflow-hidden shadow-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2 font-semibold">Expected Output</label>
                          <textarea 
                            value={lesson.expectedOutput}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'expectedOutput', e.target.value)}
                            placeholder="Describe the expected output or provide additional learning notes"
                            className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-300 h-24"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-right">
              <button 
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Create Tutorial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialCreator;