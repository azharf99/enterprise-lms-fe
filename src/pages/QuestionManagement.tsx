import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsByQuiz, createQuestion, updateQuestion, deleteQuestion, generateQuestionsWithAI } from '../api/question';
import type { Question } from '../api/question';


// Daftar 7 Tipe Soal sesuai standar LMS Enterprise
export const QUESTION_TYPES = [
  { value: 'MultipleChoice', label: 'Pilihan Ganda (Multiple Choice)' },
  { value: 'MultipleResponse', label: 'Pilihan Ganda Kompleks (Multiple Response)' },
  { value: 'TrueFalse', label: 'Benar / Salah (True / False)' },
  { value: 'Matching', label: 'Menjodohkan (Matching)' },
  { value: 'FillInTheBlank', label: 'Isian Singkat (Fill in the Blank)' },
  { value: 'ShortAnswer', label: 'Jawaban Pendek (Short Answer)' },
  { value: 'Essay', label: 'Esai Bebas (Essay)' },
];

export const QuestionManagement: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiForm, setAiForm] = useState({ topic: '', qType: 'MultipleChoice', count: 5 });

  // State Manual CRUD Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [manualForm, setManualForm] = useState<Partial<Question>>({
    type: 'MultipleChoice', text: '', correct_answer: '', points: 10, explanation: '', options: []
  });
  const [optionsText, setOptionsText] = useState(''); // State sementara untuk textarea opsi

  const fetchQuestions = async () => {
    if (!quizId) return;
    setIsLoading(true);
    try {
      const data = await getQuestionsByQuiz(quizId);
      setQuestions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, [quizId]);

  // --- HANDLER AI ---
  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizId) return;
    setIsLoading(true);
    try {
      await generateQuestionsWithAI(quizId, aiForm.topic, aiForm.qType, aiForm.count);
      alert("Soal berhasil dibuat oleh AI!");
      setIsAiModalOpen(false);
      fetchQuestions();
    } catch (error: any) {
      alert(error.response?.data?.error || "Gagal membuat soal dengan AI");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER MANUAL CRUD ---
  const openManualModal = (mode: 'create' | 'edit', q?: Question) => {
    setModalMode(mode);
    if (mode === 'edit' && q) {
      setManualForm({ ...q });
      // Ubah array opsi menjadi string yang dipisahkan baris baru untuk textarea
      setOptionsText(q.options ? q.options.join('\n') : '');
    } else {
      setManualForm({ type: 'MultipleChoice', text: '', correct_answer: '', points: 10, explanation: '', options: [] });
      setOptionsText('');
    }
    setIsManualModalOpen(true);
  };

  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizId) return;
    setIsLoading(true);
    try {
      // Pecah string opsi dari textarea menjadi array (buang baris kosong)
      const parsedOptions = optionsText.split('\n').map(opt => opt.trim()).filter(opt => opt !== '');
      const payload: Partial<Question> = { ...manualForm, options: parsedOptions };

      if (modalMode === 'create') {
        await createQuestion(quizId, payload);
      } else if (modalMode === 'edit' && manualForm.id) {
        await updateQuestion(manualForm.id, payload);
      }
      setIsManualModalOpen(false);
      fetchQuestions();
    } catch (error: any) {
      alert(error.response?.data?.error || "Gagal menyimpan soal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus soal ini secara permanen?")) return;
    setIsLoading(true);
    try {
      await deleteQuestion(id);
      fetchQuestions();
    } catch (error) {
      alert("Gagal menghapus soal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tombol Aksi */}
      <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 mb-2">&larr; Kembali ke Kuis</button>
          <h3 className="text-lg font-semibold">Manajemen Soal (Kuis ID: {quizId})</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => openManualModal('create')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-sm">
            + Tambah Manual
          </button>
          <button onClick={() => setIsAiModalOpen(true)} className="px-4 py-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded shadow-sm flex items-center gap-2">
            ✨ Generate with AI
          </button>
        </div>
      </div>

      {/* Daftar Soal */}
      <div className="space-y-4">
        {questions.length === 0 && !isLoading && (
          <div className="text-center p-8 bg-white border rounded text-gray-500">Belum ada soal. Silakan buat manual atau generate dengan AI.</div>
        )}
        
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-lg shadow-sm border relative">
            <div className="absolute top-4 right-4 flex space-x-3">
              <button onClick={() => openManualModal('edit', q)} className="text-indigo-600 hover:text-indigo-900 font-semibold">Edit</button>
              <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:text-red-700 font-semibold">Hapus</button>
            </div>

            <div className="flex gap-4 pr-32">
              <div className="font-bold text-lg">{index + 1}.</div>
              <div className="w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">{q.type}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">{q.points} Poin</span>
                </div>
                <p className="font-medium text-gray-800 mb-3">{q.text}</p>
                
                {q.options && q.options.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {q.options.map((opt, i) => (
                      <li key={i} className={`p-2 rounded border ${opt === q.correct_answer ? 'bg-green-100 border-green-400 font-semibold' : 'bg-gray-50 border-gray-200'}`}>
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded text-sm mt-3">
                  <strong>Kunci Jawaban:</strong> {q.correct_answer} <br/>
                  <strong>Penjelasan:</strong> {q.explanation || '-'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Generate AI */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">✨ AI Question Generator</h2>
            <form onSubmit={handleGenerateAI} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topik / Materi</label>
                <textarea required rows={3} value={aiForm.topic} onChange={e => setAiForm({...aiForm, topic: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Soal (qType)</label>
                <select value={aiForm.qType} onChange={e => setAiForm({...aiForm, qType: e.target.value})} className="w-full border rounded px-3 py-2 bg-white">
                  {QUESTION_TYPES.map(qt => (
                    <option key={qt.value} value={qt.value}>{qt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Soal</label>
                <input type="number" required min="1" max="20" value={aiForm.count} onChange={e => setAiForm({...aiForm, count: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsAiModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white rounded font-bold">
                  {isLoading ? 'Loading AI...' : 'Generate AI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Manual Create / Edit */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{modalMode === 'create' ? 'Tambah Soal Manual' : 'Edit Soal'}</h2>
            <form onSubmit={handleSaveManual} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Soal</label>
                  <select required value={manualForm.type} onChange={e => setManualForm({...manualForm, type: e.target.value})} className="w-full border rounded px-3 py-2 bg-white">
                    {QUESTION_TYPES.map(qt => (
                      <option key={qt.value} value={qt.value}>{qt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poin (Nilai)</label>
                  <input type="number" required min="1" value={manualForm.points} onChange={e => setManualForm({...manualForm, points: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                <textarea required rows={3} value={manualForm.text} onChange={e => setManualForm({...manualForm, text: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>

              {/* Tampilkan input opsi HANYA jika tipe soal membutuhkannya */}
              {['MultipleChoice', 'MultipleResponse', 'Matching'].includes(manualForm.type || '') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opsi Jawaban (Pisahkan dengan baris baru / Enter)</label>
                  <textarea rows={4} value={optionsText} onChange={e => setOptionsText(e.target.value)} placeholder="Opsi A&#10;Opsi B&#10;Opsi C&#10;Opsi D" className="w-full border rounded px-3 py-2" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kunci Jawaban</label>
                <input type="text" required value={manualForm.correct_answer} onChange={e => setManualForm({...manualForm, correct_answer: e.target.value})} placeholder="Ketik teks jawaban benar..." className="w-full border rounded px-3 py-2" />
                <p className="text-xs text-gray-500 mt-1">Pastikan tulisan sama persis dengan opsi yang benar jika tipe pilihan ganda.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penjelasan (Opsional)</label>
                <textarea rows={2} value={manualForm.explanation} onChange={e => setManualForm({...manualForm, explanation: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsManualModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold">
                  {isLoading ? 'Menyimpan...' : 'Simpan Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};