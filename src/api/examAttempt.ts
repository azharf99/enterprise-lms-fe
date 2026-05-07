import { axiosInstance } from './axiosInstance';
import { type ExamQuestion } from './examQuestion';
import { type Exam } from './exam';

export interface ExamAttempt {
  id: number;
  exam_id: number;
  user_id: number;
  score?: number;
  status: string;
  started_at: string;
}

export const startExamAttempt = async (examId: string | number): Promise<{ attempt: ExamAttempt, questions: ExamQuestion[], exam: Exam }> => {
  const response = await axiosInstance.post(`/exams/${examId}/attempts`);
  return response.data;
};

export const submitExamAttempt = async (attemptId: number, answers: Record<number, string | string[]>): Promise<any> => {
  const response = await axiosInstance.post(`/exam-attempts/${attemptId}/submit`, {
    answers: answers
  });
  return response.data;
};