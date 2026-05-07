import React, { useState } from 'react';
import { axiosInstance } from '../api/axiosInstance';
import { 
  BookOpen, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/users/login', {
        email,
        password,
      });

      const data = response.data;
      let accessToken = "";
      let refreshToken = "";

      if (data.tokens && typeof data.tokens === 'object') {
        accessToken = data.tokens.access_token;
        refreshToken = data.tokens.refresh_token;
      } 
      else if (data.token && typeof data.token === 'object') {
        accessToken = data.token.access_token;
        refreshToken = data.token.refresh_token;
      } 
      else if (typeof data.token === 'string') {
        accessToken = data.token;
        refreshToken = data.token;
      } else {
        throw new Error("Struktur token dari backend tidak dikenali.");
      }

      if (!accessToken || !refreshToken) {
        throw new Error("Gagal membaca token akses.");
      }

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      window.location.href = '/';
      
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex font-['Plus_Jakarta_Sans',sans-serif] text-[#191b23]">
      {/* Left Side - Visual/Info */}
      <div className="hidden lg:flex w-1/2 bg-[#191b23] relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-0 left-0 w-full h-full bg-[#2563eb]/5 -skew-x-12 translate-x-1/2" />
        
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="bg-[#2563eb] p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Enterprise Learning</span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-8">
            Empower your team with <span className="text-[#2563eb]">world-class</span> knowledge.
          </h2>
          <div className="space-y-6">
            {[
              { icon: <CheckCircle className="w-5 h-5 text-green-400" />, text: 'Access to over 10,000+ expert-led courses' },
              { icon: <ShieldCheck className="w-5 h-5 text-blue-400" />, text: 'Enterprise-grade security and compliance' },
              { icon: <Zap className="w-5 h-5 text-yellow-400" />, text: 'Seamless integration with your existing tools' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-300 font-medium">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#191b23] bg-gray-700 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Joined by <span className="text-white font-bold">50,000+</span> professionals this month.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="mb-10 lg:hidden">
             <Link to="/" className="flex items-center gap-3">
                <div className="bg-[#2563eb] p-1.5 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">Enterprise Learning</span>
             </Link>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-medium mb-8">Please enter your details to sign in.</p>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3">
              <div className="bg-red-100 p-1 rounded-full"><Lock className="w-4 h-4" /></div>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2563eb] transition-colors" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#2563eb]/20 outline-none transition-all font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <a href="#" className="text-xs font-bold text-[#2563eb] hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2563eb] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#2563eb]/20 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
               <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" />
               <label htmlFor="remember" className="text-sm font-semibold text-gray-500 cursor-pointer">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#2563eb] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 text-sm font-medium">
            Don't have an account? <a href="#" className="text-[#2563eb] font-bold hover:underline">Contact your HR Department</a>
          </p>
        </div>
      </div>
    </div>
  );
};
