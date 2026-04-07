import React from 'react';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Portal Siswa</h2>
            <p className="text-blue-100 mt-1">Selamat datang di Enterprise LMS.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold transition-colors"
          >
            Keluar
          </button>
        </div>
        
        <div className="p-8 text-center">
          <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Pilih Kuis atau Ujian Anda</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Gunakan tautan (URL) ujian yang diberikan oleh Tutor Anda untuk mulai mengerjakan soal dalam Mode CBT yang aman.
          </p>

          {/* Fitur opsional: Siswa bisa memasukkan ID kuis manual jika tidak dikasih link */}
          <div className="max-w-sm mx-auto flex gap-2">
            <input 
              type="text" 
              id="quizIdInput"
              placeholder="Masukkan ID Kuis..." 
              className="w-full border rounded px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              onClick={() => {
                const id = (document.getElementById('quizIdInput') as HTMLInputElement).value;
                if(id) navigate(`/quizzes/${id}/attempt`);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              Mulai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};