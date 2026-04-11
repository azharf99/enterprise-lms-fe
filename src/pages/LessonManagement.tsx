import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonsByModule, createLesson, updateLesson, deleteLesson, type Lesson } from '../api/lesson';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Heading, FontFamily, FontSize, FontColor, FontBackgroundColor, Strikethrough, Subscript, Superscript, Code, Link, BlockQuote, CodeBlock, TodoList, Indent } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';


const LESSON_TYPES = [
    { value: 'Text', label: 'Teks' },
    { value: 'Video', label: 'Video' },
    { value: 'Audio', label: 'Audio' },
    { value: 'Image', label: 'Gambar' },
    { value: 'PDF', label: 'PDF' },
  ];

export const LessonManagement: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<Lesson>>({ title: '', lesson_type: undefined, content: '', video_url: '', sequence: 1 });

  const fetchLessons = async () => {
    if (!moduleId) return;
    setIsLoading(true);
    try {
      const data = await getLessonsByModule(moduleId);
      setLessons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLessons(); }, [moduleId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleId) return;
    setIsLoading(true);
    try {
      if (modalMode === 'create') await createLesson(moduleId, formData);
      else if (modalMode === 'edit' && formData.id) await updateLesson(formData.id, formData);
      
      setIsModalOpen(false);
      fetchLessons();
    } catch (error: any) {
      alert("Gagal menyimpan materi");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (mode: 'create' | 'edit', lesson?: Lesson) => {
    setModalMode(mode);
    if (mode === 'edit' && lesson) setFormData(lesson);
    else setFormData({ title: '', lesson_type: undefined, content: '', video_url: '', sequence: lessons.length + 1 });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
        <div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 mb-2">&larr; Kembali ke Modul</button>
          <h3 className="text-lg font-semibold">Manajemen Materi (Modul ID: {moduleId})</h3>
        </div>
        <button onClick={() => openModal('create')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-sm">
          + Tambah Materi
        </button>
      </div>

      <div className="space-y-4">
        {lessons.length === 0 && !isLoading && (
          <div className="text-center p-8 bg-white border rounded text-gray-500">Belum ada materi.</div>
        )}
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-bold">{lesson.lesson_type}</span>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-bold">Urutan: {lesson.sequence}</span>
                <h4 className="text-xl font-bold text-gray-800">{lesson.title}</h4>
              </div>
              {lesson.video_url && <span className="text-sm text-blue-600 font-semibold">🎥 Video Tersedia</span>}
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{lesson.content ? lesson.content.replace(/<[^>]+>/g, '') : ''}</p>
            </div>
            <div className="space-x-3">
              <button onClick={() => openModal('edit', lesson)} className="text-indigo-600 hover:text-indigo-900 font-semibold">Edit</button>
              <button onClick={async () => { if(window.confirm('Hapus materi?')) { await deleteLesson(lesson.id); fetchLessons(); } }} className="text-red-500 hover:text-red-700 font-semibold">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{modalMode === 'create' ? 'Tambah Materi' : 'Edit Materi'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1">Judul Materi</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Urutan</label>
                  <input type="number" required value={formData.sequence} onChange={e => setFormData({...formData, sequence: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Materi</label>
                <select onChange={e => setFormData({...formData, lesson_type: e.target.value as 'Text' | 'Video' | 'Audio' | 'Image' | 'PDF'})} className="w-full border rounded px-3 py-2 bg-white">
                  {LESSON_TYPES.map(lt => (
                    <option key={lt.value} value={lt.value} selected={formData.lesson_type === lt.value || undefined}>{lt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL Video (YouTube Embed URL / Opsional)</label>
                <input type="text" placeholder="https://www.youtube.com/embed/..." value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full border rounded px-3 py-2" />
                <p className="text-xs text-gray-500 mt-1">Gunakan link embed YouTube agar player dapat diputar langsung.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Konten Teks (Mendukung HTML)</label>
                <CKEditor
                editor={ ClassicEditor }
                config={ {
                  licenseKey: 'GPL',
                  plugins: [ Essentials, Paragraph, Bold, Italic, Heading, FontFamily, FontSize, FontColor, FontBackgroundColor, Strikethrough, Subscript, Superscript, Code, Link, BlockQuote, CodeBlock, TodoList, Indent ],
				          toolbar: {
                    items: [
                      'undo', 'redo',
                      '|',
                      'heading',
                      '|',
                      'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                      '|',
                      'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                      '|',
                      'link', 'uploadImage', 'blockQuote', 'codeBlock',
                      '|',
                      'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                    ],
                    shouldNotGroupWhenFull: false
                  }
                } }
                data='<p>Hello from the first editor working with the context!</p>'
                onReady={ ( editor ) => {
                  console.log( 'Editor 1 is ready to use!', editor );
                } }
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};