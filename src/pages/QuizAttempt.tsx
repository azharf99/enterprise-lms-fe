import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startAttempt, submitAttempt } from '../api/attempt';
import type { Attempt } from '../api/attempt';
import type { Question } from '../api/question';

export const QuizAttempt: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State untuk menyimpan jawaban: { question_id: "Jawaban Siswa" }
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  // State Hasil Akhir
  const [result, setResult] = useState<{ score: number, passed: boolean } | null>(null);

  useEffect(() => {
    const initQuiz = async () => {
      if (!quizId) return;
      try {
        const data = await startAttempt(quizId);
        setAttempt(data.attempt);
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.response?.data?.error || "Gagal memulai kuis. Pastikan Anda terdaftar di kursus ini.");
      } finally {
        setIsLoading(false);
      }
    };
    initQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!attempt) return;
    
    // Cek apakah ada soal yang belum dijawab
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      if (!window.confirm(`Ada ${unansweredCount} soal yang belum dijawab. Yakin ingin mengumpulkan?`)) {
        return;
      }
    } else {
      if (!window.confirm('Apakah Anda yakin ingin menyelesaikan kuis ini?')) return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitAttempt(attempt.id, answers);
      // Asumsi backend mengembalikan nilai score di res.data.score
      setResult({ score: res.score || 0, passed: res.passed || false });
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal mengumpulkan kuis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Memuat Kuis...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-bold bg-red-50">{error}</div>;
  if (questions.length === 0) return <div className="p-8 text-center text-gray-600">Kuis ini belum memiliki soal.</div>;

  // --- TAMPILAN HASIL KUIS (Jika sudah disubmit) ---
  if (result) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md text-center border">
        <h2 className="text-3xl font-bold mb-4">Kuis Selesai!</h2>
        <div className="text-6xl font-black mb-6 text-blue-600">{result.score}</div>
        <p className={`text-lg font-semibold mb-8 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
          {result.passed ? '🎉 Selamat, Anda Lulus!' : '😢 Maaf, Anda belum mencapai KKM.'}
        </p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  // --- TAMPILAN CBT (Sedang Mengerjakan) ---
  const currentQ = questions[currentIndex];
  const isMultipleChoice = ['MultipleChoice', 'TrueFalse'].includes(currentQ.type);

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white rounded-xl shadow-lg border overflow-hidden">
      {/* Header CBT */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">Pengerjaan Kuis</h2>
        <div className="text-sm bg-gray-700 px-3 py-1 rounded font-mono">
          Soal {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Body: Area Pertanyaan */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
        <div className="bg-white p-6 rounded border shadow-sm">
          <div className="flex gap-4">
            <div className="font-bold text-xl text-blue-800">{currentIndex + 1}.</div>
            <div className="w-full">
              <p className="text-lg text-gray-800 mb-6 font-medium whitespace-pre-wrap">{currentQ.text}</p>
              
              {/* Opsi Jawaban Dinamis */}
              {isMultipleChoice && currentQ.options ? (
                <div className="space-y-3">
                  {currentQ.options.map((opt, i) => (
                    <label 
                      key={i} 
                      className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                        answers[currentQ.id] === opt 
                          ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                          : 'bg-white hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={opt}
                          checked={answers[currentQ.id] === opt}
                          onChange={() => handleOptionChange(currentQ.id, opt)}
                          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700 font-medium">{opt}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={5}
                  placeholder="Ketik jawaban Anda di sini..."
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleOptionChange(currentQ.id, e.target.value)}
                  className="w-full border-gray-300 border rounded-lg p-4 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigasi CBT */}
      <div className="bg-white border-t p-4 flex justify-between items-center px-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-semibold disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          &larr; Sebelumnya
        </button>
        
        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition-colors shadow-md"
          >
            {isSubmitting ? 'Mengirim...' : 'Kumpulkan Kuis'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Selanjutnya &rarr;
          </button>
        )}
      </div>
    </div>
  );
};