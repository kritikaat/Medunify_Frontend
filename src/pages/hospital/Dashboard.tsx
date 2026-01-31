import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  Share2,
  TrendingUp,
  Plus,
  ArrowRight,
  Building2,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { HospitalSidebar } from '@/components/layout/HospitalSidebar';
import { HospitalHeader } from '@/components/layout/HospitalHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { HospitalStats, Doctor } from '@/types/hospital';
import { getHospitalStats, listHospitalDoctors } from '@/lib/api/hospital';

export default function HospitalDashboard() {
  const [stats, setStats] = useState<HospitalStats | null>(null);
  const [recentDoctors, setRecentDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 [Hospital Dashboard] Fetching dashboard data...');
      
      // Fetch stats and doctors from API
      const [statsResponse, doctorsResponse] = await Promise.all([
        getHospitalStats(),
        listHospitalDoctors({ limit: 5 }),
      ]);
      
      console.log('✅ [Hospital Dashboard] Data fetched successfully:', {
        stats: statsResponse,
        doctorsCount: doctorsResponse.doctors.length,
      });
      
      setStats(statsResponse);
      
      // Transform doctors to match our type
      const transformedDoctors: Doctor[] = doctorsResponse.doctors.map(d => ({
        id: d.id,
        email: d.email,
        name: d.name,
        specialization: d.specialization,
        license_number: d.license_number,
        qualification: d.qualification,
        experience_years: d.experience_years,
        phone: d.phone,
        hospital_id: '', // Will be from context
        is_active: d.is_active,
        is_verified: d.is_verified,
        created_at: d.created_at,
        patients_count: d.patients_count,
      }));
      
      setRecentDoctors(transformedDoctors.slice(0, 3));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      const errorDetails = {
        timestamp: new Date().toISOString(),
        endpoint: '/hospital/stats and /hospital/doctors',
        method: 'GET',
        error: errorMessage,
        statusCode: (err as any)?.status || 'unknown',
        fullError: err,
      };
      
      console.error('❌ Hospital Dashboard API Error:', errorDetails);
      
      toast.error('Failed to load hospital dashboard', {
        description: `Error: ${errorMessage}. Please check your connection and try again.`,
        duration: 8000,
      });

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = stats ? [
    {
      label: 'Total Doctors',
      value: stats.total_doctors,
      icon: Users,
      color: 'primary',
      href: '/hospital/doctors',
    },
    {
      label: 'Active Doctors',
      value: stats.active_doctors,
      icon: UserCheck,
      color: 'success',
    },
    {
      label: 'Inactive Doctors',
      value: stats.inactive_doctors,
      icon: UserX,
      color: 'muted',
    },
    {
      label: 'Patient Shares',
      value: stats.total_patient_shares,
      icon: Share2,
      color: 'accent',
      subtitle: `+${stats.this_week_shares} this week`,
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <HospitalSidebar />
        <div className="ml-64">
          <HospitalHeader />
          <main className="p-6 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <HospitalSidebar />
        <div className="ml-64">
          <HospitalHeader />
          <main className="p-6">
            <div className="bg-destructive/10 border border-destructive rounded-2xl p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                Failed to Load Dashboard
              </h2>
              <p className="text-muted-foreground mb-4">
                {error}
              </p>
              <Button onClick={fetchDashboardData} variant="hero">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <HospitalSidebar />
      
      <div className="ml-64">
        <HospitalHeader />
        
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {stat.href ? (
                  <Link to={stat.href}>
                    <StatCard {...stat} />
                  </Link>
                ) : (
                  <StatCard {...stat} />
                )}
              </motion.div>
            ))}
          </div>

          {/* Quick Actions & Recent Doctors */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/hospital/doctors/new">
                  <Button variant="hero" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Doctor
                  </Button>
                </Link>
                <Link to="/hospital/doctors">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    View All Doctors
                  </Button>
                </Link>
                <Link to="/hospital/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    Hospital Settings
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Recent Doctors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Recent Doctors
                </h3>
                <Link to="/hospital/doctors">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentDoctors.map((doctor) => (
                  <Link
                    key={doctor.id}
                    to={`/hospital/doctors/${doctor.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{doctor.patients_count}</p>
                      <p className="text-xs text-muted-foreground">patients</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doctor.is_active 
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {doctor.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  subtitle 
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType; 
  color: string;
  subtitle?: string;
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    muted: 'bg-muted text-muted-foreground',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {subtitle && (
            <p className="text-xs text-success mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
