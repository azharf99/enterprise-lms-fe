import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModulesByCourse, createModule, updateModule, deleteModule } from '../api/module';
import type { Module } from '../api/module';

export const ModuleManagement: React.FC = () => {
  // Mengambil courseId dari URL (/courses/:courseId/modules)
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<Module>>({ title: '', description: '' });

  const fetchModules = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const data = await getModulesByCourse(courseId);
      setModules(data || []);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal memuat daftar modul.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const openModal = (mode: 'create' | 'edit', mod?: Module) => {
    setModalMode(mode);
    if (mode === 'edit' && mod) {
      setFormData({ id: mod.id, title: mod.title, description: mod.description });
    } else {
      setFormData({ title: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!courseId) return;
    
    setIsLoading(true);
    setMessage(null);
    try {
      if (modalMode === 'create') {
        await createModule(courseId, formData);
        setMessage({ type: 'success', text: 'Modul berhasil ditambahkan.' });
      } else if (modalMode === 'edit' && formData.id) {
        await updateModule(formData.id, formData);
        setMessage({ type: 'success', text: 'Data modul berhasil diperbarui.' });
      }
      setIsModalOpen(false);
      fetchModules();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal menyimpan modul.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus modul ini beserta seluruh konten di dalamnya?')) return;
    setIsLoading(true);
    try {
      await deleteModule(id);
      setMessage({ type: 'success', text: 'Modul berhasil dihapus.' });
      fetchModules();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal menghapus modul.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {message && (
        <div className={`p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <button 
              onClick={() => navigate('/courses')}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              &larr; Kembali ke Kursus
            </button>
          </div>
          <h3 className="text-lg font-semibold">Manajemen Modul (Course ID: {courseId})</h3>
        </div>
        <button 
          onClick={() => openModal('create')} 
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow-sm"
        >
          + Tambah Modul
        </button>
      </div>

      {/* Tabel Modul */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul Modul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modules.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Belum ada modul di kursus ini.</td>
              </tr>
            ) : (
              modules.map((mod) => (
                <tr key={mod.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mod.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mod.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{mod.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                    {/* Tombol ke Manajemen Kuis/Soal */}
                    <button 
                      onClick={() => navigate(`/modules/${mod.id}/quizzes`)}
                      className="text-purple-600 hover:text-purple-900 bg-purple-50 px-3 py-1 rounded"
                    >
                      Kelola Kuis
                    </button>
                    <button onClick={() => openModal('edit', mod)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDelete(mod.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{modalMode === 'create' ? 'Tambah Modul' : 'Edit Modul'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Judul Modul</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Contoh: Bab 1 - Pendahuluan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                <textarea 
                  rows={4}
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Jelaskan isi modul ini..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};