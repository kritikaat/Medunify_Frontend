import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  Clock,
  Share2,
  Calendar,
  Mail,
} from 'lucide-react';
import { DoctorSidebar } from '@/components/layout/DoctorSidebar';
import { DoctorHeader } from '@/components/layout/DoctorHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SharedPatient } from '@/types/doctor';
import { format, formatDistanceToNow, isPast } from 'date-fns';

// Dummy patients data
const DUMMY_PATIENTS: SharedPatient[] = [
  {
    id: 's1',
    patient_id: 'p1',
    patient_name: 'Rahul Verma',
    patient_email: 'rahul@email.com',
    patient_age: 45,
    patient_gender: 'Male',
    shared_content: ['timeline', 'lab_reports', 'prescriptions'],
    date_range: '6-months',
    expires_at: '2026-03-15',
    shared_at: '2026-01-15',
    last_accessed: '2026-01-30',
    is_active: true,
  },
  {
    id: 's2',
    patient_id: 'p2',
    patient_name: 'Anita Patel',
    patient_email: 'anita@email.com',
    patient_age: 38,
    patient_gender: 'Female',
    shared_content: ['timeline', 'lab_reports', 'assessment'],
    date_range: '1-year',
    expires_at: '2026-06-20',
    shared_at: '2025-12-20',
    last_accessed: '2026-01-28',
    is_active: true,
  },
  {
    id: 's3',
    patient_id: 'p3',
    patient_name: 'Vikram Singh',
    patient_email: 'vikram@email.com',
    patient_age: 52,
    patient_gender: 'Male',
    shared_content: ['lab_reports'],
    date_range: '3-months',
    expires_at: '2026-02-28',
    shared_at: '2026-01-28',
    is_active: true,
  },
  {
    id: 's4',
    patient_id: 'p4',
    patient_name: 'Priya Sharma',
    patient_email: 'priya.s@email.com',
    patient_age: 29,
    patient_gender: 'Female',
    shared_content: ['timeline', 'lab_reports', 'prescriptions', 'radiology'],
    date_range: 'all',
    expires_at: '2026-04-10',
    shared_at: '2026-01-10',
    last_accessed: '2026-01-25',
    is_active: true,
  },
  {
    id: 's5',
    patient_id: 'p5',
    patient_name: 'Suresh Reddy',
    patient_email: 'suresh@email.com',
    patient_age: 60,
    patient_gender: 'Male',
    shared_content: ['lab_reports', 'prescriptions'],
    date_range: '6-months',
    expires_at: '2026-01-15',
    shared_at: '2025-10-15',
    is_active: false,
  },
];

export default function DoctorPatients() {
  const [patients, setPatients] = useState<SharedPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<SharedPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    const loadPatients = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPatients(DUMMY_PATIENTS);
      setFilteredPatients(DUMMY_PATIENTS);
      setIsLoading(false);
    };
    loadPatients();
  }, []);

  useEffect(() => {
    let filtered = [...patients];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.patient_name.toLowerCase().includes(query) ||
          p.patient_email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(p => p.is_active === isActive);
    }

    setFilteredPatients(filtered);
  }, [searchQuery, statusFilter, patients]);

  const getSharedContentLabel = (content: string[]) => {
    if (content.length === 0) return 'No data';
    if (content.length === 1) return content[0].replace('_', ' ');
    return `${content.length} categories`;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DoctorSidebar />
      
      <div className="ml-64">
        <DoctorHeader 
          title="My Patients" 
          subtitle={`${patients.filter(p => p.is_active).length} patients with active shares`}
        />
        
        <main className="p-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-6 mb-6"
          >
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="active">Active Shares</SelectItem>
                  <SelectItem value="expired">Expired Shares</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Patients Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/doctor/patients/${patient.patient_id}`}
                  className="block bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {patient.patient_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{patient.patient_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.patient_age && patient.patient_gender 
                            ? `${patient.patient_age}y, ${patient.patient_gender}`
                            : patient.patient_email
                          }
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.is_active
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {patient.is_active ? 'Active' : 'Expired'}
                    </span>
                  </div>

                  {/* Shared Content */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Share2 className="w-4 h-4" />
                      <span>Shared Data:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {patient.shared_content.slice(0, 3).map(content => (
                        <span 
                          key={content}
                          className="px-2 py-0.5 bg-muted rounded text-xs text-foreground capitalize"
                        >
                          {content.replace('_', ' ')}
                        </span>
                      ))}
                      {patient.shared_content.length > 3 && (
                        <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                          +{patient.shared_content.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Shared
                      </span>
                      <span>{format(new Date(patient.shared_at), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {patient.is_active ? 'Expires' : 'Expired'}
                      </span>
                      <span className={
                        !patient.is_active 
                          ? 'text-gray-500'
                          : isPast(new Date(patient.expires_at))
                          ? 'text-red-500'
                          : 'text-foreground'
                      }>
                        {format(new Date(patient.expires_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* View Button */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button variant="outline" className="w-full" disabled={!patient.is_active}>
                      <Eye className="w-4 h-4 mr-2" />
                      {patient.is_active ? 'View Reports' : 'Access Expired'}
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No patients found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
