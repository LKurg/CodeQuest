import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);
  const [loading, setLoading] = useState(true);

  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
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
        const user = JSON.parse(storedUser);
        setAuthState({
          token: storedToken,
          user: user,
          role: user.role, 
        
        },
    
        );
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // Log the received user data and role
    console.log('User Data:', userData);
    console.log('User Role:', userData.role);

    const authData = {
        user: userData,
        token: token,
        role: userData.role, 
    };

    console.log('Auth Data:', authData);
    
    setAuthState(authData);
    
  
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
   
    localStorage.setItem('userRole', userData.role);
};

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (authState?.token) {
        const isValid = validateToken(authState.token);
        if (!isValid) {
          logout();
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authState]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isAuthenticated: !!authState?.token,
        role: authState?.role, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider };
