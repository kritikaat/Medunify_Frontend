import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  UserX,
  UserCheck,
  Mail,
  Phone,
} from 'lucide-react';
import { HospitalSidebar } from '@/components/layout/HospitalSidebar';
import { HospitalHeader } from '@/components/layout/HospitalHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { Doctor } from '@/types/hospital';
import { SPECIALIZATIONS } from '@/types/hospital';

// Dummy doctors data
const DUMMY_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    email: 'rajesh@cityhospital.com',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology)',
    license_number: 'MED12345',
    hospital_id: 'h1',
    experience_years: 15,
    phone: '+91 98765 43210',
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
    qualification: 'MBBS, DM (Endocrinology)',
    license_number: 'MED12346',
    hospital_id: 'h1',
    experience_years: 12,
    phone: '+91 98765 43211',
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
    qualification: 'MBBS, DM (Nephrology)',
    license_number: 'MED12347',
    hospital_id: 'h1',
    experience_years: 10,
    phone: '+91 98765 43212',
    is_active: true,
    is_verified: true,
    created_at: '2024-10-05',
    patients_count: 28,
  },
  {
    id: 'd4',
    email: 'neha@cityhospital.com',
    name: 'Dr. Neha Patel',
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics)',
    license_number: 'MED12348',
    hospital_id: 'h1',
    experience_years: 8,
    phone: '+91 98765 43213',
    is_active: false,
    is_verified: true,
    created_at: '2024-09-12',
    patients_count: 15,
  },
  {
    id: 'd5',
    email: 'suresh@cityhospital.com',
    name: 'Dr. Suresh Reddy',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Orthopedics)',
    license_number: 'MED12349',
    hospital_id: 'h1',
    experience_years: 20,
    phone: '+91 98765 43214',
    is_active: true,
    is_verified: true,
    created_at: '2024-05-01',
    patients_count: 52,
  },
];

export default function HospitalDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    const loadDoctors = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDoctors(DUMMY_DOCTORS);
      setFilteredDoctors(DUMMY_DOCTORS);
      setIsLoading(false);
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    let filtered = [...doctors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        d =>
          d.name.toLowerCase().includes(query) ||
          d.email.toLowerCase().includes(query) ||
          d.specialization.toLowerCase().includes(query)
      );
    }

    // Specialization filter
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(d => d.specialization === specializationFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(d => d.is_active === isActive);
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, specializationFilter, statusFilter, doctors]);

  const toggleDoctorStatus = (doctorId: string) => {
    setDoctors(prev =>
      prev.map(d =>
        d.id === doctorId ? { ...d, is_active: !d.is_active } : d
      )
    );
    toast.success('Doctor status updated');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <HospitalSidebar />
      
      <div className="ml-64">
        <HospitalHeader 
          title="Manage Doctors" 
          subtitle={`${doctors.length} doctors in your hospital`}
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
                  placeholder="Search by name, email, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Specialization Filter */}
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {SPECIALIZATIONS.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Add Doctor Button */}
              <Link to="/hospital/doctors/new">
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Doctors List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Doctor</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Specialization</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Patients</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor, index) => (
                    <motion.tr
                      key={doctor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doctor.name}</p>
                            <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">{doctor.specialization}</span>
                        <p className="text-xs text-muted-foreground">{doctor.experience_years} years exp.</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {doctor.email}
                          </span>
                          {doctor.phone && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {doctor.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-foreground">{doctor.patients_count}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          doctor.is_active
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {doctor.is_active ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/hospital/doctors/${doctor.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/hospital/doctors/${doctor.id}?edit=true`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleDoctorStatus(doctor.id)}>
                              {doctor.is_active ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No doctors found matching your criteria.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
