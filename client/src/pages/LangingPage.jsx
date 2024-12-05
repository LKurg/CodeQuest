import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Code,
  Terminal,
  Globe,
  Rocket,
  ChevronRight,
  BookOpen,
  Zap,
} from 'lucide-react';
import Navigation from '../Layout/Navigation';
import { useAuth } from '../context/AuthContext'; // Import the auth context

const LandingPage = () => {
  const { isAuthenticated } = useAuth(); // Access the authentication state

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const programmingLanguages = [
    { name: 'Python', icon: '🐍', color: 'bg-green-500' },
    { name: 'JavaScript', icon: '☕', color: 'bg-yellow-500' },
    { name: 'Java', icon: '♨️', color: 'bg-red-500' },
    { name: 'C++', icon: '🖥️', color: 'bg-indigo-500' },
    { name: 'React', icon: '⚛️', color: 'bg-cyan-500' },
    { name: 'TypeScript', icon: '📘', color: 'bg-blue-600' },
  ];

  const features = [
    {
      icon: <Terminal className="w-12 h-12 text-teal-600" />,
      title: 'Interactive Coding Environment',
      description: 'Learn through hands-on, real-world coding experiences.',
    },
    {
      icon: <Rocket className="w-12 h-12 text-orange-600" />,
      title: 'Accelerated Learning Paths',
      description:
        'Personalized curriculum designed to fast-track your programming skills.',
    },
    {
      icon: <Globe className="w-12 h-12 text-emerald-600" />,
      title: 'Global Developer Community',
      description: 'Connect and collaborate with learners from around the world.',
    },
  ];

  const codeChallenge = [
    { title: 'Algorithm Challenge', difficulty: 'Intermediate', points: 50 },
    { title: 'Web Development Sprint', difficulty: 'Advanced', points: 100 },
    { title: 'Data Structure Puzzle', difficulty: 'Beginner', points: 25 },
  ];

  return (
    <Navigation>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 grid md:grid-cols-2 items-center gap-12">
            <div className="space-y-6 text-left">
              <h1
                data-aos="fade-up"
                className="text-5xl font-bold text-gray-900 leading-tight"
              >
                Learn to Code,
                <br />
                <span className="text-teal-600">Transform Your Future</span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-xl text-gray-700 max-w-xl"
              >
                Master programming skills through interactive tutorials,
                real-world projects, and a supportive global community.
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex space-x-4"
              >
                {/* Dynamic Navigation */}
                <Link
                  to={isAuthenticated ? '/dashboard' : '/get-started'}
                  className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Start Learning
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-6 py-3 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition"
                >
                  View Courses
                </Link>
              </div>
            </div>

            <div
              data-aos="fade-left"
              className="flex justify-center items-center"
            >
              <img
                src={`images/coding.jpg`}
                alt="Coding Learning Platform"
                className="rounded-xl shadow-2xl max-h-[500px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Programming Languages */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              data-aos="fade-up"
              className="text-3xl font-bold text-center mb-12 text-gray-900"
            >
              Learn Popular Programming Languages
            </h2>
            <div
              data-aos="fade-up"
              className="grid md:grid-cols-6 grid-cols-3 gap-6"
            >
              {programmingLanguages.map((lang) => (
                <div
                  key={lang.name}
                  className={`flex flex-col items-center p-4 ${lang.color} text-white rounded-lg shadow-md hover:scale-105 transition`}
                >
                  <span className="text-4xl mb-2">{lang.icon}</span>
                  <span className="font-semibold">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Challenges */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              data-aos="fade-up"
              className="text-3xl font-bold text-center mb-12 text-gray-900"
            >
              Code Challenges
            </h2>
            <div
              data-aos="fade-up"
              className="grid md:grid-cols-3 gap-6"
            >
              {codeChallenge.map((challenge) => (
                <div
                  key={challenge.title}
                  className="bg-white border p-6 rounded-xl hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{challenge.title}</h3>
                    <Zap className="text-yellow-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">{challenge.difficulty}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-bold text-teal-600">
                      {challenge.points}
                    </span>
                  </div>
                  <Link
                    to="/challenges"
                    className="mt-4 block text-center w-full bg-teal-50 text-teal-600 py-2 rounded-lg hover:bg-teal-100 transition"
                  >
                    Start Challenge
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
};

export default LandingPage;
