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
          user: {
            ...user,
            subscription: user.subscription?.toLowerCase() || 'free' // Normalize subscription status
          },
          role: user.role,
          
        });
        console.log('this is the user:',user);
        
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // Normalize the subscription status to lowercase for consistent comparison
    const normalizedUserData = {
      ...userData,
      subscription: userData.subscription?.toLowerCase() || 'free'
    };

    const authData = {
      user: normalizedUserData,
      token: token,
      role: userData.role,
    
    };

  
    
    setAuthState(authData);
    localStorage.setItem('user', JSON.stringify(normalizedUserData));
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userData.role);

  };

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
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
        isPremium: authState?.user?.subscription === 'premium',
        subscription: authState?.user?.subscription
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