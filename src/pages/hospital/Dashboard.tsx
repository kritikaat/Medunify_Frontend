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
} from 'lucide-react';
import { HospitalSidebar } from '@/components/layout/HospitalSidebar';
import { HospitalHeader } from '@/components/layout/HospitalHeader';
import { Button } from '@/components/ui/button';
import type { HospitalStats, Doctor } from '@/types/hospital';

// Dummy data for hospital dashboard
const DUMMY_STATS: HospitalStats = {
  total_doctors: 12,
  active_doctors: 10,
  inactive_doctors: 2,
  total_patient_shares: 156,
  this_month_shares: 23,
  this_week_shares: 8,
};

const DUMMY_RECENT_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    email: 'rajesh@cityhospital.com',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiology',
    license_number: 'MED12345',
    hospital_id: 'h1',
    is_active: true,
    is_verified: true,
    created_at: '2024-06-15',
    patients_count: 45,
  },
  {
    id: 'd2',
    email: 'priya@cityhospital.com',
    name: 'Dr. Priya Sharma',
    specialization: 'Endocrinology',
    license_number: 'MED12346',
    hospital_id: 'h1',
    is_active: true,
    is_verified: true,
    created_at: '2024-08-20',
    patients_count: 32,
  },
  {
    id: 'd3',
    email: 'amit@cityhospital.com',
    name: 'Dr. Amit Singh',
    specialization: 'Nephrology',
    license_number: 'MED12347',
    hospital_id: 'h1',
    is_active: true,
    is_verified: true,
    created_at: '2024-10-05',
    patients_count: 28,
  },
];

export default function HospitalDashboard() {
  const [stats, setStats] = useState<HospitalStats>(DUMMY_STATS);
  const [recentDoctors, setRecentDoctors] = useState<Doctor[]>(DUMMY_RECENT_DOCTORS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(DUMMY_STATS);
      setRecentDoctors(DUMMY_RECENT_DOCTORS);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const statCards = [
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
  ];

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
