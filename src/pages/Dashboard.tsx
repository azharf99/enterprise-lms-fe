import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-600 p-4 shadow-md flex justify-between items-center text-white">
        <h1 className="text-xl font-bold">LMS Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
        >
          Logout
        </button>
      </nav>
      
      <main className="flex-grow p-8">
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Selamat Datang di Enterprise LMS</h2>
          <p className="text-gray-600">
            Koneksi frontend dan backend via JWT telah berhasil dan aman. Modul manajemen data akan segera hadir.
          </p>
        </div>
      </main>
    </div>
  );
};