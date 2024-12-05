import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log(storedToken);

    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setAuthState({
        token: storedToken,
        user: JSON.parse(storedUser)
      });
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const authData = {
      user: userData,
      token: token
    };
    
    setAuthState(authData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ 
      authState, 
      login, 
      logout,
      isAuthenticated: !!authState?.token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider };