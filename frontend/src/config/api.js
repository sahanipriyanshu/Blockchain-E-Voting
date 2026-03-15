// Centralized API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// For development with Vite proxy, use relative URLs
// For production, use full URLs
const getApiUrl = () => {
  if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
    // Use proxy in development
    return '/api';
  }
  return API_BASE_URL;
};

export const API_URL = getApiUrl();

export default API_URL;



