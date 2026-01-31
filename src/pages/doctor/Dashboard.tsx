import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Share2,
  Clock,
  Eye,
  TrendingUp,
  ArrowRight,
  Calendar,
  FileText,
} from 'lucide-react';
import { DoctorSidebar } from '@/components/layout/DoctorSidebar';
import { DoctorHeader } from '@/components/layout/DoctorHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import type { DoctorStats, SharedPatient, DoctorActivity } from '@/types/doctor';
import { format, formatDistanceToNow } from 'date-fns';

// Dummy data
const DUMMY_STATS: DoctorStats = {
  total_patients: 45,
  active_shares: 38,
  expired_shares: 7,
  new_shares_this_week: 5,
  new_shares_this_month: 12,
  reports_viewed_today: 8,
  reports_viewed_this_week: 32,
};

const DUMMY_RECENT_PATIENTS: SharedPatient[] = [
  {
    id: 's1',
    patient_id: 'p1',
    patient_name: 'Rahul Verma',
    patient_email: 'rahul@email.com',
    shared_content: ['timeline', 'lab_reports', 'prescriptions'],
    date_range: '6-months',
    expires_at: '2026-03-15',
    shared_at: '2026-01-15',
    is_active: true,
  },
  {
    id: 's2',
    patient_id: 'p2',
    patient_name: 'Anita Patel',
    patient_email: 'anita@email.com',
    shared_content: ['timeline', 'lab_reports', 'assessment'],
    date_range: '1-year',
    expires_at: '2026-06-20',
    shared_at: '2025-12-20',
    is_active: true,
  },
  {
    id: 's3',
    patient_id: 'p3',
    patient_name: 'Vikram Singh',
    patient_email: 'vikram@email.com',
    shared_content: ['lab_reports'],
    date_range: '3-months',
    expires_at: '2026-02-28',
    shared_at: '2026-01-28',
    is_active: true,
  },
];

const DUMMY_ACTIVITY: DoctorActivity[] = [
  {
    id: 'a1',
    type: 'new_share',
    patient_name: 'Rahul Verma',
    patient_id: 'p1',
    timestamp: '2026-01-30T09:30:00',
    description: 'Shared medical records with you',
  },
  {
    id: 'a2',
    type: 'view_report',
    patient_name: 'Anita Patel',
    patient_id: 'p2',
    report_id: 'r1',
    timestamp: '2026-01-30T08:15:00',
    description: 'You viewed lab report',
  },
  {
    id: 'a3',
    type: 'share_expired',
    patient_name: 'Suresh Reddy',
    patient_id: 'p4',
    timestamp: '2026-01-29T23:59:00',
    description: 'Share access expired',
  },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DoctorStats>(DUMMY_STATS);
  const [recentPatients, setRecentPatients] = useState<SharedPatient[]>(DUMMY_RECENT_PATIENTS);
  const [activity, setActivity] = useState<DoctorActivity[]>(DUMMY_ACTIVITY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const statCards = [
    {
      label: 'Total Patients',
      value: stats.total_patients,
      icon: Users,
      color: 'primary',
      href: '/doctor/patients',
    },
    {
      label: 'Active Shares',
      value: stats.active_shares,
      icon: Share2,
      color: 'success',
      subtitle: `+${stats.new_shares_this_week} this week`,
    },
    {
      label: 'Reports Viewed',
      value: stats.reports_viewed_this_week,
      icon: Eye,
      color: 'accent',
      subtitle: `${stats.reports_viewed_today} today`,
    },
    {
      label: 'Expired Shares',
      value: stats.expired_shares,
      icon: Clock,
      color: 'muted',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <DoctorSidebar />
      
      <div className="ml-64">
        <DoctorHeader />
        
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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Patients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Recent Patients
                </h3>
                <Link to="/doctor/patients">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/doctor/patients/${patient.patient_id}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {patient.patient_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{patient.patient_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.shared_content.length} categories shared
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Shared {formatDistanceToNow(new Date(patient.shared_at), { addSuffix: true })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires {format(new Date(patient.expires_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === 'new_share' 
                        ? 'bg-success/10' 
                        : item.type === 'view_report'
                        ? 'bg-accent/10'
                        : 'bg-muted'
                    }`}>
                      {item.type === 'new_share' ? (
                        <Share2 className="w-4 h-4 text-success" />
                      ) : item.type === 'view_report' ? (
                        <Eye className="w-4 h-4 text-accent" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{item.patient_name}</span>
                        {' '}{item.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
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
    accent: 'bg-accent/10 text-accent',
    muted: 'bg-muted text-muted-foreground',
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
