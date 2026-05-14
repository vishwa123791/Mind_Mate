import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('userData');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setAuthToken(storedToken);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Simple login function that doesn't make additional API calls
  const login = (userData, token) => {
    try {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setAuthToken(token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login storage error:', error);
      return { success: false, message: error.message };
    }
  };

  // Register function - similar to login, just store the data
  const register = (userData, token) => {
    try {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setAuthToken(token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Register storage error:', error);
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setAuthToken(null);
    setUser(null);
  };

  // Computed property for authentication status
  const isAuthenticated = Boolean(authToken && user);

  // Auth context value
  const value = {
    user,
    authToken,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;