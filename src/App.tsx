import React, { type JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { MainLayout } from './layouts/MainLayout';
import { CourseManagement } from './pages/CourseManagement';
import { ModuleManagement } from './pages/ModuleManagement';
import { CourseEnrollment } from './pages/CourseEnrollment';
import { QuizManagement } from './pages/QuizManagement';
import { QuestionManagement } from './pages/QuestionManagement';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rute yang dilindungi Auth dan dibungkus oleh MainLayout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Perbarui file Dashboard Anda agar tidak me-render Navbar/Sidebar lagi karena sudah di-handle MainLayout */}
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="users" element={<UserManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="courses/:courseId/modules" element={<ModuleManagement />} />
          <Route path="courses/:courseId/enrollments" element={<CourseEnrollment />} />
          <Route path="modules/:moduleId/quizzes" element={<QuizManagement />} /> 
          <Route path="quizzes/:quizId/questions" element={<QuestionManagement />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;