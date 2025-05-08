import axios from 'axios';

const api_for_userService = axios.create({
  baseURL: 'http://localhost:8081/api/auth',
});

// Add Authorization header to every request if token is present
api_for_userService.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Endpoint to login (no token needed)
export const loginUser = ({ username, password }) => {
  return api_for_userService.post('/login', { username, password });
};

// Authenticated call to fetch user details
export const getUserByUsername = username => {
  return api_for_userService.get(`/users/${username}`);
};

export default api_for_userService;
