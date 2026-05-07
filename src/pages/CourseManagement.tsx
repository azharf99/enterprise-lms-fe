import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/course';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../api/course';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Users, 
  FileText,
  Filter,
  ArrowRight,
  X
} from 'lucide-react';

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<Course>>({ title: '', description: '' });

  const navigate = useNavigate();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal memuat daftar kursus.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openModal = (mode: 'create' | 'edit', course?: Course) => {
    setModalMode(mode);
    if (mode === 'edit' && course) {
      setFormData({ id: course.id, title: course.title, description: course.description });
    } else {
      setFormData({ title: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      if (modalMode === 'create') {
        await createCourse(formData);
        setMessage({ type: 'success', text: 'Kursus berhasil ditambahkan.' });
      } else if (modalMode === 'edit' && formData.id) {
        await updateCourse(formData.id, formData);
        setMessage({ type: 'success', text: 'Data kursus berhasil diperbarui.' });
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal menyimpan kursus.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kursus ini beserta seluruh modul di dalamnya?')) return;
    setIsLoading(true);
    try {
      await deleteCourse(id);
      setMessage({ type: 'success', text: 'Kursus berhasil dihapus.' });
      fetchCourses();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal menghapus kursus.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Course Management</h1>
          <p className="text-gray-500 font-medium">Create and manage your educational programs.</p>
        </div>
        <button 
          onClick={() => openModal('create')} 
          className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create New Course
        </button>
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

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
           </div>
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                <Filter className="w-4 h-4" />
                Filter
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Course Detail</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Enrolled</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Content</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-50 p-4 rounded-full mb-4">
                        <BookOpen className="w-8 h-8 text-[#2563eb]" />
                      </div>
                      <p className="text-gray-400 font-bold">No courses found</p>
                      <p className="text-xs text-gray-300">Start by creating your first educational program.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#2563eb] font-bold shadow-sm">
                          {course.title.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#191b23] mb-1 group-hover:text-[#2563eb] transition-colors">{course.title}</div>
                          <div className="text-xs text-gray-400 line-clamp-1 w-64">{course.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                               <img src={`https://i.pravatar.cc/100?u=${course.id + i}`} alt="user" />
                             </div>
                           ))}
                        </div>
                        <span className="text-xs font-bold text-gray-500">+24</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Exam
                        </span>
                        <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> 8 Modules
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => navigate(`/courses/${course.id}/modules`)}
                            className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-xl transition-all"
                            title="Manage Content"
                          >
                            <BookOpen className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => navigate(`/courses/${course.id}/enrollments`)}
                            className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-xl transition-all"
                            title="Manage Students"
                          >
                            <Users className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => openModal('edit', course)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(course.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                       </div>
                       <button className="p-2 text-gray-400 group-hover:hidden">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#191b23]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">{modalMode === 'create' ? 'Create Course' : 'Edit Course'}</h2>
                  <p className="text-gray-500 font-medium">Fill in the details to {modalMode === 'create' ? 'add a new' : 'update this'} program.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 px-1">Course Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white outline-none transition-all font-medium"
                    placeholder="e.g. Advanced Leadership & Management"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 px-1">Course Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white outline-none transition-all font-medium"
                    placeholder="Detailed explanation of the course objectives..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="flex-1 py-4 bg-[#2563eb] text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Saving...' : (
                      <>
                        {modalMode === 'create' ? 'Create Course' : 'Save Changes'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
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
