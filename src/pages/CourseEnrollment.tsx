import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEnrolledStudents, enrollStudent, unenrollStudent } from '../api/enrollment';
import type { Enrollment } from '../api/enrollment';
import { getUsers } from '../api/user';
import type { User } from '../api/user';

export const CourseEnrollment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const enrolled = await getEnrolledStudents(courseId);
      setEnrollments(enrolled || []);
      
      const users = await getUsers();
      // Filter hanya user yang ber-role 'Siswa'
      setAllUsers(users.filter(u => u.role === 'Siswa'));
    } catch (error) {
      console.error("Gagal memuat data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!courseId || !selectedUserId) return;
    setIsLoading(true);
    try {
      await enrollStudent(courseId, parseInt(selectedUserId));
      setSelectedUserId(''); // Reset pilihan
      fetchData(); // Refresh tabel
    } catch (error: any) {
      alert(error.response?.data?.error || "Gagal mendaftarkan siswa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async (userId: number) => {
    if (!courseId || !window.confirm("Cabut akses siswa ini dari kursus?")) return;
    setIsLoading(true);
    try {
      await unenrollStudent(courseId, userId);
      fetchData();
    } catch (error) {
      alert("Gagal mencabut akses");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter siswa yang belum terdaftar untuk dimasukkan ke dropdown
  const enrolledUserIds = enrollments.map(e => e.user_id);
  const availableUsers = allUsers.filter(u => !enrolledUserIds.includes(u.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <button onClick={() => navigate('/courses')} className="text-gray-500 hover:text-gray-800">
          &larr; Kembali ke Kursus
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Daftarkan Siswa ke Kursus ID: {courseId}</h3>
        <div className="flex space-x-3">
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 flex-grow"
          >
            <option value="">-- Pilih Siswa --</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <button 
            onClick={handleEnroll} 
            disabled={!selectedUserId || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
            {isLoading ? 'Memproses...' : 'Daftarkan Siswa'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Siswa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.user?.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.user?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.user?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button 
                    onClick={() => handleUnenroll(enrollment.user_id)} 
                    className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded"
                  >
                    Cabut Akses
                  </button>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && !isLoading && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Belum ada siswa yang terdaftar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};