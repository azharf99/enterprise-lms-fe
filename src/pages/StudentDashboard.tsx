import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, type Course } from '../api/course';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data || []);
      } catch (error) {
        console.error("Gagal memuat kursus siswa", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner Selamat Datang */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di Ruang Belajar! 👋</h1>
        <p className="text-blue-100 max-w-2xl">
          Pilih kelas yang ingin Anda pelajari hari ini, baca materi, dan kerjakan evaluasinya untuk menyelesaikan kursus.
        </p>
      </div>

      {/* Daftar Kursus */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Kursus Saya</h2>
        {isLoading ? (
          <div className="text-gray-500">Memuat kelas Anda...</div>
        ) : courses.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
            Anda belum terdaftar di kursus apa pun. Silakan hubungi Tutor/Admin.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="h-32 bg-gray-200 bg-linear-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{course.description}</p>
                  
                  {/* Karena kita belum membuat halaman List Modul khusus siswa, kita bisa langsung arahkan
                      ke halaman yang sudah ada (atau Anda bisa membuat StudentModuleList nanti).
                      Untuk saat ini, kita arahkan ke UI modul bawaan atau langsung ke modul pertama. */}
                  <button 
                    onClick={() => navigate(`/courses/${course.id}/modules-student`)} 
                    className="w-full text-center bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold py-2 rounded transition-colors"
                  >
                    Buka Kelas
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};