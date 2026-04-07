import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonsByModule, type Lesson } from '../api/lesson';

export const StudentLessonView: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!moduleId) return;
      try {
        const data = await getLessonsByModule(moduleId);
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0]); // Auto-select materi pertama
      } catch (error) {
        console.error("Gagal memuat materi");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [moduleId]);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Memuat Materi...</div>;

  return (
    <div className="h-[85vh] flex flex-col md:flex-row bg-white rounded-xl shadow-lg border overflow-hidden mt-4">
      
      {/* Sidebar Daftar Materi */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 border-r overflow-y-auto flex flex-col">
        <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <h3 className="font-bold">Daftar Materi</h3>
          <button onClick={() => navigate('/student-dashboard')} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">
            Tutup
          </button>
        </div>
        <div className="flex-1">
          {lessons.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm text-center">Belum ada materi di modul ini.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {lessons.map((lesson, index) => (
                <li 
                  key={lesson.id} 
                  onClick={() => setActiveLesson(lesson)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-blue-50 flex gap-3 ${activeLesson?.id === lesson.id ? 'bg-blue-100 border-l-4 border-blue-600' : ''}`}
                >
                  <div className={`font-bold ${activeLesson?.id === lesson.id ? 'text-blue-700' : 'text-gray-500'}`}>
                    {index + 1}.
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${activeLesson?.id === lesson.id ? 'text-blue-800' : 'text-gray-800'}`}>
                      {lesson.title}
                    </h4>
                    {lesson.video_url && <span className="text-xs text-blue-500 mt-1 inline-block">▶ Ada Video</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-white overflow-y-auto p-6 md:p-10 relative">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-6">{activeLesson.title}</h1>
            
            {/* Player Video */}
            {activeLesson.video_url && (
              <div className="relative w-full overflow-hidden rounded-xl shadow-lg mb-8" style={{ paddingTop: '56.25%' }}>
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={activeLesson.video_url} 
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* Konten Teks/HTML */}
            <div 
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: activeLesson.content || '<p>Tidak ada konten</p>' }} 
            />
            
            {/* Navigasi Cepat (Prev/Next Materi) */}
            <div className="mt-12 pt-6 border-t flex justify-between">
              {lessons.findIndex(l => l.id === activeLesson.id) > 0 && (
                <button onClick={() => setActiveLesson(lessons[lessons.findIndex(l => l.id === activeLesson.id) - 1])} className="text-blue-600 font-semibold">
                  &larr; Materi Sebelumnya
                </button>
              )}
              {lessons.findIndex(l => l.id === activeLesson.id) < lessons.length - 1 && (
                <button onClick={() => setActiveLesson(lessons[lessons.findIndex(l => l.id === activeLesson.id) + 1])} className="text-blue-600 font-semibold ml-auto">
                  Materi Selanjutnya &rarr;
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 font-semibold text-xl">
            Pilih materi di sidebar untuk memulai belajar.
          </div>
        )}
      </div>

    </div>
  );
};