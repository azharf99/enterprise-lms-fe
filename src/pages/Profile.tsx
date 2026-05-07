import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, type User } from '../api/user';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Shield, 
  Save, 
  CheckCircle, 
  X,
  AlertCircle
} from 'lucide-react';

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Partial<User>>({});
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await updateProfile({ name: profile.name });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      await updateProfile({ 
        // Backend usually expects these fields for password change
        password: passwordData.newPassword 
      } as any);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to change password.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
        <p className="text-gray-500 font-medium">Manage your account settings and security.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in zoom-in duration-300 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-100' 
            : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          <div className={`p-1 rounded-full ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <span className="text-sm font-bold">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-black/5 rounded-lg transition-colors">
            <X className="w-4 h-4 opacity-50" />
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Account Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-[#2563eb]" />
              Personal Information
            </h3>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={profile.email || ''}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-medium cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-gray-400 px-1 italic">Email address cannot be changed.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 px-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2563eb] transition-colors" />
                  <input
                    type="text"
                    required
                    value={profile.name || ''}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#2563eb]/20 outline-none transition-all font-medium"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#2563eb]" />
              Security Settings
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 px-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#2563eb]/20 outline-none transition-all font-medium"
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 px-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#2563eb]/20 outline-none transition-all font-medium"
                  placeholder="Repeat new password"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  {isLoading ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar / Info */}
        <div className="space-y-6">
          <div className="bg-[#191b23] rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-[#2563eb] mb-6 relative z-10">
              <UserIcon className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold mb-1 relative z-10">{profile.name}</h4>
            <p className="text-gray-400 text-sm mb-6 relative z-10">{profile.role} Account</p>
            <div className="pt-6 border-t border-white/10 relative z-10">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Account Status</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] p-8">
            <h4 className="font-bold text-[#191b23] mb-3">Professional Tip</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Keep your profile updated to receive personalized course recommendations and ensure your certifications have the correct name.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
