import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamsByCourse, createExam, updateExam, deleteExam, type Exam } from '../api/exam';

export const ExamManagement: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // State dengan struktur yang cocok 100% dengan Golang Struct
  const [formData, setFormData] = useState<Partial<Exam>>({
    title: '', 
    exam_type: 'PAS', 
    description: '', 
    time_limit: 90, 
    passing_score: 70, 
    cbt_token: '', 
    is_randomized: true,
    start_time: '',
    end_time: '',
    status: 'Draft'
  });

  const fetchExams = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const data = await getExamsByCourse(courseId);
      setExams(data);
    } catch (error) {
      console.error("Gagal memuat ujian akhir:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, [courseId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setIsLoading(true);
  
    // --- PERBAIKAN START ---
    const payload = { ...formData };
  
    // Konversi format datetime-local ke ISOString (RFC3339) yang disukai Go
    if (payload.start_time) {
      // new Date() akan mengambil input dan toISOString() akan menambah :00Z di akhir
      payload.start_time = new Date(payload.start_time).toISOString();
    } else {
      payload.start_time = null;
    }
  
    if (payload.end_time) {
      payload.end_time = new Date(payload.end_time).toISOString();
    } else {
      payload.end_time = null;
    }
    // --- PERBAIKAN END ---
  
    if (!payload.cbt_token) {
      payload.cbt_token = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  
    try {
      if (modalMode === 'create') await createExam(courseId, payload);
      else if (modalMode === 'edit' && formData.id) await updateExam(formData.id, payload);
      
      setIsModalOpen(false);
      fetchExams();
    } catch (error: any) {
      alert("Gagal menyimpan data Ujian: " + (error.response?.data?.error || "Unknown Error"));
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (mode: 'create' | 'edit', exam?: Exam) => {
    setModalMode(mode);
    if (mode === 'edit' && exam) {
      // Pastikan format date untuk input datetime-local (YYYY-MM-DDTHH:mm)
      const st = exam.start_time ? new Date(exam.start_time).toISOString().slice(0,16) : '';
      const et = exam.end_time ? new Date(exam.end_time).toISOString().slice(0,16) : '';
      setFormData({ ...exam, start_time: st, end_time: et });
    } else {
      setFormData({ 
        title: '', exam_type: 'PAS', description: '', time_limit: 90, passing_score: 70, cbt_token: '', is_randomized: true, start_time: '', end_time: '', status: 'Draft' 
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
        <div>
          <button onClick={() => navigate('/courses')} className="text-gray-500 hover:text-gray-800 mb-2">&larr; Kembali</button>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Ujian Akhir (Exam)</h2>
        </div>
        <button onClick={() => openModal('create')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded shadow-sm">
          + Buat Exam Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col justify-between hover:border-purple-300">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{exam.title}</h3>
                <span className="px-2 py-1 text-xs font-bold rounded bg-purple-100 text-purple-800 border border-purple-200">
                  {exam.exam_type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exam.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 font-medium mb-4 bg-gray-50 p-3 rounded">
                <div>⏱ {exam.time_limit} Menit</div>
                <div>🎯 KKM: {exam.passing_score}</div>
                <div>🔑 Token: <span className="font-mono bg-white px-1 border rounded text-purple-700">{exam.cbt_token || '-'}</span></div>
                <div>🔀 Acak Soal: {exam.is_randomized ? 'Ya' : 'Tidak'}</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-2 pt-4 border-t">
              <button onClick={() => navigate(`/exams/${exam.id}/questions`)} className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 font-semibold rounded hover:bg-blue-100 transition-colors">
                Kelola Soal
              </button>
              <button onClick={() => openModal('edit', exam)} className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 font-semibold rounded">Edit</button>
              <button onClick={async () => { if(window.confirm('Hapus exam ini?')) { await deleteExam(exam.id); fetchExams(); } }} className="px-3 py-2 text-red-600 hover:bg-red-50 font-semibold rounded">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">{modalMode === 'create' ? 'Buat Exam Baru' : 'Edit Exam'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Judul Ujian</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tipe Ujian</label>
                  <select required value={formData.exam_type} onChange={e => setFormData({...formData, exam_type: e.target.value})} className="w-full border rounded px-3 py-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="PTS">PTS (Tengah Semester)</option>
                    <option value="PAS">PAS (Akhir Semester)</option>
                    <option value="TryOut">Try Out</option>
                    <option value="Remedial">Remedial</option>
                  </select>
                </div>
              </div>
             

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi & Aturan</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Durasi (Menit)</label>
                  <input type="number" required value={formData.time_limit} onChange={e => setFormData({...formData, time_limit: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nilai KKM</label>
                  <input type="number" required value={formData.passing_score} onChange={e => setFormData({...formData, passing_score: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Token CBT</label>
                  <input type="text" placeholder="Auto" value={formData.cbt_token} onChange={e => setFormData({...formData, cbt_token: e.target.value.toUpperCase()})} className="w-full border rounded px-3 py-2 font-mono uppercase" />
                </div>
                <div className="flex flex-col justify-center items-center mt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_randomized} onChange={e => setFormData({...formData, is_randomized: e.target.checked})} className="w-5 h-5 text-purple-600 rounded" />
                    <span className="text-sm font-bold text-gray-700">Acak Soal</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Waktu Mulai (Opsional)</label>
                  <input type="datetime-local" value={formData.start_time || ''} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Waktu Selesai (Opsional)</label>
                  <input type="datetime-local" value={formData.end_time || ''} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Visibilitas</label>
                <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border rounded px-3 py-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-gray-200 text-gray-700 font-bold rounded">Batal</button>
                <button type="submit" disabled={isLoading} className="px-5 py-2 bg-purple-600 text-white font-bold rounded shadow-md hover:bg-purple-700">Simpan Ujian</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};