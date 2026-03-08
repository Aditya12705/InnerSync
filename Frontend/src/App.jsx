import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { StudentLanding } from './pages/student/StudentLanding.jsx';
import { StudentDashboard } from './pages/student/StudentDashboard.jsx';
import { Assessment } from './pages/student/Assessment.jsx';
import { CrisisAlert } from './pages/student/CrisisAlert.jsx';
import { ChooseSupport } from './pages/student/ChooseSupport.jsx';
import { SelfHelp } from './pages/student/SelfHelp.jsx';
import { Journal } from './pages/student/Journal.jsx';
import { PeerSupport } from './pages/student/PeerSupport.jsx';
import { Counselor } from './pages/student/Counselor.jsx';
import { Feedback } from './pages/student/Feedback.jsx';
import { AdminLogin } from './pages/admin/AdminLogin.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { UserManagement } from './pages/admin/UserManagement.jsx';
import { CaseMonitoring } from './pages/admin/CaseMonitoring.jsx';
import { ReportsAnalytics } from './pages/admin/ReportsAnalytics.jsx';
import { OfflineCounselorSupport } from './pages/admin/OfflineCounselorSupport.jsx';
import { UpdatesNotification } from './pages/admin/UpdatesNotification.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { MoodProvider } from './context/MoodContext.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/student/Register.jsx';
import { AdminIcon } from './components/icons/AdminIcon.jsx';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget.jsx';
import styles from './App.module.scss';

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public routes */}
      <Route index element={<StudentLanding />} />
      <Route path="login" element={<Login />} />
      <Route path="student/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<AppLayout />}>
        <Route path="student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="student/dashboard" element={<RequireStudent><StudentDashboard /></RequireStudent>} />
        <Route path="student/assessment" element={<RequireStudent><Assessment /></RequireStudent>} />
        <Route path="student/journal" element={<RequireStudent><Journal /></RequireStudent>} />
        <Route path="student/crisis" element={<CrisisAlert />} />
        <Route path="student/support" element={<ChooseSupport />} />
        <Route path="student/self-help" element={<RequireStudent><SelfHelp /></RequireStudent>} />
        <Route path="student/peer" element={<PeerSupport />} />
        <Route path="student/counselor" element={<Counselor />} />
        <Route path="student/feedback" element={<Feedback />} />

        <Route path="counselor">
          <Route index element={
            <button
              onClick={() => navigate('/counselor/login')}
              className={`${styles.btn} ${styles['btn-admin']}`}
            >
              <AdminIcon className={styles['btn-icon']} />
              Counsellor Login
            </button>
          } />
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<RequireCounselor><AdminDashboard /></RequireCounselor>} />
          <Route path="users" element={<RequireCounselor><UserManagement /></RequireCounselor>} />
          <Route path="cases" element={<RequireCounselor><CaseMonitoring /></RequireCounselor>} />
          <Route path="reports" element={<RequireCounselor><ReportsAnalytics /></RequireCounselor>} />
          <Route path="offline-support" element={<RequireCounselor><OfflineCounselorSupport /></RequireCounselor>} />
          <Route path="updates" element={<RequireCounselor><UpdatesNotification /></RequireCounselor>} />
        </Route>
      </Route>
    </Routes>
  );
}

function ChatbotRenderer() {
  const location = useLocation();
  const showChatbot = location.pathname === '/' || location.pathname === '/student/dashboard';

  return showChatbot ? <ChatbotWidget /> : null;
}

export default function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <AppRoutes />
        <ChatbotRenderer />
      </MoodProvider>
    </AuthProvider>
  );
}

function RequireStudent({ children }) {
  const { studentLoggedIn } = useAuth();
  if (!studentLoggedIn) return <Navigate to="/login?role=student" replace />;
  return children;
}

function RequireCounselor({ children }) {
  const { adminLoggedIn, user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Check if user is logged in and has the correct role
  const isAuthorized = adminLoggedIn && user?.role === 'counselor';

  useEffect(() => {
    // Small delay to ensure auth state is properly set
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Store the current location they were trying to access
    return <Navigate to="/counselor/login" state={{ from: window.location.pathname }} replace />;
  }

  return children;
}