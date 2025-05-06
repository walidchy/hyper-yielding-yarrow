
import axios from 'axios';

// Set the correct API URL - Verify this matches your Laravel backend URL
const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased to 15 seconds for slower networks
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // No logging of requests - even in development mode
  return config;
}, (error) => {
  // Handle request error here
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Add a response interceptor to handle token expiration or unauthorized access
api.interceptors.response.use(
  response => {
    // No success logging
    return response;
  },
  (error) => {
    // More detailed error logging
    if (error.response) {
      console.error(`API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, 
                    error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        const isLoginAttempt = error.config?.url?.includes('/login');
        
        if (!isLoginAttempt) {
          // Only redirect for other 401 errors (like expired tokens)
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      
      // Add more specific error message handling
      if (error.response.data && error.response.data.message) {
        error.message = error.response.data.message;
      } else if (error.response.data && error.response.data.error) {
        error.message = error.response.data.error;
      }
    } else if (error.request) {
      console.error('API Request made but no response received:', error.request);
      error.message = 'No response from server. Please check your connection.';
    } else {
      console.error('API Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
