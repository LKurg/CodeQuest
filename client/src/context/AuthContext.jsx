import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);
  const [loading, setLoading] = useState(true);


  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      const isExpired = payload.exp * 1000 < Date.now(); // Check if token has expired
      return !isExpired;
    } catch (err) {
      console.error('Token validation failed:', err);
      return false;
    }
  };


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const isValid = validateToken(storedToken);
      if (isValid) {
        setAuthState({
          token: storedToken,
          user: JSON.parse(storedUser),
        });
      } else {
        logout(); // Token is invalid or expired, clear the auth state
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, token) => {
    const authData = {
      user: userData,
      token: token,
    };

    setAuthState(authData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // Logout function
  const logout = () => {
    setAuthState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Regular token validation (Optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (authState?.token) {
        const isValid = validateToken(authState.token);
        if (!isValid) {
          logout();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [authState]);

  if (loading) {
    return null; // Render nothing while loading
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isAuthenticated: !!authState?.token, // Boolean indicating authentication status
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider };
