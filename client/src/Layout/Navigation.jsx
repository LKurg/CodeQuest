import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authState, login, logout } = useAuth();  // Ensure you're accessing the correct value here

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/logo.svg" alt="Code Quest" />
              </a>
            </div>

            {/* Navigation Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <a href="/home" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="/challenges" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Challenges
              </a>
              <a href="/leaderboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Leaderboard
              </a>
              <a href="/resources" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Resources
              </a>
              <a href="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </a>
            </div>

            {/* Right-side Buttons */}
            <div className="flex items-center">
              {authState ? (
                <>
                  <a href="/dashboard" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </a>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/get-started"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-4"
                >
                  Get Started
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex lg:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white shadow-lg">
              <div className="pt-2 pb-3 space-y-1">
                <a
                  href="/home"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Home
                </a>
                <a
                  href="/challenges"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Challenges
                </a>
                <a
                  href="/leaderboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Leaderboard
                </a>
                <a
                  href="/resources"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Resources
                </a>
                <a
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Profile
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Navigation;
