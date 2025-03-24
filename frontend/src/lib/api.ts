import axios from 'axios';
import { toast } from 'react-hot-toast'; // Add this if you want toast notifications

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token from localStorage if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Network errors (no response)
    if (error.message === 'Network Error') {
      toast?.error('Unable to connect to the server. Please check your internet connection.');
      return Promise.reject(error);
    }
    
    // Timeout errors
    if (error.code === 'ECONNABORTED') {
      toast?.error('Request timed out. Please try again.');
      return Promise.reject(error);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Handle unauthorized error (redirect to login, etc.)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        
        // Only redirect if not already on the login page to avoid redirect loops
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/auth/login')) {
          window.location.href = '/auth/login?redirect=' + encodeURIComponent(currentPath);
        }
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      toast?.error('An unexpected error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;