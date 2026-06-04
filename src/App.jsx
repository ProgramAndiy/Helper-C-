import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import TheoryLibrary from './pages/public/TheoryLibrary';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TestManagement from './pages/admin/TestManagement';
import StudentsManagement from './pages/admin/StudentsManagement';
import AdminSettings from './pages/admin/AdminSettings';
import StudentDashboard from './pages/student/StudentDashboard';
import LessonPage from './pages/student/LessonPage';
import IdePage from './pages/student/IdePage';
import CertificatePage from './pages/student/CertificatePage';
import ProfilePage from './pages/student/ProfilePage';
import MainLayout from './components/MainLayout';
import { AuthProvider } from './context/AuthContext';
import './index.scss';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/theory" element={<TheoryLibrary />} />
          <Route path="/login" element={<AuthPage />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin" element={<MainLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tests" element={<TestManagement />} />
            <Route path="students" element={<StudentsManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Student Routes with Layout */}
          <Route path="/student" element={<MainLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="lesson" element={<LessonPage />} />
            <Route path="ide" element={<IdePage />} />
            <Route path="certificate" element={<CertificatePage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
