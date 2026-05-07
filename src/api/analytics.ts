import { axiosInstance } from './axiosInstance';

export interface ExamSummary {
  exam_id: number;
  exam_title: string;
  total_attempts: number;
  average_score: number;
  pass_rate: number;
  score_distribution: {
    range: string;
    count: number;
  }[];
  item_analysis: {
    question_id: number;
    question_text: string;
    correct_rate: number;
  }[];
}

export const getExamSummary = async (examId: string | number): Promise<ExamSummary> => {
  const response = await axiosInstance.get(`/analytics/exams/${examId}/summary`);
  return response.data.data;
};

export const getGlobalAnalytics = async (): Promise<any> => {
  const response = await axiosInstance.get('/analytics/global');
  return response.data.data;
};
