import api_for_driveService from '../Servicesimpl/api_for_driveService';

export const getDrives = () => api_for_driveService.get('/drives');
export const addDrive = (drive) => api_for_driveService.post('/drives', drive);
export const deleteDrive = (id) => api_for_driveService.delete(`/drives/${id}`);
export const updateDrive = (id, drive) => api_for_driveService.put(`/drives/${id}`, drive);

