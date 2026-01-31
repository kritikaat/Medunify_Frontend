import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface HospitalHeaderProps {
  title?: string;
  subtitle?: string;
}

export function HospitalHeader({ title, subtitle }: HospitalHeaderProps) {
  const { user } = useAuth();

  // Get first name
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b border-border px-6 flex items-center justify-between">
      {/* Welcome Message */}
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          {title || `${getGreeting()}, ${firstName}`}
        </h1>
        <p className="text-sm text-muted-foreground">
          {subtitle || 'Manage your hospital and doctors'}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-10 w-64 bg-muted/50"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </Button>

        {/* Profile */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">
            {user?.name?.charAt(0).toUpperCase() || 'H'}
          </span>
        </div>
      </div>
    </header>
  );
}
