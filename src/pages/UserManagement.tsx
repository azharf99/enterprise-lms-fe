import React, { useState, useEffect } from 'react';
import { getUsers, importUsersCSV, createUser, updateUser, deleteUser } from '../api/user';
import type { User } from '../api/user';
import { 
  UserPlus, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  X, 
  Mail, 
  Shield,
  ArrowRight,
  User as UserIcon,
  Loader2
} from 'lucide-react';

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
      setMessage({ type: 'error', text: 'Failed to load user list.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleImport = async () => {
    if (!file) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await importUsersCSV(file);
      setMessage({ type: 'success', text: `Success! ${res.total_inserted || res.total} users imported.` });
      setFile(null);
      const fileInput = document.getElementById('csvUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to import CSV.' });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (mode: 'create' | 'edit', user?: User) => {
    setModalMode(mode);
    if (mode === 'edit' && user) {
      setFormData({ id: user.id, name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'Siswa' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      if (modalMode === 'create') {
        await createUser(formData);
        setMessage({ type: 'success', text: 'User added successfully.' });
      } else if (modalMode === 'edit' && formData.id) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await updateUser(formData.id, payload);
        setMessage({ type: 'success', text: 'User updated successfully.' });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save user.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setIsLoading(true);
    try {
      await deleteUser(id);
      setMessage({ type: 'success', text: 'User deleted successfully.' });
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete user.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
          <p className="text-gray-500 font-medium">Manage student and instructor accounts.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => openModal('create')} 
            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in zoom-in duration-300 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-100' 
            : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          <div className={`p-1 rounded-full ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-black/5 rounded-lg transition-colors">
            <X className="w-4 h-4 opacity-50" />
          </button>
        </div>
      )}

      {/* CSV Import Card */}
      <div className="bg-white rounded-[2rem] border border-gray-50 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="bg-blue-50 p-4 rounded-2xl">
          <Upload className="w-8 h-8 text-[#2563eb]" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#191b23]">Bulk Import Users</h4>
          <p className="text-sm text-gray-500">Upload a CSV file to register multiple users at once.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            id="csvUpload" 
            type="file" 
            accept=".csv" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="hidden" 
          />
          <label 
            htmlFor="csvUpload" 
            className="flex-1 sm:flex-none cursor-pointer px-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all text-center border border-gray-100"
          >
            {file ? file.name : 'Choose File'}
          </label>
          <button 
            onClick={handleImport} 
            disabled={!file || isLoading} 
            className="px-5 py-2.5 bg-[#191b23] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-black transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import Now'}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
           </div>
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                <Filter className="w-4 h-4" />
                Filter Role
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#2563eb] font-bold">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#191b23] mb-0.5 group-hover:text-[#2563eb] transition-colors">{user.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                      user.role === 'Admin' ? 'bg-red-50 text-red-600' :
                      user.role === 'Tutor' ? 'bg-purple-50 text-purple-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm font-medium text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal('edit', user)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                     <button className="p-2 text-gray-400 group-hover:hidden">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#191b23]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">{modalMode === 'create' ? 'Add User' : 'Edit User'}</h2>
                  <p className="text-gray-500 font-medium">Update account details and permissions.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 px-1">Full Name</label>
                  <input 
                    type="text" required value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 px-1">Email Address</label>
                  <input 
                    type="email" required value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 px-1">Password {modalMode === 'edit' && <span className="text-[10px] text-gray-400 italic">(Leave blank to keep current)</span>}</label>
                  <input 
                    type="password" required={modalMode === 'create'} value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 px-1">Access Role</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  >
                    <option value="Siswa">Siswa</option>
                    <option value="Tutor">Tutor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all">Cancel</button>
                  <button 
                    type="submit" disabled={isLoading} 
                    className="flex-1 py-4 bg-[#2563eb] text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Saving...' : <>{modalMode === 'create' ? 'Create Account' : 'Save Changes'} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};