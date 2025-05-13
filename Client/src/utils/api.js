// API utility functions for NiveshPath

// Using environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Make a request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise} - Response promise
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = { 
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${endpoint}`, data);
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Authentication API functions
 */
export const authAPI = {
  // Register a new user
  register: (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  // Login user
  login: (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  // Get current user
  getCurrentUser: () => {
    return apiRequest('/auth/me');
  },
  
  // Verify token
  verifyToken: () => {
    return apiRequest('/auth/me');
  }
};

/**
 * User onboarding API functions
 */
export const onboardingAPI = {
  // Submit user onboarding information
  submitOnboarding: (onboardingData) => {
    return apiRequest('/onboarding', {
      method: 'POST',
      body: JSON.stringify(onboardingData)
    });
  }
};

export default {
  authAPI,
  onboardingAPI
};