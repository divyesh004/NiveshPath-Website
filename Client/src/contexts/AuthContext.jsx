import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';
import apiService from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  
  // Register a new user
  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  // Login user
  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };
  
  // Check if user is authenticated
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await authAPI.getCurrentUser();
        setCurrentUser(userData.user);
        
        // Use local storage to track onboarding status since endpoint is not available
        const onboardingStatus = localStorage.getItem('onboardingCompleted');
        setOnboardingCompleted(onboardingStatus === 'true');
        
        // Note: Backend endpoint '/onboarding/status' is not implemented
        // We're using localStorage as a fallback mechanism
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, []);
  
  // Update onboarding status
  const updateOnboardingStatus = (status) => {
    setOnboardingCompleted(status);
    // Save onboarding status to localStorage as fallback mechanism
    localStorage.setItem('onboardingCompleted', status.toString());
  };

  // Context value
  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
    onboardingCompleted,
    updateOnboardingStatus
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;