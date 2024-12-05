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
      </Routes>
    </Router>
  );
}

export default App;
