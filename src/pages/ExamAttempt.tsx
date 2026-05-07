import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startExamAttempt, submitExamAttempt, type ExamAttempt } from '../api/examAttempt';
import { type ExamQuestion } from '../api/examQuestion';
import { type Exam } from '../api/exam';

export const ExamAttemptPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<{ score: number, passed: boolean } | null>(null);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const initExam = async () => {
      if (!examId) return;
      try {
        const data = await startExamAttempt(examId);
        setAttempt(data.attempt);
        setQuestions(data.questions);
        setExam(data.exam);
        
        // Kalkulasi sisa waktu (Jika resume attempt, kurangi waktu yang sudah berlalu)
        if (data.exam && data.exam.time_limit > 0) {
           const startTime = new Date(data.attempt.started_at).getTime();
           const now = new Date().getTime();
           const elapsedSeconds = Math.floor((now - startTime) / 1000);
           const totalSeconds = data.exam.time_limit * 60;
           const remaining = Math.max(totalSeconds - elapsedSeconds, 0);
           setTimeLeft(remaining);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Gagal memulai ujian.");
      } finally {
        setIsLoading(false);
      }
    };
    initExam();
  }, [examId]);

  // Efek untuk menjalankan Countdown Timer
  useEffect(() => {
    if (timeLeft > 0 && !result && !isSubmitting) {
      // TAMBAHKAN window. DI SINI
      timerRef.current = window.setInterval(() => { 
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // TAMBAHKAN window. JUGA DI SINI
            window.clearInterval(timerRef.current!); 
            autoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [timeLeft, result, isSubmitting]);

  const autoSubmit = async () => {
    alert("Waktu habis! Jawaban Anda sedang dikirim otomatis.");
    await handleSubmit(true);
  };

  const handleOptionChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (isAuto = false) => {
    if (!attempt) return;
    
    if (!isAuto) {
      const unanswered = questions.length - Object.keys(answers).length;
      const msg = unanswered > 0 
        ? `Ada ${unanswered} soal yang belum dijawab. Yakin kumpulkan?` 
        : 'Yakin ingin menyelesaikan ujian ini?';
      if (!window.confirm(msg)) return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitExamAttempt(attempt.id, answers);
      setResult({ score: res.score || 0, passed: res.passed || true });
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal mengirim ujian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format Waktu (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold text-xl text-purple-600">Menyiapkan Lembar Ujian...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-bold">{error}</div>;

  // Tampilan Hasil
  if (result) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl text-center border">
        <h2 className="text-3xl font-black mb-4">Ujian Selesai!</h2>
        <div className="text-7xl font-black mb-6 text-purple-600">{result.score.toFixed(2)}</div>
        <p className={`text-xl font-bold mb-8 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
          {result.passed ? '🎉 Selamat, Anda Lulus Ujian Kursus Ini!' : '😢 Maaf, nilai Anda di bawah KKM.'}
        </p>
        <button onClick={() => navigate('/student-dashboard')} className="px-8 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-black">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col bg-white rounded-xl shadow-2xl border overflow-hidden">
      {/* Header CBT Exam */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div>
          <h2 className="font-bold text-lg">{exam?.title || 'Ujian Akhir'}</h2>
          <p className="text-xs text-slate-400">{exam?.exam_type}</p>
        </div>
        
        {/* Indikator Waktu Merah jika < 3 menit */}
        <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1 rounded ${timeLeft < 180 ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Body: Soal & Navigasi Samping */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kolom Soal (Kiri) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
           <div className="bg-white p-8 rounded-xl border shadow-sm">
             <div className="flex gap-4">
               <div className="font-black text-2xl text-purple-800">{currentIndex + 1}.</div>
               <div className="w-full">
                 <p className="text-lg text-gray-800 mb-8 font-medium whitespace-pre-wrap">{currentQ.text}</p>
                 
                 {/* Opsi Jawaban */}
                 {['MultipleChoice', 'TrueFalse'].includes(currentQ.type) && currentQ.options ? (
                   <div className="space-y-3">
                     {currentQ.options.map((opt, i) => (
                       <label key={i} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'bg-purple-50 border-purple-500' : 'bg-white hover:border-gray-300'}`}>
                         <div className="flex items-center">
                           <input type="radio" name={`q-${currentQ.id}`} value={opt} checked={answers[currentQ.id] === opt} onChange={() => handleOptionChange(currentQ.id, opt)} className="h-5 w-5 text-purple-600 focus:ring-purple-500" />
                           <span className="ml-3 text-gray-700 font-semibold">{opt}</span>
                         </div>
                       </label>
                     ))}
                   </div>
                 ) : (
                   <textarea rows={6} placeholder="Ketik jawaban essay Anda..." value={answers[currentQ.id] || ''} onChange={(e) => handleOptionChange(currentQ.id, e.target.value)} className="w-full border-2 rounded-xl p-4 focus:ring-purple-500 focus:border-purple-500" />
                 )}
               </div>
             </div>
           </div>
        </div>

        {/* Peta Soal (Kanan) */}
        <div className="w-64 bg-white border-l p-4 overflow-y-auto hidden md:block">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">Navigasi Soal</h3>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, i) => (
              <button 
                key={q.id} onClick={() => setCurrentIndex(i)}
                className={`w-10 h-10 rounded font-bold text-sm flex items-center justify-center border-2 transition-colors
                  ${currentIndex === i ? 'border-purple-600 ring-2 ring-purple-200' : answers[q.id] ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 hover:bg-gray-100'}
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigasi */}
      <div className="bg-white border-t p-4 flex justify-between items-center px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-bold disabled:opacity-50">
          &larr; Prev
        </button>
        
        {currentIndex === questions.length - 1 ? (
          <button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="px-8 py-2 bg-green-600 text-white rounded font-black shadow-lg hover:bg-green-700">
            {isSubmitting ? 'Mengirim...' : 'Kumpulkan Ujian'}
          </button>
        ) : (
          <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} className="px-6 py-2 bg-purple-600 text-white rounded font-bold shadow-lg hover:bg-purple-700">
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
};