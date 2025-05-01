import axios from 'axios';

const api_for_driveService = axios.create({
  baseURL: 'http://localhost:8083', 
});


api_for_driveService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Injected token:", token);

  }
  else {
    console.log("❌ No token found in localStorage");

  }
  return config;
});

// export const updateDrive = (id, data) => {
//   console.log(`Updating drive with ID: ${id}`);
//   return api_for_driveService.put(`/drives/${id}`, data);
// };
export default api_for_driveService;