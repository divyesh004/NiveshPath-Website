import axios from 'axios';
import { API_URL } from '../config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service object with methods for different endpoints
const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verifyToken: () => api.get('/auth/verify'),
  },
  
  // User endpoints
  user: {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (profileData) => api.put('/user/profile', profileData),
  },
  
  // Onboarding endpoints
  onboarding: {
    submitOnboarding: (onboardingData) => api.post('/onboarding', onboardingData),
    getOnboardingStatus: () => api.get('/onboarding/status'),
  },
  
  // Tools endpoints
  tools: {
    calculateSIP: (data) => api.post('/tools/sip', data),
    calculateEMI: (data) => api.post('/tools/emi', data),
    createBudget: (data) => api.post('/tools/budget', data),
  },
  
  // External data endpoints
  external: {
    getRBIData: () => api.get('/external/rbi-news'),
    getMarketData: () => api.get('/external/markets'),
    getCurrencyRates: () => api.get('/external/currency'),
  },
  
  // Chatbot endpoints
  chatbot: {
    sendMessage: (message) => api.post('/chatbot/query', { query: message }),
    getHistory: () => api.get('/chatbot/history'),
  },
};

export default apiService;