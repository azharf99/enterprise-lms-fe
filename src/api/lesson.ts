import { axiosInstance } from './axiosInstance';

export interface Lesson {
  id: number;
  module_id: number;
  lesson_type: 'Text' | 'Video' | 'Audio' | 'Image' | 'PDF';
  title: string;
  content?: string; // Akan berisi tag HTML
  video_url?: string;
  sequence: number;
}

export const getLessonsByModule = async (moduleId: string | number): Promise<Lesson[]> => {
  const response = await axiosInstance.get(`/modules/${moduleId}/lessons`);
  // Mengurutkan lesson berdasarkan sequence
  const lessons = response.data.data || [];
  return lessons.sort((a: Lesson, b: Lesson) => a.sequence - b.sequence);
};

export const createLesson = async (moduleId: string | number, data: Partial<Lesson>): Promise<any> => {
  const response = await axiosInstance.post(`/modules/${moduleId}/lessons`, data);
  return response.data;
};

export const updateLesson = async (lessonId: number, data: Partial<Lesson>): Promise<any> => {
  const response = await axiosInstance.put(`/lessons/${lessonId}`, data);
  return response.data;
};

export const deleteLesson = async (lessonId: number): Promise<any> => {
  const response = await axiosInstance.delete(`/lessons/${lessonId}`);
  return response.data;
};