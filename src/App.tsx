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

// Import Layouts
import { MainLayout } from './layouts/MainLayout';
import { FocusLayout } from './layouts/FocusLayout';

// 1. Guard Khusus Admin & Tutor
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" replace />;
  if (role !== 'Admin' && role !== 'Tutor') {
    return <Navigate to="/student-dashboard" replace />; // Lempar ke area siswa
  }
  return children;
};

// 2. Guard Khusus Siswa
const StudentRoute = ({ children }: { children: JSX.Element }) => {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" replace />;
  // Admin juga boleh ngetes tampilan siswa
  return children; 
};

// 3. Pengecekan Login Awal (Auto Redirect berdasarkan Role)
const RootRedirect = () => {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" replace />;
  if (role === 'Siswa') return <Navigate to="/student-dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Redirect Root berdasarkan Role */}
        <Route path="/" element={<RootRedirect />} />

        {/* =========================================
            GRUP 1: ADMIN & TUTOR (Main Layout dengan Sidebar)
            ========================================= */}
        <Route 
          path="/" 
          element={
            <AdminRoute>
              <MainLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="users" element={<UserManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="courses/:courseId/modules" element={<ModuleManagement />} />
          <Route path="courses/:courseId/enrollments" element={<CourseEnrollment />} />
          <Route path="modules/:moduleId/quizzes" element={<QuizManagement />} /> 
          <Route path="quizzes/:quizId/questions" element={<QuestionManagement />} />
          <Route path="modules/:moduleId/lessons" element={<LessonManagement />} />
        </Route>
        
        {/* =========================================
            GRUP 2: SISWA (Focus Layout Tanpa Sidebar)
            ========================================= */}
        <Route 
          path="/" 
          element={
            <StudentRoute>
              <FocusLayout />
            </StudentRoute>
          }
        >
          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="quizzes/:quizId/attempt" element={<QuizAttempt />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<RootRedirect />} />
        <Route path="modules/:moduleId/learn" element={<StudentLessonView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;