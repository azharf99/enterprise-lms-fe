import { axiosInstance } from './axiosInstance';

export interface Quiz {
  id: number;
  module_id: number;
  title: string;
  description: string;
  time_limit: number; // Dalam menit
  passing_score: number;
  is_randomized: boolean;
  max_attempts: number;
}

export const getQuizzesByModule = async (moduleId: string | number): Promise<Quiz[]> => {
  const response = await axiosInstance.get(`/modules/${moduleId}/quizzes`);
  return response.data.data;
};

export const createQuiz = async (moduleId: string | number, data: Partial<Quiz>): Promise<any> => {
  const response = await axiosInstance.post(`/modules/${moduleId}/quizzes`, data);
  return response.data;
};

export const updateQuiz = async (quizId: number, data: Partial<Quiz>): Promise<any> => {
  const response = await axiosInstance.put(`/quizzes/${quizId}`, data);
  return response.data;
};

export const deleteQuiz = async (quizId: number): Promise<any> => {
  const response = await axiosInstance.delete(`/quizzes/${quizId}`);
  return response.data;
};