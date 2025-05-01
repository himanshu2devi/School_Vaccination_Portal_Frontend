import axios from 'axios';
//import api_for_userService from './api_for_userservice';

const api_for_userService = axios.create({
  baseURL: 'http://localhost:8081/api/auth', 
});

export default api_for_userService;