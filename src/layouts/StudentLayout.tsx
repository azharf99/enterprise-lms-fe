import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const StudentLayout: React.FC = () => {
//   const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <span className="text-xl font-black text-blue-700 tracking-wider">ENTERPRISE LMS</span>
              <div className="hidden md:flex space-x-4">
                <Link to="/student-dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  Dashboard Belajar
                </Link>
                {/* Tambahkan menu lain di sini jika ada */}
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleLogout} 
                className="text-sm font-semibold text-red-600 hover:text-red-800 bg-red-50 px-4 py-2 rounded-lg transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};