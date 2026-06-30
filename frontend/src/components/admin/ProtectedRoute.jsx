import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Client-side gate only — purely a UX convenience. The real enforcement
 * happens on every backend request via requireAuth + requireAdmin, since
 * a frontend redirect can never be trusted as the source of authorization.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <span className="font-mono text-sm text-light-accent/50">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
