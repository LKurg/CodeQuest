import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronRight, faBook,   faCode } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import CourseContent from './CourseContent'; // Assuming you have this for rendering HTML content
import Navigation from '../Layout/Navigation';
import DashboardSidebar from '../Layout/DashboardSideBar';
import { faNodeJs, faReact } from '@fortawesome/free-brands-svg-icons';

const CourseCard = ({ course }) => {
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
        {/* Description of the course shown in the card */}
        <CourseContent content={course.description} />
        
        {/* Link to the course detail page */}
        <div className="flex justify-between items-center mt-6">
          <Link to={`/dashboard/course/learn/${course._id}`} className="flex items-center text-teal-600 hover:text-teal-800 transition-colors">
            Start Course
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

function Courses() {
  // State to hold courses data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses dynamically when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses'); // Update with your actual backend URL
        const data = await response.json();
        setCourses(data); 
        console.log('Fetched courses:', data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Navigation>
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar>
          <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">
                CodeQuest Learning Paths
              </h1>
            </div>

            {/* Display the courses dynamically */}
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
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
                  icon: faCode,
                  title: 'Full Stack Mastery',
                  description: 'Comprehensive path covering both frontend and backend technologies',
                  color: 'text-purple-500'
                }].map(recommendation => (
                  <div key={recommendation.title} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <FontAwesomeIcon icon={recommendation.icon} className={`text-4xl mb-4 ${recommendation.color}`} />
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{recommendation.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{recommendation.description}</p>
                    <button className="text-teal-600 hover:underline">View Path</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardSidebar>
      </div>
    </Navigation>
  );
}

export default Courses;
