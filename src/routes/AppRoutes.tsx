import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Páginas
import { Login } from '../components/auth/Login';
import { DonorDashboard } from '../components/donor/DonorDashboard';
import { AdminDashboard } from '../components/admin/Dashboard';
import { MapView } from '../components/map/MapView';
import { NotFound } from '../components/common/NotFound';
import { MainLayout } from '../components/layout/MainLayout';

// Componente de carga
const LoadingPage = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>Cargando...</p>
  </div>
);

// Ruta protegida que requiere autenticación
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Ruta que redirige si el usuario ya está autenticado
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout title="Panel de Control">
              {user?.role === 'admin' ? (
                <AdminDashboard user={user} />
              ) : (
                <DonorDashboard user={user} />
              )}
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/mapa" 
        element={
          <ProtectedRoute>
            <MainLayout title="Mapa de Emergencias">
              <MapView />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      {/* Ruta de inicio */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}; 