import { axiosInstance } from './axiosInstance';
import type { Question } from './question';

export interface Attempt {
  id: number;
  quiz_id: number;
  user_id: number;
  score?: number;
  status: string; // 'in_progress', 'completed'
  started_at: string;
}

export const startAttempt = async (quizId: string | number): Promise<{ attempt: Attempt, questions: Question[] }> => {
  const response = await axiosInstance.post(`/quizzes/${quizId}/attempts`);
  return response.data; 
};

export const submitAttempt = async (attemptId: number, answers: Record<number, string | string[]>): Promise<any> => {
  // Langsung kirim state answers aslinya! (Karena wujudnya sudah berbentuk Object { "1": "Jawaban" })
  const response = await axiosInstance.post(`/attempts/${attemptId}/submit`, {
    answers: answers 
  });
  return response.data;
};