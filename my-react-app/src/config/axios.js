import axios from "axios";

const API = axios.create({
  baseURL: "https://e-commerce-er9b.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;