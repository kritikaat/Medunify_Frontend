import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Patient route guard - ensures user is logged in as a patient
 */
export function PatientGuard() {
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

  // Not logged in - redirect to patient login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role - redirect to their portal
  if (role === 'doctor') {
    return <Navigate to="/doctor" replace />;
  }
  if (role === 'hospital') {
    return <Navigate to="/hospital" replace />;
  }

  // Correct role (patient) - allow access
  return <Outlet />;
}
