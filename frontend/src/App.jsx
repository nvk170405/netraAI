import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';

import LoginPage from './pages/LoginPage';
import HealthWorkerLayout from './layouts/HealthWorkerLayout';
import DoctorLayout from './layouts/DoctorLayout';
import AdminLayout from './layouts/AdminLayout';

import Dashboard from './pages/health-worker/Dashboard';
import NewScreening from './pages/health-worker/NewScreening';
import PatientRegistration from './pages/health-worker/PatientRegistration';
import ImageCapture from './pages/health-worker/ImageCapture';
import ImageQualityCheck from './pages/health-worker/ImageQualityCheck';
import AIAnalysis from './pages/health-worker/AIAnalysis';
import ResultsPage from './pages/health-worker/ResultsPage';
import ExplainabilityPage from './pages/health-worker/ExplainabilityPage';
import ReportPage from './pages/health-worker/ReportPage';
import ScreeningsList from './pages/health-worker/ScreeningsList';
import TeleOphthalmologyHub from './pages/health-worker/TeleOphthalmologyHub';
import ICDRProtocols from './pages/health-worker/ICDRProtocols';
import UrgentEscalation from './pages/health-worker/UrgentEscalation';
import AIScreeningAssistant from './pages/health-worker/AIScreeningAssistant';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import CaseReview from './pages/doctor/CaseReview';

import AdminDashboard from './pages/admin/AdminDashboard';

import LandingPage from './pages/LandingPage';
import LoadingPage from './pages/LoadingPage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRoutes = { health_worker: '/dashboard', doctor: '/doctor', admin: '/admin' };
    return <Navigate to={roleRoutes[user.role] || '/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      <Route path="/login" element={
        isAuthenticated ? <Navigate to={user.role === 'doctor' ? '/doctor' : user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage />
      } />

      {/* Health Worker Routes (Pathless Layout Route) */}
      <Route element={
        <ProtectedRoute allowedRoles={['health_worker']}>
          <HealthWorkerLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/screening/new" element={<NewScreening />} />
        <Route path="/screening/register" element={<PatientRegistration />} />
        <Route path="/screening/capture" element={<ImageCapture />} />
        <Route path="/screening/quality" element={<ImageQualityCheck />} />
        <Route path="/screening/analysis" element={<AIAnalysis />} />
        <Route path="/screening/results" element={<ResultsPage />} />
        <Route path="/screening/explain" element={<ExplainabilityPage />} />
        <Route path="/screening/report" element={<ReportPage />} />
        <Route path="/screenings" element={<ScreeningsList />} />
        <Route path="/tele-ophthalmology" element={<TeleOphthalmologyHub />} />
        <Route path="/protocols" element={<ICDRProtocols />} />
        <Route path="/escalation" element={<UrgentEscalation />} />
        <Route path="/assistant" element={<AIScreeningAssistant />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DoctorDashboard />} />
        <Route path="case/:caseId" element={<CaseReview />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
      </Route>

      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <OfflineProvider>
            <AppRoutes />
          </OfflineProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
