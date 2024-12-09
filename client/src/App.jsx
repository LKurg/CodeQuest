import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tutorial from './pages/Tutorial';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LandingPage from './pages/LangingPage';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseTutorial from './pages/CourseTutorial';
import CreateCourse from './pages/CreateCourse';
import CreateQuize from './pages/CreateQuize';
import Quiz from './components/Quiz';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/get-started" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route path="/course/learn/:courseId" element={<CourseTutorial />} />

        {/* Admin-only routes */}
        <Route
          path="/admin/create-tutorial"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-quize"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateQuize />
            </ProtectedRoute>
          }
        />

        <Route path="/course/quize/:courseId/:lessonId" element={<Quiz />} />
        <Route
          path="/client/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
