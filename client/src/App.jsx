import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tutorial from './pages/Tutorial';

import Signup from './pages/Signup';
import Login from './pages/Login'; // Import Login
import LandingPage from './pages/LangingPage';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseTutorial from './pages/CourseTutorial';
import CreateCourse from './pages/CreateCourse';
import CreateQuize from './pages/CreateQuize';

import Quiz from './components/Quiz';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/get-started" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/courses" element={<Courses />} />
        <Route path="/course/learn/:courseId" element={<CourseTutorial />} />

        <Route path='/admin/create-tutorial' element={<CreateCourse/>}/>
        <Route path='/admin/create-quize' element={<CreateQuize/>}/>
        <Route path="/course/quize/:courseId/:lessonId" element={<Quiz />} />
        <Route path='/client/progress'element={<Progress/> }/>
        <Route path="/client/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
