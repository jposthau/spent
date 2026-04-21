import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSetup?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireSetup = false, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
        <div style={{ color: '#525252', fontSize: '14px' }}>Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/audit" replace />;
  }

  // Redirect to setup if they haven't entered wage info yet, unless they're already headed there
  if (!user.isSetup && requireSetup === false && !requireAdmin) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}
