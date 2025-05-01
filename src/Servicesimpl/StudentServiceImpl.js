import axios from './api_for_studentService'; // axios instance with JWT header

export const fetchStudents = async (page = 0, size = 10) =>
  axios.get('/students', {
    params: { page, size }
  });

export const addStudent = async (data) => axios.post('/students', data);

export const searchStudents = async (query) =>
  axios.get(`/students/search?query=${query}`);

export const markVaccinated = async (id, vaccineName, date) =>
  axios.put(`/students/vaccinate/${id}?vaccineName=${vaccineName}&date=${date}`);

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/students/upload', formData);
};