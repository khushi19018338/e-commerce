import axios from "axios";

// Detect environment and set appropriate API URL
// - Development (localhost): Uses Vite proxy
// - Production (Vercel): Uses deployed backend URL
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

const API = axios.create({
  baseURL: isProduction 
    ? "https://e-commerce-er9b.onrender.com/api/v1" 
    : (import.meta.env.VITE_API_URL || "/api/v1"),
  timeout: 60000
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If network error and not yet retried, try up to 3 times
    if (error.code === 'ERR_NETWORK' && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = originalRequest._retryCount || 0;
      
      // Only retry up to 3 times
      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount++;
        console.log(`Retrying request (attempt ${originalRequest._retryCount})...`);
        
        // Wait longer between retries (5s, 10s, 15s)
        const delay = originalRequest._retryCount * 5000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return API(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
