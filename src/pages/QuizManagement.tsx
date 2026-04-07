import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizzesByModule, createQuiz, updateQuiz, deleteQuiz } from '../api/quiz';
import type { Quiz } from '../api/quiz';

export const QuizManagement: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<Quiz>>({ title: '', description: '', time_limit: 60, passing_score: 70, is_randomized: false, max_attempts: 1 });

  const fetchQuizzes = async () => {
    if (!moduleId) return;
    setIsLoading(true);
    try {
      const data = await getQuizzesByModule(moduleId);
      setQuizzes(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, [moduleId]);

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!moduleId) return;
    setIsLoading(true);
    try {
      // Pastikan format angka
      const payload = { 
        ...formData, 
        time_limit: Number(formData.time_limit), 
        passing_score: Number(formData.passing_score) 
      };
      
      if (modalMode === 'create') {
        await createQuiz(moduleId, payload);
      } else if (modalMode === 'edit' && formData.id) {
        await updateQuiz(formData.id, payload);
      }
      setIsModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      alert("Gagal menyimpan kuis");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (mode: 'create' | 'edit', quiz?: Quiz) => {
    setModalMode(mode);
    if (mode === 'edit' && quiz) setFormData(quiz);
    else setFormData({ title: '', description: '', time_limit: 60, passing_score: 70, is_randomized: false, max_attempts: 1 });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
        <div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 mb-2">&larr; Kembali</button>
          <h3 className="text-lg font-semibold">Manajemen Kuis (Modul ID: {moduleId})</h3>
        </div>
        <button onClick={() => openModal('create')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded shadow-sm">
          + Tambah Kuis
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu (Menit)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KKM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Randomized</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Attempts</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="px-6 py-4 font-medium">{quiz.title}</td>
                <td className="px-6 py-4">{quiz.time_limit}</td>
                <td className="px-6 py-4">{quiz.passing_score}</td>
                <td className="px-6 py-4">{quiz.is_randomized ? 'Ya' : 'Tidak'}</td>
                <td className="px-6 py-4">{quiz.max_attempts}</td>
                <td className="px-6 py-4 text-center space-x-3">
                  <button onClick={() => navigate(`/quizzes/${quiz.id}/questions`)} className="text-blue-600 bg-blue-50 px-3 py-1 rounded">Kelola Soal</button>
                  <button onClick={() => openModal('edit', quiz)} className="text-indigo-600">Edit</button>
                  <button onClick={async () => { if(window.confirm('Hapus kuis?')){ await deleteQuiz(quiz.id); fetchQuizzes(); } }} className="text-red-600">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{modalMode === 'create' ? 'Tambah Kuis' : 'Edit Kuis'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Judul Kuis</label>
              <input type="text" required placeholder="Judul Kuis" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded px-3 py-2" />
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded px-3 py-2" />
              <div className="flex gap-4 justify-between">
                <div>
                <label className="block text-sm font-medium text-gray-700">Waktu (Menit)</label>
                <input type="number" required placeholder="Waktu (Menit)" value={formData.time_limit} onChange={e => setFormData({...formData, time_limit: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Passing Score</label>
                <input type="number" required placeholder="Passing Score" value={formData.passing_score} onChange={e => setFormData({...formData, passing_score: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex gap-4 justify-between">
                <div>
                <label className="block text-sm font-medium text-gray-700">Randomized</label>
                <input type="checkbox" checked={formData.is_randomized} onChange={e => setFormData({...formData, is_randomized: e.target.checked})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Attempts</label>
                  <input type="number" required placeholder="Max Attempts" value={formData.max_attempts? formData.max_attempts : undefined} onChange={e => setFormData({...formData, max_attempts: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};