// client/src/api/api.js
// This file sets up an Axios HTTP client instance.
// Axios simplifies network requests and allows us to automatically attach our JWT token
// to every outgoing request so protected routes succeed effortlessly.

import axios from 'axios';

// Base URL for the Express API server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: runs right before an HTTP request leaves the browser.
// If the user is logged in, we fetch their JWT from localStorage and set the Authorization header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bricknest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: captures responses or global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the token is expired or invalid, we can optionally clear user session
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth state or login attempt failed
      const isAuthCheck = error.config.url.includes('/auth/me');
      if (isAuthCheck) {
        localStorage.removeItem('bricknest_token');
        localStorage.removeItem('bricknest_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
