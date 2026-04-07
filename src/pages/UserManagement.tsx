import React, { useState, useEffect } from 'react';
import { getUsers, importUsersCSV, createUser, updateUser, deleteUser } from '../api/user';
import type { User } from '../api/user';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<User>>({ name: '', email: '', password: '', role: 'Siswa' });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal memuat daftar pengguna.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- HANDLER IMPORT CSV ---
  const handleImport = async () => {
    if (!file) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await importUsersCSV(file);
      setMessage({ type: 'success', text: `Berhasil! ${res.total_inserted || res.total} pengguna diimpor.` });
      setFile(null);
      const fileInput = document.getElementById('csvUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal mengimpor CSV.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER CRUD MANUAL ---
  const openModal = (mode: 'create' | 'edit', user?: User) => {
    setModalMode(mode);
    if (mode === 'edit' && user) {
      setFormData({ id: user.id, name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'Siswa' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      if (modalMode === 'create') {
        await createUser(formData);
        setMessage({ type: 'success', text: 'Pengguna berhasil ditambahkan.' });
      } else if (modalMode === 'edit' && formData.id) {
        // Hapus password dari payload jika tidak diisi saat edit
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await updateUser(formData.id, payload);
        setMessage({ type: 'success', text: 'Data pengguna berhasil diperbarui.' });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal menyimpan data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    setIsLoading(true);
    try {
      await deleteUser(id);
      setMessage({ type: 'success', text: 'Pengguna berhasil dihapus.' });
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal menghapus pengguna.' });
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
          <h3 className="text-lg font-semibold mb-2">Manajemen Pengguna</h3>
          <div className="flex items-center space-x-2">
            <input id="csvUpload" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <button onClick={handleImport} disabled={!file || isLoading} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:bg-gray-400">Import CSV</button>
          </div>
        </div>
        <button onClick={() => openModal('create')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow-sm">
          + Tambah Pengguna
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{user.role}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button onClick={() => openModal('edit', user)} className="text-indigo-600 hover:text-indigo-900 mx-2">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 mx-2">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{modalMode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password {modalMode === 'edit' && <span className="text-xs text-gray-500">(Kosongkan jika tidak diubah)</span>}</label>
                <input type="password" required={modalMode === 'create'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="mt-1 w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="mt-1 w-full border border-gray-300 rounded px-3 py-2">
                  <option value="Siswa">Siswa</option>
                  <option value="Tutor">Tutor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">{isLoading ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};