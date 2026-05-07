import { axiosInstance } from './axiosInstance';

export interface Exam {
  id: number;
  course_id: number;
  title: string;
  exam_type: string; // "PTS", "PAS", "TryOut", dll
  description: string;
  time_limit: number;
  passing_score: number;
  cbt_token: string;
  is_randomized: boolean;
  status: string;
  start_time?: string | null;
  end_time?: string | null;
}
export const getExamsByCourse = async (courseId: string | number): Promise<Exam[]> => {
  const response = await axiosInstance.get(`/courses/${courseId}/exams`);
  return response.data.data || [];
};

export const createExam = async (courseId: string | number, data: Partial<Exam>): Promise<any> => {
  const response = await axiosInstance.post(`/courses/${courseId}/exams`, data);
  return response.data;
};

export const updateExam = async (examId: number, data: Partial<Exam>): Promise<any> => {
  const response = await axiosInstance.put(`/exams/${examId}`, data);
  return response.data;
};

export const deleteExam = async (examId: number): Promise<any> => {
  const response = await axiosInstance.delete(`/exams/${examId}`);
  return response.data;
};