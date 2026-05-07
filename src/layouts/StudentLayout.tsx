import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard,
  Heart,
  Settings
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinks = [
    { name: 'My Learning', path: '/student-dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Wishlist', path: '#', icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#191b23]">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 h-20 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center gap-8">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#2563eb] p-1.5 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">Enterprise Learning</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2563eb] transition-colors" />
              <input 
                type="text" 
                placeholder="Search for anything (Excel, Project Management, Design...)" 
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-[#2563eb]/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden lg:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold px-3 py-2 rounded-lg transition-all ${
                    location.pathname === link.path 
                      ? 'text-[#2563eb] bg-blue-50' 
                      : 'text-gray-500 hover:text-[#191b23] hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="h-6 w-[1px] bg-gray-100 hidden sm:block"></div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#2563eb] rounded-full border-2 border-white"></span>
              </button>
              
              <div className="relative group">
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:ring-4 hover:ring-blue-50 transition-all">
                  <User className="w-5 h-5" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-3 border-b border-gray-50 mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Student Account</p>
                    <p className="font-bold truncate text-sm">Alex Johnson</p>
                  </div>
                  <Link to="/student-dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    My Learning
                  </Link>
                  <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" />
                    Account Settings
                  </a>
                  <div className="border-t border-gray-50 mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
