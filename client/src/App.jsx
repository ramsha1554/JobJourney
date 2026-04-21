import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import LoadingFallback from './components/LoadingFallback';

// Lazy load components
const Layout = lazy(() => import('./components/Layout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const JobBoard = lazy(() => import('./pages/JobBoard'));
const AddJob = lazy(() => import('./pages/AddJob'));
const ResumeManager = lazy(() => import('./pages/ResumeManager'));
const JobDetail = lazy(() => import('./pages/JobDetail'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="jobs" element={<JobBoard />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="resumes" element={<ResumeManager />} />
                <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
                <Route path="add-job" element={<AddJob />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
