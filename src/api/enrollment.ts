import { axiosInstance } from './axiosInstance';
import type { User } from './user';

export interface Enrollment {
  id: number;
  course_id: number;
  user_id: number;
  user?: User;
}

export const getEnrolledStudents = async (courseId: string | number): Promise<Enrollment[]> => {
  const response = await axiosInstance.get(`/courses/${courseId}/enrollments`);
  return response.data.data;
};

export const enrollStudent = async (courseId: string | number, userId: number): Promise<any> => {
  const response = await axiosInstance.post(`/courses/${courseId}/enrollments/${userId}`);
  return response.data;
};

export const unenrollStudent = async (courseId: string | number, userId: number): Promise<any> => {
  const response = await axiosInstance.delete(`/courses/${courseId}/enrollments/${userId}`);
  return response.data;
};

// --- SELF ENROLLMENT ---

export const selfEnroll = async (courseId: string | number): Promise<any> => {
  const response = await axiosInstance.post(`/courses/${courseId}/enroll`);
  return response.data;
};
