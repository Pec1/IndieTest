import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/routing/ErrorBoundary';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { DevDashboard } from './pages/DevDashboard';
import { NewProject } from './pages/NewProject';
import { BugReport } from './pages/BugReport';
import { BugTracker } from './pages/BugTracker';
import { BugDiscussion } from './pages/BugDiscussion';
import { ProjectDetails } from './pages/ProjectDetails';
import { Settings } from './pages/Settings';
import { FeedbackHub } from './pages/FeedbackHub';
import { StartTestSession } from './pages/StartTestSession';
import { ManageVersions } from './pages/ManageVersions';
import { Invites } from './pages/Invites';
import { Notifications } from './pages/Notifications';

export function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dev" element={<ProtectedRoute tiposPermitidos={['desenvolvedor','administrador']}><DevDashboard /></ProtectedRoute>} />
          <Route path="/dev/new-project" element={<ProtectedRoute tiposPermitidos={['desenvolvedor']}><NewProject /></ProtectedRoute>} />
          <Route path="/dev/project/:id/versoes" element={<ProtectedRoute tiposPermitidos={['desenvolvedor']}><ManageVersions /></ProtectedRoute>} />
          <Route path="/report-bug" element={<ProtectedRoute><BugReport /></ProtectedRoute>} />
          <Route path="/bug-tracker" element={<ProtectedRoute><BugTracker /></ProtectedRoute>} />
          <Route path="/bug/:id" element={<ProtectedRoute><BugDiscussion /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><FeedbackHub /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/start-session" element={<ProtectedRoute tiposPermitidos={['testador']}><StartTestSession /></ProtectedRoute>} />
          <Route path="/convites" element={<ProtectedRoute><Invites /></ProtectedRoute>} />
          <Route path="/notificacoes" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
