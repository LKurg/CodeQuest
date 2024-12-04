import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// AuthProvider component to manage authentication state
const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log('Auth State:', authState);
  }, [authState]);

  const login = (userData) => {
    setAuthState(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider };