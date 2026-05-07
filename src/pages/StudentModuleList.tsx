import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModulesByCourse, type Module } from '../api/module';
import { getExamsByCourse, type Exam } from '../api/exam';

export const StudentModuleList: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      if (!courseId) return;
      try {
        const data = await getModulesByCourse(courseId);
        setModules(data || []);
      } catch (err) {
        console.error("Gagal memuat modul", err);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchExams = async () => {
      if (!courseId) return;
      try {
        const data = await getExamsByCourse(courseId);
        // Siswa HANYA melihat exam yang berstatus "Published"
        setExams(data.filter((ex: Exam) => ex.exam_type !== '')); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchModules();
    fetchExams();
  }, [courseId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/student-dashboard')} className="text-gray-500 hover:text-blue-600">
          &larr; Kembali ke Daftar Kursus
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Modul Pembelajaran</h2>
        
        {isLoading ? (
          <div>Memuat modul...</div>
        ) : modules.length === 0 ? (
          <div className="text-gray-500 italic">Belum ada modul yang tersedia untuk kursus ini.</div>
        ) : (
          <div className="grid gap-4">
            {modules.map((mod, index) => (
              <div key={mod.id} className="group p-5 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700">{mod.title}</h3>
                    <p className="text-sm text-gray-500">{mod.sequence}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/modules/${mod.id}/learn`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700"
                  >
                    Pelajari Materi
                  </button>
                  <button 
                    onClick={() => navigate(`/quizzes/${mod.id}/attempt`)} // Asumsi Quiz ID sama dengan Module atau ada logika lain
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm hover:bg-purple-200"
                  >
                    Kerjakan Kuis
                  </button>
                </div>
              </div>
            ))}
            {/* SEKSI UJIAN AKHIR (EXAM) */}
            {exams.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border mt-8 border-purple-200">
                <h2 className="text-2xl font-black text-purple-900 mb-6 flex items-center gap-2">
                  <span>🎓</span> Evaluasi Akhir (Exam)
                </h2>
                <div className="grid gap-4">
                  {exams.map(exam => (
                    <div key={exam.id} className="p-6 border-2 border-purple-100 rounded-xl bg-purple-50 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">{exam.exam_type}</span>
                          <h3 className="font-bold text-xl text-gray-900">{exam.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                        <div className="flex gap-4 text-xs font-bold text-purple-800">
                          <span className="bg-white px-2 py-1 rounded shadow-sm">⏱ Waktu: {exam.time_limit} Menit</span>
                          <span className="bg-white px-2 py-1 rounded shadow-sm">🎯 KKM: {exam.passing_score}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/exams/${exam.id}/attempt`)}
                        className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-xl font-black shadow-lg hover:bg-purple-700 hover:scale-105 transition-all"
                      >
                        Mulai Ujian
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};