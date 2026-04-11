import { axiosInstance } from './axiosInstance';

export interface ExamQuestion {
  id: number;
  exam_id: number;
  q_type: string; // 'MultipleChoice', 'TrueFalse', 'Essay', dll
  text: string;
  options?: string[] | null;
  correct_answer: any;
  points: number;
  explanation?: string;
}

export const getExamQuestions = async (examId: string | number): Promise<ExamQuestion[]> => {
  const response = await axiosInstance.get(`/exams/${examId}/questions`);
  return response.data.data || [];
};

export const createExamQuestion = async (examId: string | number, data: Partial<ExamQuestion>): Promise<any> => {
  const response = await axiosInstance.post(`/exams/${examId}/questions`, data);
  return response.data;
};

export const updateExamQuestion = async (questionId: number, data: Partial<ExamQuestion>): Promise<any> => {
  // Ingat: Backend Anda biasanya menggunakan rute /exam-questions/:id untuk update/delete
  const response = await axiosInstance.put(`/exam-questions/${questionId}`, data); 
  return response.data;
};

export const deleteExamQuestion = async (questionId: number): Promise<any> => {
  const response = await axiosInstance.delete(`/exam-questions/${questionId}`);
  return response.data;
};

// Fitur Magic: Generate Soal dengan AI khusus untuk Exam
export const generateExamQuestionsAI = async (
  examId: string | number, 
  payload: { topic: string, q_type: string, count: number }
): Promise<any> => {
  const response = await axiosInstance.post(`/exams/${examId}/questions/generate`, payload);
  return response.data;
};