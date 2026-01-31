import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface DoctorHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DoctorHeader({ title, subtitle }: DoctorHeaderProps) {
  const { user } = useAuth();

  // Get first name (skip "Dr." prefix)
  const getFirstName = () => {
    if (!user?.name) return 'Doctor';
    const parts = user.name.split(' ');
    return parts.length > 1 ? parts[1] : parts[0];
  };

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
          {title || `${getGreeting()}, Dr. ${getFirstName()}`}
        </h1>
        <p className="text-sm text-muted-foreground">
          {subtitle || (user?.hospital_name ? `${user.hospital_name}` : 'View and manage your patients')}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
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
            {user?.name?.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2) || 'DR'}
          </span>
        </div>
      </div>
    </header>
  );
}
