import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './routes/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';

// Lazy-loaded page components for dynamic code-splitting & optimal bundle chunking
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const VaultPage = lazy(() => import('./pages/VaultPage'));
const SecurityCenterPage = lazy(() => import('./pages/SecurityCenterPage'));
const PasswordGeneratorPage = lazy(() => import('./pages/PasswordGeneratorPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/security" element={<SecurityCenterPage />} />
            <Route path="/generator" element={<PasswordGeneratorPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback Redirect */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
