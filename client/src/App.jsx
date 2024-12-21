import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tutorial from './pages/Tutorial';
import Signup from './pages/Signup';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseTutorial from './pages/CourseTutorial';
import CreateCourse from './pages/CreateCourse';
import CreateQuize from './pages/CreateQuize';
import Quiz from './components/Quiz';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import AdminHome from './pages/admin/AdminHome';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import Users from './pages/admin/Users';
import QuizManagement from './pages/admin/QuizManagement';
import CourseManagement from './pages/admin/CourseManagement';
import LandingPage from './pages/LandingPage';
import UpgradePage from './pages/UpgradePage';
import SubscriptionSuccess from './components/SubscriptionSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
        path='/forgot-password'
        element={<ForgotPassword/>}
        /> 
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute >
              <UpgradePage />
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
        <Route
          path="/subscription/success"
          element={
            <ProtectedRoute>
              <SubscriptionSuccess/>
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
          path="/admin/quizzes"
          element={
            <ProtectedRoute requiredRole="admin">
              <QuizManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute requiredRole="admin">
              <CourseManagement />
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
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Users />
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
