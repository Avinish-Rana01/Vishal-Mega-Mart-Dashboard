import  { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('vmm_user');
    if (storedUser) {
      setIsLoggedIn(true);
      setLoggedInUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (user) => {
    const username = user || 'Admin User';
    setLoggedInUser(username);
    setIsLoggedIn(true);
    localStorage.setItem('vmm_user', username);
  };

  const logout = () => {
    setLoggedInUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('vmm_user');
  };

  if (loading) {
    // Optionally return a loader here while checking auth status
    return <div className="se-pre-con"></div>;
  }

  const value = {
    isLoggedIn,
    loggedInUser,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
