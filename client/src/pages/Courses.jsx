import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBook } from '@fortawesome/free-solid-svg-icons';
import { faNodeJs, faReact } from '@fortawesome/free-brands-svg-icons';
import CourseContent from './CourseContent';
import MainLayout from '../Layout/MainLayout';
import DashboardSidebar from '../Layout/DashboardSideBar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, onEnroll, onContinueLearning }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-4 bg-teal-500 text-white flex items-center justify-between">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faBook} size="2x" className="mr-4" />
          <h3 className="text-xl font-semibold">{course.title}</h3>
        </div>
        <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
          {course.difficulty || 'Intermediate'}
        </span>
      </div>
      <div className="p-5">
        <CourseContent content={course.description} />
        
        <div className="flex justify-between items-center mt-6">
          {course.isEnrolled ? (
            <button 
              className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
              onClick={() => onContinueLearning(course._id)}
            >
              Continue Learning
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={() => onEnroll(course._id)}
              className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
            >
              Enroll in Course
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = authState?.token;
        if (!token) {
          setError('Please log in');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/courses', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }); 

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
        console.log(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [authState?.token]); 

  const handleEnroll = async (courseId) => {
    try {
      const token = authState?.token;
      if (!token) {
        alert('Please log in first');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/users/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update the courses state to reflect the new enrollment status
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course._id === courseId 
              ? { ...course, isEnrolled: true } 
              : course
          )
        );
        alert('Successfully enrolled in the course!');
      } else {
        alert(data.message || 'Enrollment failed');
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      alert('An error occurred while enrolling');
    }
  };

  const handleContinueLearning = (courseId) => {
    // Navigate to the course learning page
    navigate(`/course/learn/${courseId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <MainLayout>
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar>
          <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">
                CodeQuest Learning Paths
              </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEnroll={handleEnroll}
                  onContinueLearning={handleContinueLearning}
                />
              ))}
            </div>

            {/* Recommended Learning Paths Section */}
            <div className="mt-10 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recommended Learning Paths</h2>
              <div className="grid md:grid-cols-3 gap-5">
                {[{
                  icon: faReact,
                  title: 'Modern Web Development',
                  description: 'Master frontend technologies and build interactive web applications',
                  color: 'text-teal-500'
                }, {
                  icon: faNodeJs,
                  title: 'Backend Engineering',
                  description: 'Learn server-side programming and build scalable backend systems',
                  color: 'text-green-500'
                }, {
                  icon: 'faCode',
                  title: 'Full Stack Mastery',
                  description: 'Comprehensive path covering both frontend and backend technologies',
                  color: 'text-purple-500'
                }].map(recommendation => (
                  <div key={recommendation.title} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <FontAwesomeIcon 
                      icon={recommendation.icon} 
                      className={`text-4xl mb-4 ${recommendation.color}`} 
                    />
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">
                      {recommendation.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {recommendation.description}
                    </p>
                    <button className="text-teal-600 hover:underline">
                      View Path
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardSidebar>
      </div>
    </MainLayout>
  );
}

export default Courses;