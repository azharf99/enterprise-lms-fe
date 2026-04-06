import { axiosInstance } from './axiosInstance';

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description: string;
  created_at?: string;
}

// Mengambil daftar modul berdasarkan ID Kursus
export const getModulesByCourse = async (courseId: number | string): Promise<Module[]> => {
  const response = await axiosInstance.get(`/courses/${courseId}/modules`);
  return response.data.data;
};

// Membuat modul baru di dalam sebuah kursus
export const createModule = async (courseId: number | string, data: Partial<Module>): Promise<any> => {
  const response = await axiosInstance.post(`/courses/${courseId}/modules`, data);
  return response.data;
};

// Mengupdate modul (menggunakan endpoint global modul)
export const updateModule = async (moduleId: number, data: Partial<Module>): Promise<any> => {
  const response = await axiosInstance.put(`/modules/${moduleId}`, data);
  return response.data;
};

// Menghapus modul
export const deleteModule = async (moduleId: number): Promise<any> => {
  const response = await axiosInstance.delete(`/modules/${moduleId}`);
  return response.data;
};