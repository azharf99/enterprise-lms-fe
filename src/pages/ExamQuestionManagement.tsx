import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamQuestions, createExamQuestion, updateExamQuestion, deleteExamQuestion, generateExamQuestionsAI, type ExamQuestion } from '../api/examQuestion';
import {QUESTION_TYPES} from './QuestionManagement'

export const ExamQuestionManagement: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Form States
  const [formData, setFormData] = useState<Partial<ExamQuestion>>({
    q_type: 'MultipleChoice', text: '', options: ['', '', '', '', ''], correct_answer: '', points: 10, explanation: ''
  });
  const [aiPrompt, setAiPrompt] = useState({ topic: '', q_type: 'MultipleChoice', count: 5 });

  const fetchQuestions = async () => {
    if (!examId) return;
    setIsLoading(true);
    try {
      const data = await getExamQuestions(examId);
      setQuestions(data);
    } catch (err) {
      console.error("Gagal memuat soal exam");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, [examId]);

  // Handler untuk AI Generation
  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId) return;
    setIsGenerating(true);
    try {
      await generateExamQuestionsAI(examId, aiPrompt);
      alert("Soal berhasil dibuat oleh AI!");
      setIsAiModalOpen(false);
      fetchQuestions();
    } catch (error: any) {
      alert(error.response?.data?.error || "Gagal membuat soal dengan AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler Form Manual
  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId) return;
    setIsLoading(true);
    
    // Pastikan options null jika tipe bukan pilihan ganda
    const finalData = { ...formData };
    if (finalData.q_type === 'Essay') finalData.options = null;

    try {
      if (modalMode === 'create') await createExamQuestion(examId, finalData);
      else if (modalMode === 'edit' && formData.id) await updateExamQuestion(formData.id, finalData);
      
      setIsModalOpen(false);
      fetchQuestions();
    } catch (error) {
      alert("Gagal menyimpan soal");
    } finally {
      setIsLoading(false);
    }
  };

  const openManualModal = (mode: 'create' | 'edit', q?: ExamQuestion) => {
    setModalMode(mode);
    if (mode === 'edit' && q) setFormData(q);
    else setFormData({ q_type: 'MultipleChoice', text: '', options: ['', '', '', '', ''], correct_answer: '', points: 10, explanation: '' });
    setIsModalOpen(true);
  };

  // Handler khusus untuk mengubah teks opsi pilihan ganda
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || ['', '', '', '', ''])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
    
    // Jika opsi yang sedang diedit kebetulan adalah kunci jawaban, update juga kuncinya
    if (formData.correct_answer === formData.options?.[index]) {
       setFormData((prev) => ({ ...prev, correct_answer: value }));
    }
  };

  // Kalkulasi Total Poin
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600 mb-2 font-semibold">&larr; Kembali</button>
          <h2 className="text-2xl font-bold text-gray-800">Bank Soal Ujian Akhir</h2>
          <div className="mt-2 text-sm text-gray-600 font-medium bg-gray-100 inline-block px-3 py-1 rounded">
            Total Soal: {questions.length} | Bobot Poin Maksimal: {totalPoints}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAiModalOpen(true)} className="px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded shadow-sm flex items-center gap-2 transition-all">
            <span>✨</span> Generate AI
          </button>
          <button onClick={() => openManualModal('create')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm transition-all">
            + Tambah Manual
          </button>
        </div>
      </div>

      {/* List Soal */}
      <div className="space-y-4">
        {questions.length === 0 && !isLoading && (
          <div className="p-10 text-center bg-white border rounded-xl shadow-sm text-gray-500">
            <span className="text-4xl block mb-3">📝</span>
            Belum ada soal ujian. Silakan tambah manual atau minta AI membuatkannya.
          </div>
        )}
        
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-start">
                <span className="bg-blue-100 text-blue-800 font-black px-3 py-1 rounded">{index + 1}</span>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{q.q_type} • {q.points} Poin</span>
                  <p className="font-semibold text-gray-800 text-lg mt-1 whitespace-pre-wrap">{q.text}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openManualModal('edit', q)} className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded font-semibold hover:bg-indigo-100">Edit</button>
                <button onClick={async () => { if(window.confirm('Hapus soal ini?')) { await deleteExamQuestion(q.id); fetchQuestions(); } }} className="text-red-600 bg-red-50 px-3 py-1 rounded font-semibold hover:bg-red-100">Hapus</button>
              </div>
            </div>

            {/* Render Opsi Pilihan Ganda */}
            {q.q_type !== 'Essay' && q.options && (
              <div className="ml-12 grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                {q.options.map((opt, i) => (
                  <div key={i} className={`p-3 border rounded text-sm font-medium ${opt === q.correct_answer ? 'bg-green-50 border-green-400 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
                    {opt}
                    {opt === q.correct_answer && <span className="ml-2 float-right">✅ Kunci</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Kunci Jawaban Essay */}
            {q.q_type === 'Essay' && (
              <div className="ml-12 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>Kunci/Panduan Penilaian:</strong> {q.correct_answer}
              </div>
            )}
            
            {/* Penjelasan */}
            {q.explanation && (
              <div className="ml-12 mt-4 text-sm text-gray-500 bg-gray-50 p-3 border-l-4 border-gray-300 rounded-r whitespace-pre-wrap">
                <strong>💡 Penjelasan:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal AI Generator */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
            {isGenerating && (
               <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
                 <div className="animate-spin text-4xl mb-4">⚙️</div>
                 <p className="text-purple-700 font-bold animate-pulse">Gemini sedang menyusun soal Ujian...</p>
               </div>
            )}
            <h2 className="text-2xl font-black text-gray-800 mb-2">✨ AI Exam Generator</h2>
            <p className="text-sm text-gray-500 mb-6">Buat soal ujian akhir komprehensif (Multi-Modul) dalam hitungan detik.</p>
            
            <form onSubmit={handleAIGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Topik / Cakupan Materi Ujian</label>
                <textarea required rows={3} placeholder="Contoh: Seluruh materi Biologi semester 1 dari tingkat seluler hingga ekosistem..." value={aiPrompt.topic} onChange={e => setAiPrompt({...aiPrompt, topic: e.target.value})} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tipe Soal</label>
                <select value={aiPrompt.q_type} onChange={e => setAiPrompt({...aiPrompt, q_type: e.target.value})} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 outline-none">
                    {QUESTION_TYPES.map(qt => (
                      <option key={qt.value} value={qt.value}>{qt.label}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah Soal</label>
                <input type="number" min="1" max="20" required value={aiPrompt.count || undefined} onChange={e => setAiPrompt({...aiPrompt, count: Number(e.target.value)})} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsAiModalOpen(false)} className="px-5 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white font-bold rounded-lg shadow hover:bg-purple-700">🚀 Generate Sekarang</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl my-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {modalMode === 'create' ? 'Tambah Soal Ujian' : 'Edit Soal Ujian'}
            </h2>
            <form onSubmit={handleSaveManual} className="space-y-6">
              
              {/* Baris Pertama: Tipe Soal & Poin */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tipe Soal</label>
                  <select 
                    value={formData.q_type} 
                    onChange={e => {
                      const newType = e.target.value;
                      // Reset data menyesuaikan tipe
                      if (newType === 'MultipleChoice') {
                        setFormData({...formData, q_type: newType, options: ['', '', '', '', ''], correct_answer: ''});
                      } else if (newType === 'TrueFalse') {
                        setFormData({...formData, q_type: newType, options: ['Benar', 'Salah'], correct_answer: 'Benar'});
                      } else {
                        setFormData({...formData, q_type: newType, options: null, correct_answer: ''});
                      }
                    }} 
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                  >
                    <option value="MultipleChoice">Pilihan Ganda</option>
                    <option value="TrueFalse">Benar / Salah</option>
                    <option value="Essay">Essay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bobot Nilai (Points)</label>
                  <input 
                    type="number" min="1" required 
                    value={formData.points} 
                    onChange={e => setFormData({...formData, points: Number(e.target.value)})} 
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 outline-none" 
                  />
                </div>
              </div>

              {/* Teks Pertanyaan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pertanyaan</label>
                <textarea 
                  rows={4} required 
                  placeholder="Ketik pertanyaan di sini..."
                  value={formData.text} 
                  onChange={e => setFormData({...formData, text: e.target.value})} 
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 outline-none font-medium" 
                />
              </div>

              {/* Area Jawaban Dinamis Berdasarkan Tipe Soal */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-4">Jawaban & Kunci</label>
                
                {/* 1. Form Multiple Choice */}
                {formData.q_type === 'MultipleChoice' && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 mb-3">Pilih radio button di sebelah kiri untuk menentukan kunci jawaban yang benar.</p>
                    {(formData.options || ['', '', '', '', '']).map((opt, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="correct_answer" 
                          required
                          checked={formData.correct_answer === opt && opt !== ''} 
                          onChange={() => setFormData({...formData, correct_answer: opt})}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1 flex items-center gap-2">
                          <span className="font-bold text-gray-500">{String.fromCharCode(65 + i)}.</span>
                          <input 
                            type="text" required 
                            placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
                            value={opt} 
                            onChange={e => handleOptionChange(i, e.target.value)} 
                            className={`w-full border-2 rounded-lg px-3 py-2 outline-none transition-colors ${formData.correct_answer === opt && opt !== '' ? 'border-green-400 bg-green-50' : 'border-gray-200 focus:border-blue-400'}`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Form True/False */}
                {formData.q_type === 'TrueFalse' && (
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer p-3 bg-white border-2 rounded-lg hover:border-blue-400 transition-colors">
                      <input 
                        type="radio" name="tf_answer" value="Benar" 
                        checked={formData.correct_answer === 'Benar'} 
                        onChange={e => setFormData({...formData, correct_answer: e.target.value})}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-bold text-gray-700">Benar</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 bg-white border-2 rounded-lg hover:border-blue-400 transition-colors">
                      <input 
                        type="radio" name="tf_answer" value="Salah" 
                        checked={formData.correct_answer === 'Salah'} 
                        onChange={e => setFormData({...formData, correct_answer: e.target.value})}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-bold text-gray-700">Salah</span>
                    </label>
                  </div>
                )}

                {/* 3. Form Essay */}
                {formData.q_type === 'Essay' && (
                  <div>
                    <textarea 
                      rows={3} required 
                      placeholder="Masukkan panduan jawaban yang benar (Rubrik Penilaian) untuk membantu Tutor mengoreksi..."
                      value={formData.correct_answer} 
                      onChange={e => setFormData({...formData, correct_answer: e.target.value})} 
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-yellow-500 outline-none bg-yellow-50 text-yellow-900 placeholder-yellow-600/50" 
                    />
                  </div>
                )}
              </div>

              {/* Penjelasan Pembahasan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Penjelasan (Opsional)</label>
                <textarea 
                  rows={2} 
                  placeholder="Ketik penjelasan untuk ditampilkan setelah siswa menjawab..."
                  value={formData.explanation} 
                  onChange={e => setFormData({...formData, explanation: e.target.value})} 
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 outline-none" 
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : 'Simpan Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Manual (Disembunyikan demi keringkasan kode, gunakan form standar yang sama persis dengan Quiz Question Management) */}
    </div>
  );
};