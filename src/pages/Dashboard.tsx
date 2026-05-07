import React from 'react';
import { 
  BarChart2, 
  Users, 
  BookOpen, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Calendar,
  MoreVertical,
  Trophy,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { getUserRole } from '../utils/auth';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const role = getUserRole();
  const isTutor = role === 'Tutor';

  const stats = [
    { label: isTutor ? 'My Students' : 'Total Students', value: '1,284', change: '+12%', icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50' },
    { label: isTutor ? 'My Courses' : 'Active Courses', value: '42', change: '+5%', icon: <BookOpen className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Avg. Completion', value: '86%', change: '+2.4%', icon: <TrendingUp className="w-6 h-6 text-green-600" />, bg: 'bg-green-50' },
    { label: 'Revenue Earned', value: '$12.4k', change: '+18%', icon: <BarChart2 className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{isTutor ? 'Instructor Dashboard' : 'Admin Dashboard'}</h1>
          <p className="text-gray-500 font-medium">Welcome back! Here's what's happening with your programs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/profile" className="bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            My Profile
          </Link>
          <button className="bg-[#2563eb] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-gray-50 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-extrabold mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Section (Placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-50 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg">Enrollment Growth</h3>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
             <div className="text-center">
                <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm font-medium">Analytics Visualization Coming Soon</p>
             </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[2rem] border border-gray-50 p-8 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { user: 'Alex J.', action: 'Enrolled in PMP Course', time: '2 mins ago', icon: <CheckCircle className="w-4 h-4 text-[#2563eb]" /> },
              { user: 'Sarah W.', action: 'Completed Lesson 4', time: '15 mins ago', icon: <Clock className="w-4 h-4 text-orange-400" /> },
              { user: 'Admin', action: 'Created new exam', time: '1 hour ago', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
              { user: 'John D.', action: 'Passed Python Basics', time: '3 hours ago', icon: <Trophy className="w-4 h-4 text-yellow-400" /> },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-start group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  {activity.icon}
                </div>
                <div>
                  <div className="text-sm font-bold">
                    <span className="text-[#2563eb]">{activity.user}</span> {activity.action}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-50 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};
