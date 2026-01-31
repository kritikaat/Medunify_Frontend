import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Hospital route guard - ensures user is logged in as a hospital
 */
export function HospitalGuard() {
  const { isLoggedIn, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to hospital login
  if (!isLoggedIn) {
    return <Navigate to="/hospital/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role - redirect to their portal
  if (role === 'patient') {
    return <Navigate to="/dashboard" replace />;
  }
  if (role === 'doctor') {
    return <Navigate to="/doctor" replace />;
  }

  // Correct role (hospital) - allow access
  return <Outlet />;
}
