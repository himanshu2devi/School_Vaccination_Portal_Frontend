
import axios from 'axios';

const api_for_studentService = axios.create({
  baseURL: 'http://localhost:8082' 
});

api_for_studentService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api_for_studentService;