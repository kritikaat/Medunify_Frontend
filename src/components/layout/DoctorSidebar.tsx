import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Stethoscope,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor' },
  { icon: Users, label: 'My Patients', href: '/doctor/patients' },
];

const bottomItems = [
  { icon: Settings, label: 'Profile Settings', href: '/doctor/settings' },
];

export function DoctorSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  // Get initials from doctor name
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      // For "Dr. Rajesh Kumar", get "RK"
      return parts.slice(1).map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6">
          <Link to="/doctor" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-green-md">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold text-sidebar-foreground block">MedUnify</span>
              <span className="text-xs text-muted-foreground">Doctor Portal</span>
            </div>
          </Link>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/doctor/patients' && location.pathname.startsWith('/doctor/patients'));
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="doctorActiveTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary rounded-r-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Nav */}
        <div className="px-3 pb-4">
          <div className="border-t border-sidebar-border pt-4 mb-4">
            <ul className="space-y-1">
              {bottomItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Doctor Profile */}
          <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user?.name ? getInitials(user.name) : 'DR'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || 'Doctor'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user?.specialization || user?.email || 'doctor@example.com'}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-sidebar-border rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
