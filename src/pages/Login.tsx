import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent) => {
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

      // Skenario 1: Backend pakai key "tokens" (Bentuk jamak & Object)
      if (data.tokens && typeof data.tokens === 'object') {
        accessToken = data.tokens.access_token;
        refreshToken = data.tokens.refresh_token;
      } 
      // Skenario 2: Backend pakai key "token", tapi isinya Object (Ini kasus Anda!)
      else if (data.token && typeof data.token === 'object') {
        accessToken = data.token.access_token;
        refreshToken = data.token.refresh_token;
      } 
      // Skenario 3: Backend pakai key "token" dan isinya String murni (Versi lama)
      else if (typeof data.token === 'string') {
        accessToken = data.token;
        refreshToken = data.token;
      } else {
        throw new Error("Struktur token dari backend tidak dikenali.");
      }

      // Validasi terakhir untuk mencegah error localStorage
      if (!accessToken || !refreshToken) {
        throw new Error("Gagal membaca token akses.");
      }

      // Simpan dengan aman
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      // navigate('/dashboard');
      window.location.href = '/';
      
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Enterprise LMS Login</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none ${
              isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};