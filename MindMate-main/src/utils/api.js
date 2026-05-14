// API Configuration for Mental Health Care App
export const API_BASE = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API_BASE_URL || 'http://localhost:5000'
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// API request function
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Handle authentication errors
export const handleAuthError = () => {
  localStorage.removeItem('authToken');
  if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/register') {
    window.location.href = '/auth/login';
  }
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me'
  },
  COUNSELORS: {
    GET_ALL: '/api/counselors',
    GET_BY_ID: (id) => `/api/counselors/${id}`
  }
};