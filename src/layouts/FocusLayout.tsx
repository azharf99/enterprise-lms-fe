import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export const FocusLayout: React.FC = () => {
  const location = useLocation();

  // Cek apakah URL saat ini mengandung kata '/learn'
  const isLearningMode = location.pathname.includes('/learn');

  // Tentukan Teks Header
  const headerText = isLearningMode 
    ? 'ENTERPRISE LMS - LEARNING MODE' 
    : 'ENTERPRISE LMS - CBT MODE';

  // Tentukan Warna Background Header (Opsional: agar secara visual juga berbeda)
  // Mode Belajar = Indigo (Santai), Mode Ujian = Merah Gelap/Blue Navy (Serius)
  const headerBgColor = isLearningMode ? 'bg-indigo-700' : 'bg-slate-900';
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Dinamis */}
      <header className={`${headerBgColor} text-white p-4 shadow-md flex justify-center items-center transition-colors duration-300`}>
        <h1 className="text-xl font-bold tracking-wider">{headerText}</h1>
      </header>

      {/* Main Content Area (Full Width) */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};