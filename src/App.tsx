import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUserRole } from './utils/auth';

// Import Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { MainLayout } from './layouts/MainLayout';
import { FocusLayout } from './layouts/FocusLayout';

// Import Pages
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const UserManagement = lazy(() => import('./pages/UserManagement').then(m => ({ default: m.UserManagement })));
const CourseManagement = lazy(() => import('./pages/CourseManagement').then(m => ({ default: m.CourseManagement })));
const ModuleManagement = lazy(() => import('./pages/ModuleManagement').then(m => ({ default: m.ModuleManagement })));
const LessonManagement = lazy(() => import('./pages/LessonManagement').then(m => ({ default: m.LessonManagement })));
const QuizManagement = lazy(() => import('./pages/QuizManagement').then(m => ({ default: m.QuizManagement })));
const QuestionManagement = lazy(() => import('./pages/QuestionManagement').then(m => ({ default: m.QuestionManagement })));
const CourseEnrollment = lazy(() => import('./pages/CourseEnrollment').then(m => ({ default: m.CourseEnrollment })));

const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const StudentModuleList = lazy(() => import('./pages/StudentModuleList').then(m => ({ default: m.StudentModuleList })));
const StudentLessonView = lazy(() => import('./pages/StudentLessonView').then(m => ({ default: m.StudentLessonView })));
const QuizAttempt = lazy(() => import('./pages/QuizAttempt').then(m => ({ default: m.QuizAttempt })));

const ExamManagement = lazy(() => import('./pages/ExamManagement').then(m => ({ default: m.ExamManagement })));
const ExamQuestionManagement = lazy(() => import('./pages/ExamQuestionManagement').then(m => ({ default: m.ExamQuestionManagement })));


const App: React.FC = () => {
  const role = getUserRole();
  return (
    <BrowserRouter>
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-blue-600 font-bold">Memuat Halaman...</div>}>
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<Login />} />

        {/* =========================================
            GRUP 1: ADMIN & TUTOR (Main Layout / Sidebar)
            ========================================= */}
        {role === 'Admin' || role === 'Tutor' ? (
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} /> 
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="courses/:courseId/modules" element={<ModuleManagement />} />
            <Route path="courses/:courseId/enrollments" element={<CourseEnrollment />} />
            <Route path="modules/:moduleId/quizzes" element={<QuizManagement />} /> 
            <Route path="quizzes/:quizId/questions" element={<QuestionManagement />} />
            <Route path="modules/:moduleId/lessons" element={<LessonManagement />} /> 
            {/* ... rute admin lainnya ... */}
            <Route path="courses/:courseId/exams" element={<ExamManagement />} />
            <Route path="exams/:examId/questions" element={<ExamQuestionManagement />} />
          </Route>
        ) : null}
        
        {/* =========================================
            GRUP SISWA (Belajar & Dashboard)
            ========================================= */}
        {role === 'Siswa' ? (
          <Route path="/" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student-dashboard" replace />} />
            <Route path="student-dashboard" element={<StudentDashboard />} />
            <Route path="courses/:courseId/modules-student" element={<StudentModuleList />} />
          </Route>
        ) : null}

        {/* =========================================
            GRUP KHUSUS (CBT & Materi Fokus)
            ========================================= */}
        <Route element={<FocusLayout />}>
          <Route path="modules/:moduleId/learn" element={<StudentLessonView />} />
          <Route path="quizzes/:quizId/attempt" element={<QuizAttempt />} />
        </Route>

        {/* Proteksi Terakhir: Jika tidak login, ke login. Jika rute salah, ke dashboard masing-masing */}
        <Route path="*" element={!role ? <Navigate to="/login" /> : <Navigate to="/" />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
export default App;