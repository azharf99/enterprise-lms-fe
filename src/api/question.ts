import { axiosInstance } from './axiosInstance';

export interface Question {
  id: number;
  quiz_id: number;
  type: string; 
  text: string;
  options?: string[] | null; 
  correct_answer: string;
  points: number;
  explanation?: string;
}

export const getQuestionsByQuiz = async (quizId: string | number): Promise<Question[]> => {
  const response = await axiosInstance.get(`/quizzes/${quizId}/questions`);
  return response.data.data;
};

export const createQuestion = async (quizId: string | number, data: Partial<Question>): Promise<any> => {
  const response = await axiosInstance.post(`/quizzes/${quizId}/questions`, data);
  return response.data;
};

// --- TAMBAHAN: Fungsi Update ---
export const updateQuestion = async (questionId: number, data: Partial<Question>): Promise<any> => {
  const response = await axiosInstance.put(`/questions/${questionId}`, data);
  return response.data;
};

export const deleteQuestion = async (questionId: number): Promise<any> => {
  const response = await axiosInstance.delete(`/questions/${questionId}`);
  return response.data;
};

// --- PERBAIKAN: Tambah parameter q_type ---
export const generateQuestionsWithAI = async (
  quizId: string | number, 
  topic: string, 
  q_type: string, 
  count: number
): Promise<any> => {
  const response = await axiosInstance.post(`/quizzes/${quizId}/questions/generate`, {
    topic,
    q_type,
    count
  });
  return response.data;
};