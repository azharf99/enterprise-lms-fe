import React, { type JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUserRole } from './utils/auth';

// Import Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { CourseManagement } from './pages/CourseManagement';
import { ModuleManagement } from './pages/ModuleManagement';
import { CourseEnrollment } from './pages/CourseEnrollment';
import { QuizManagement } from './pages/QuizManagement';
import { QuestionManagement } from './pages/QuestionManagement';
import { QuizAttempt } from './pages/QuizAttempt';
import { StudentDashboard } from './pages/StudentDashboard';
import { LessonManagement } from './pages/LessonManagement';
import { StudentLessonView } from './pages/StudentLessonView';
import { StudentLayout } from './layouts/StudentLayout';
import { StudentModuleList } from './pages/StudentModuleList';
// Import Layouts
import { MainLayout } from './layouts/MainLayout';
import { FocusLayout } from './layouts/FocusLayout';


const App: React.FC = () => {
  const role = getUserRole();
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};
export default App;