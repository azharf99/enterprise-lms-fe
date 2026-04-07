import React from 'react';
import { Outlet } from 'react-router-dom';

export const FocusLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Minimalis untuk Mode Ujian */}
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-center items-center">
        <h1 className="text-xl font-bold tracking-wider">ENTERPRISE LMS - CBT MODE</h1>
      </header>

      {/* Main Content Area (Full Width) */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};