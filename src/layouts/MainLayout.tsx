import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  User
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menus = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Users', path: '/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Courses', path: '/courses', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#191b23]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#2563eb] p-2 rounded-lg shadow-lg shadow-blue-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#191b23]">Enterprise</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Main Menu</div>
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path || (menu.path !== '/dashboard' && location.pathname.startsWith(menu.path));
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-blue-50 text-[#2563eb] shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#191b23]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#2563eb]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {menu.icon}
                  </span>
                  <span className="font-semibold text-sm">{menu.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex justify-between items-center sticky top-0 z-10">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-[#191b23]">Administrator</div>
                <div className="text-[11px] text-gray-400 font-medium">Enterprise Admin</div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-[#2563eb]">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
