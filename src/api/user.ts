import { axiosInstance } from './axiosInstance';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  password?: string; // Hanya untuk form create/update
}

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/users');
  return response.data.data; 
};

export const importUsersCSV = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post('/users/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// --- AUTH & PROFILE ---

export const registerUser = async (data: Partial<User>): Promise<any> => {
  const response = await axiosInstance.post('/users/register', data);
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get('/users/profile');
  return response.data.data;
};

export const updateProfile = async (data: Partial<User>): Promise<any> => {
  const response = await axiosInstance.put('/users/profile', data);
  return response.data;
};

// --- TAMBAHAN CRUD (ADMIN) ---

export const createUser = async (data: Partial<User>): Promise<any> => {
  const response = await axiosInstance.post('/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: Partial<User>): Promise<any> => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<any> => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
