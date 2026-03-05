import axios from "axios";

const API = axios.create({
  baseURL: "https://e-commerce-er9b.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json"
  },
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
    
    if (error.code === 'ERR_NETWORK' && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Retrying request - backend may be waking up...");
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      return API(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default API;
