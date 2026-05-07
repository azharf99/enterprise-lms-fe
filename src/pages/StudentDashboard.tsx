import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, type Course } from '../api/course';
import { 
  PlayCircle, 
  Clock, 
  Trophy, 
  ChevronRight, 
  Star,
  BookOpen,
  Filter,
  Search,
  Users
} from 'lucide-react';

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

  const featuredCourse = courses[0];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome & Featured Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back, Alex! 👋</h1>
            <p className="text-gray-500 font-medium">Ready to continue your learning journey today?</p>
          </div>

          {featuredCourse ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-blue-500/5 group">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" 
                    alt="Course" 
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="flex items-center gap-2 text-white">
                      <PlayCircle className="w-8 h-8 text-[#2563eb]" />
                      <span className="font-bold text-sm tracking-wide">RESUME LEARNING</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#2563eb] text-xs font-bold uppercase tracking-widest mb-3">
                      <Clock className="w-4 h-4" />
                      In Progress • 65% Complete
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-[#2563eb] transition-colors">
                      {featuredCourse.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                      "Continuing where you left off in Module 3: Advanced Data Structures..."
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563eb] rounded-full w-[65%] shadow-[0_0_12px_rgba(37,99,235,0.4)]"></div>
                    </div>
                    <button 
                      onClick={() => navigate(`/courses/${featuredCourse.id}/modules-student`)}
                      className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                      Resume Learning <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center shadow-sm">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#2563eb]" />
                </div>
                <h3 className="text-xl font-bold mb-2">No courses started yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">Explore the catalog to find your first course and start your learning journey.</p>
                <button className="text-[#2563eb] font-bold hover:underline">Browse Course Catalog</button>
             </div>
          )}
        </div>

        {/* Stats / Goals Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#191b23] rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Your Progress
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-extrabold">12</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Courses Completed</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold">4</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">In Progress</div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Weekly Goal</span>
                  <span className="text-[#2563eb]">85%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563eb] w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="font-bold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {[
                { title: 'Project Management Exam', date: 'Tomorrow, 10:00 AM' },
                { title: 'Python Basics Quiz', date: 'Oct 15, 2026' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-10 bg-red-400 rounded-full"></div>
                  <div>
                    <div className="text-sm font-bold truncate w-40">{item.title}</div>
                    <div className="text-xs text-gray-400 font-medium">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Grid Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight">My Courses</h2>
          <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                type="text" 
                placeholder="Find a course..." 
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all w-48 focus:w-64"
               />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-gray-200 text-center shadow-sm">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-[#2563eb]" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No courses yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">You haven't been enrolled in any courses. Contact your administrator to get started with your curriculum.</p>
            <button className="bg-[#2563eb] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Contact Admin
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div 
                key={course.id} 
                className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-pointer flex flex-col"
                onClick={() => navigate(`/courses/${course.id}/modules-student`)}
              >
                <div className="h-44 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
                  <img 
                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80`} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-[#2563eb] shadow-sm">
                      Business
                    </span>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-[#2563eb] transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-6 text-[#b4690e]">
                    <span className="text-sm font-bold">4.8</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-current' : ''}`} />)}
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span>Progress</span>
                      <span className="text-[#191b23]">45%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563eb] rounded-full w-[45%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Section (Mockup) */}
      <div className="pt-10">
         <h2 className="text-2xl font-extrabold tracking-tight mb-8">Recommended for you</h2>
         <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[300px] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="aspect-video rounded-xl bg-gray-100 mb-4 overflow-hidden">
                   <img src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80`} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-sm mb-1">Modern Data Science for Executives</h4>
                <p className="text-xs text-gray-400 mb-3">Professor Robert Smith</p>
                <div className="font-extrabold text-[#2563eb]">$129.99</div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
