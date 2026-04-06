import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menus = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Manajemen Pengguna', path: '/users' },
    { name: 'Manajemen Kursus', path: '/courses' }, // Untuk Fase berikutnya
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4 text-center border-b border-blue-800">
          <h1 className="text-xl font-bold tracking-wider">LMS ENTERPRISE</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              className={`block px-4 py-2 rounded transition-colors ${
                location.pathname.startsWith(menu.path)
                  ? 'bg-blue-700 font-semibold'
                  : 'hover:bg-blue-800'
              }`}
            >
              {menu.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {menus.find((m) => location.pathname.startsWith(m.path))?.name || 'LMS'}
          </h2>
          <div className="text-sm text-gray-500">Admin Area</div>
        </header>
        
        {/* Outlet adalah tempat di mana halaman spesifik (Dashboard, Users, dll) dirender */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};