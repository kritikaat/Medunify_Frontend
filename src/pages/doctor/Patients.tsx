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
  RefreshCw,
  AlertTriangle,
  Loader2,
  Users,
} from 'lucide-react';
import { DoctorSidebar } from '@/components/layout/DoctorSidebar';
import { DoctorHeader } from '@/components/layout/DoctorHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { listSharedPatients } from '@/lib/api/doctor-patient-view';

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
  const { user } = useAuth();
  const [patients, setPatients] = useState<SharedPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<SharedPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingDummyData, setUsingDummyData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    setUsingDummyData(false);

    try {
      // JWT authenticated - no doctor_id needed
      const response = await listSharedPatients({
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
      });
      
      // Transform API response to match our SharedPatient type
      const transformedPatients: SharedPatient[] = response.patients.map(p => ({
        id: p.share_id,
        patient_id: p.patient_id,
        patient_name: p.patient_name,
        patient_email: p.patient_email || '',
        patient_age: p.patient_age,
        patient_gender: p.patient_gender,
        shared_content: p.shared_content || [],
        date_range: p.date_range || 'custom',
        expires_at: p.expires_at,
        shared_at: p.shared_at,
        last_accessed: p.last_accessed || undefined,
        is_active: p.is_active,
      }));

      setPatients(transformedPatients);
      setFilteredPatients(transformedPatients);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load patients';
      console.error('❌ Patients API Error:', { message: errorMessage, fullError: err });
      
      toast.error(`Patients API Error: ${errorMessage}`, {
        description: 'Using demo data. Check console for details.',
        duration: 5000,
      });

      setPatients(DUMMY_PATIENTS);
      setFilteredPatients(DUMMY_PATIENTS);
      setUsingDummyData(true);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Header with Refresh */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPatients.length} of {patients.length} patients
              </p>
              {usingDummyData && (
                <Badge variant="outline" className="text-xs">Demo Data</Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPatients}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* API Error Banner */}
          {usingDummyData && error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">Patients API Connection Failed</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Error:</strong> {error}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Showing demo patients. Check browser console (F12) for details.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchPatients}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading patients...</p>
              </div>
            </div>
          )}

          {!isLoading && (
            <>
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
          {filteredPatients.length > 0 ? (
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
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-12"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <Users className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {patients.length === 0 ? 'No Patients Available' : 'No Patients Found'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {patients.length === 0 
                    ? 'You don\'t have any patients yet. Patients can share their medical records with you from their dashboard.'
                    : searchQuery || statusFilter !== 'all'
                    ? 'No patients match your search criteria. Try adjusting your filters.'
                    : 'No patients found matching your criteria.'
                  }
                </p>
                {(searchQuery || statusFilter !== 'all') && patients.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
          </>
          )}
        </main>
      </div>
    </div>
  );
}
