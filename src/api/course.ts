import { axiosInstance } from './axiosInstance';

export interface Course {
  id: number;
  title: string;
  description: string;
  created_at?: string;
}

export const getCourses = async (): Promise<Course[]> => {
  const response = await axiosInstance.get('/courses');
  return response.data.data;
};

export const createCourse = async (data: Partial<Course>): Promise<any> => {
  const response = await axiosInstance.post('/courses', data);
  return response.data;
};

export const updateCourse = async (id: number, data: Partial<Course>): Promise<any> => {
  const response = await axiosInstance.put(`/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id: number): Promise<any> => {
  const response = await axiosInstance.delete(`/courses/${id}`);
  return response.data;
};