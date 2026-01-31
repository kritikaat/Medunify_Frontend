import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Base authentication guard - ensures user is logged in
 */
export function AuthGuard() {
  const { isLoggedIn, isLoading } = useAuth();
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

  if (!isLoggedIn) {
    // Redirect to appropriate login based on current path
    let loginPath = '/login';
    if (location.pathname.startsWith('/hospital')) {
      loginPath = '/hospital/login';
    } else if (location.pathname.startsWith('/doctor')) {
      loginPath = '/doctor/login';
    }
    
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
