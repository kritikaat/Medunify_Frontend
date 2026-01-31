import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Share2,
  Search,
  Calendar,
  Eye,
  CheckCircle,
  Building2,
  Stethoscope,
  Filter,
  Users,
  Loader2,
  Briefcase,
  Mail,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { DoctorProfile, HospitalProfile, ShareableContent } from '@/types/share';
import { SHARE_CONTENT_OPTIONS, DATE_RANGE_OPTIONS, EXPIRY_OPTIONS } from '@/types/share';
import { SPECIALIZATIONS } from '@/types/hospital';
import { listDoctors, getSpecializations, getCities } from '@/lib/api/doctor-discovery';
import { shareWithDoctors } from '@/lib/api/patient-doctor-share';

// Dummy doctors data
const DUMMY_DOCTORS: DoctorProfile[] = [
  {
    id: 'd1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh@cityhospital.com',
    specialization: 'Cardiology',
    hospital_id: 'h1',
    hospital_name: 'City Hospital',
    qualification: 'MBBS, MD (Cardiology)',
    experience_years: 15,
    bio: 'Experienced cardiologist specializing in interventional cardiology and preventive heart care.',
    is_verified: true,
  },
  {
    id: 'd2',
    name: 'Dr. Priya Sharma',
    email: 'priya@cityhospital.com',
    specialization: 'Endocrinology',
    hospital_id: 'h1',
    hospital_name: 'City Hospital',
    qualification: 'MBBS, DM (Endocrinology)',
    experience_years: 12,
    bio: 'Specialist in diabetes management, thyroid disorders, and hormonal imbalances.',
    is_verified: true,
  },
  {
    id: 'd3',
    name: 'Dr. Amit Singh',
    email: 'amit@metrohealth.com',
    specialization: 'Nephrology',
    hospital_id: 'h2',
    hospital_name: 'Metro Health Center',
    qualification: 'MBBS, DM (Nephrology)',
    experience_years: 10,
    bio: 'Expert in kidney disease management and dialysis care.',
    is_verified: true,
  },
  {
    id: 'd4',
    name: 'Dr. Neha Patel',
    email: 'neha@universitymed.com',
    specialization: 'Pediatrics',
    hospital_id: 'h3',
    hospital_name: 'University Medical',
    qualification: 'MBBS, MD (Pediatrics)',
    experience_years: 8,
    bio: 'Pediatrician with special interest in child nutrition and developmental health.',
    is_verified: true,
  },
  {
    id: 'd5',
    name: 'Dr. Suresh Reddy',
    email: 'suresh@cityhospital.com',
    specialization: 'Orthopedics',
    hospital_id: 'h1',
    hospital_name: 'City Hospital',
    qualification: 'MBBS, MS (Orthopedics)',
    experience_years: 20,
    bio: 'Orthopedic surgeon specializing in joint replacement and sports medicine.',
    is_verified: true,
  },
  {
    id: 'd6',
    name: 'Dr. Kavita Menon',
    email: 'kavita@metrohealth.com',
    specialization: 'Dermatology',
    hospital_id: 'h2',
    hospital_name: 'Metro Health Center',
    qualification: 'MBBS, MD (Dermatology)',
    experience_years: 9,
    bio: 'Dermatologist specializing in skin conditions, cosmetic procedures, and laser treatments.',
    is_verified: true,
  },
  {
    id: 'd7',
    name: 'Dr. Vikram Joshi',
    email: 'vikram@universitymed.com',
    specialization: 'Neurology',
    hospital_id: 'h3',
    hospital_name: 'University Medical',
    qualification: 'MBBS, DM (Neurology)',
    experience_years: 14,
    bio: 'Neurologist with expertise in stroke management, epilepsy, and movement disorders.',
    is_verified: true,
  },
  {
    id: 'd8',
    name: 'Dr. Anjali Gupta',
    email: 'anjali@cityhospital.com',
    specialization: 'Gastroenterology',
    hospital_id: 'h1',
    hospital_name: 'City Hospital',
    qualification: 'MBBS, DM (Gastroenterology)',
    experience_years: 11,
    bio: 'GI specialist with focus on liver diseases, endoscopy, and digestive health.',
    is_verified: true,
  },
];

// Dummy hospitals data
const DUMMY_HOSPITALS: HospitalProfile[] = [
  { id: 'h1', name: 'City Hospital', city: 'Mumbai', doctors_count: 4 },
  { id: 'h2', name: 'Metro Health Center', city: 'Delhi', doctors_count: 2 },
  { id: 'h3', name: 'University Medical', city: 'Bangalore', doctors_count: 2 },
];

export default function Doctors() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(DUMMY_DOCTORS);
  const [hospitals, setHospitals] = useState<HospitalProfile[]>(DUMMY_HOSPITALS);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorProfile[]>(DUMMY_DOCTORS);
  const [isLoading, setIsLoading] = useState(true);
  const [usingDummyData, setUsingDummyData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [hospitalFilter, setHospitalFilter] = useState<string>('all');

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [shareConfig, setShareConfig] = useState<{
    content: ShareableContent[];
    dateRange: string;
    expiresInDays: number;
  }>({
    content: ['timeline', 'lab_reports'],
    dateRange: '6-months',
    expiresInDays: 30,
  });
  const [isSharing, setIsSharing] = useState(false);

  // Doctor profile modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState<DoctorProfile | null>(null);

  // Fetch doctors from API
  useEffect(() => {
    fetchDoctors();
    fetchFilters();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    setUsingDummyData(false);

    try {
      const response = await listDoctors({
        query: searchQuery || undefined,
        specialization: specializationFilter !== 'all' ? specializationFilter : undefined,
        page: 1,
        per_page: 100,
      });

      // Transform API response to match our DoctorProfile type
      const transformedDoctors: DoctorProfile[] = response.doctors.map(d => ({
        id: d.id,
        name: d.name,
        email: '', // API doesn't expose email publicly
        specialization: d.specialization,
        hospital_id: '', // Not in public API
        hospital_name: d.hospital_name,
        qualification: d.qualifications?.join(', ') || '',
        experience_years: d.experience_years,
        bio: d.bio || '',
        is_verified: d.is_verified,
        profile_photo_url: d.profile_photo_url,
      }));

      setDoctors(transformedDoctors);
      setFilteredDoctors(transformedDoctors);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctors';
      console.error('❌ Doctors API Error:', { message: errorMessage, fullError: err });
      
      toast.error(`Doctors API Error: ${errorMessage}`, {
        description: 'Using demo data. Check console for details.',
        duration: 5000,
      });

      setDoctors(DUMMY_DOCTORS);
      setFilteredDoctors(DUMMY_DOCTORS);
      setUsingDummyData(true);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [specsResponse, citiesResponse] = await Promise.all([
        getSpecializations(),
        getCities(),
      ]);
      setSpecializations(specsResponse);
      setCities(citiesResponse);
    } catch (err) {
      console.error('❌ Filters API Error:', err);
      // Use default specializations from hospital types
      setSpecializations(SPECIALIZATIONS);
    }
  };

  // Filter doctors locally
  useEffect(() => {
    let filtered = [...doctors];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        d =>
          d.name.toLowerCase().includes(query) ||
          d.specialization.toLowerCase().includes(query) ||
          d.hospital_name.toLowerCase().includes(query) ||
          (d.email && d.email.toLowerCase().includes(query))
      );
    }

    // Specialization filter
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(d => d.specialization === specializationFilter);
    }

    // Hospital filter
    if (hospitalFilter !== 'all') {
      filtered = filtered.filter(d => d.hospital_id === hospitalFilter);
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, specializationFilter, hospitalFilter, doctors]);

  const handleOpenShareModal = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor);
    setShareConfig({
      content: ['timeline', 'lab_reports'],
      dateRange: '6-months',
      expiresInDays: 30,
    });
    setShareModalOpen(true);
  };

  const handleViewProfile = (doctor: DoctorProfile) => {
    setViewingDoctor(doctor);
    setProfileModalOpen(true);
  };

  const toggleShareContent = (contentId: ShareableContent) => {
    setShareConfig(prev => ({
      ...prev,
      content: prev.content.includes(contentId)
        ? prev.content.filter(c => c !== contentId)
        : [...prev.content, contentId],
    }));
  };

  const handleShare = async () => {
    if (!selectedDoctor) return;
    if (shareConfig.content.length === 0) {
      toast.error('Please select at least one content type to share');
      return;
    }

    setIsSharing(true);
    try {
      // Calculate date range
      const dateRangeMap: Record<string, number> = {
        '3-months': 3,
        '6-months': 6,
        '1-year': 12,
        'all': 60,
      };
      const monthsAgo = dateRangeMap[shareConfig.dateRange] || 6;
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - monthsAgo);

      // Try real API
      await shareWithDoctors({
        doctor_ids: [selectedDoctor.id],
        config: {
          include_profile: true,
          include_reports: shareConfig.content.includes('lab_reports') || shareConfig.content.includes('imaging_reports'),
          include_timeline: shareConfig.content.includes('timeline'),
          include_assessments: shareConfig.content.includes('assessments'),
          include_prescriptions: shareConfig.content.includes('prescriptions'),
          report_types: shareConfig.content.filter(c => ['lab_reports', 'imaging_reports', 'prescriptions'].includes(c)),
          date_range_start: dateFrom.toISOString().split('T')[0],
          date_range_end: new Date().toISOString().split('T')[0],
          permissions: ['view'],
        },
        expires_in_days: shareConfig.expiresInDays,
      });
      
      toast.success(`Shared successfully with ${selectedDoctor.name}`);
      setShareModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share';
      console.error('❌ Share API Error:', error);
      
      // If using dummy data, simulate success
      if (usingDummyData) {
        toast.success(`Shared successfully with ${selectedDoctor.name} (Demo)`);
        setShareModalOpen(false);
      } else {
        toast.error(`Failed to share: ${errorMessage}`);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Get unique specializations from doctors
  const availableSpecializations = [...new Set(doctors.map(d => d.specialization))];

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Browse Doctors
                  </h1>
                  <p className="text-muted-foreground">
                    Find and share your health records with verified healthcare providers
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDoctors}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </motion.div>

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
                    <h4 className="font-medium text-foreground mb-1">Doctors API Connection Failed</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Error:</strong> {error}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Showing demo doctors. Check browser console (F12) for details.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchDoctors}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
                    {availableSpecializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Hospital Filter */}
                <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hospitals</SelectItem>
                    {hospitals.map(hospital => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Results Count */}
            <div className="mb-4 flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </p>
              {usingDummyData && (
                <Badge variant="outline" className="text-xs">Demo Data</Badge>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading doctors...</p>
                </div>
              </div>
            )}

            {/* Doctors Grid */}
            {!isLoading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Doctor Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">{doctor.name}</h3>
                        {doctor.is_verified && (
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-primary">{doctor.specialization}</p>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{doctor.hospital_name}</span>
                    </div>
                    {doctor.qualification && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Stethoscope className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{doctor.qualification}</span>
                      </div>
                    )}
                    {doctor.experience_years && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        <span>{doctor.experience_years} years experience</span>
                      </div>
                    )}
                  </div>

                  {/* Bio Preview */}
                  {doctor.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {doctor.bio}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleOpenShareModal(doctor)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleViewProfile(doctor)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              </div>
            )}

            {filteredDoctors.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No doctors found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share with {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>
              {selectedDoctor?.specialization} • {selectedDoctor?.hospital_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Content Selection */}
            <div className="space-y-3">
              <Label className="text-base">Select What to Share</Label>
              <div className="grid grid-cols-2 gap-2">
                {SHARE_CONTENT_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      shareConfig.content.includes(option.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={shareConfig.content.includes(option.id)}
                      onCheckedChange={() => toggleShareContent(option.id)}
                    />
                    <span className="text-sm font-medium text-foreground">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Data Range</Label>
              <Select
                value={shareConfig.dateRange}
                onValueChange={(value) => setShareConfig(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expiry */}
            <div className="space-y-2">
              <Label>Access Expires In</Label>
              <Select
                value={shareConfig.expiresInDays.toString()}
                onValueChange={(value) => setShareConfig(prev => ({ ...prev, expiresInDays: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShareModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={isSharing}>
              {isSharing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Now
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Doctor Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Doctor Profile</DialogTitle>
          </DialogHeader>

          {viewingDoctor && (
            <div className="py-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {viewingDoctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
                  {viewingDoctor.name}
                  {viewingDoctor.is_verified && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                </h3>
                <p className="text-primary">{viewingDoctor.specialization}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{viewingDoctor.hospital_name}</p>
                    <p className="text-xs text-muted-foreground">Hospital</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{viewingDoctor.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>

                {viewingDoctor.qualification && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{viewingDoctor.qualification}</p>
                      <p className="text-xs text-muted-foreground">Qualification</p>
                    </div>
                  </div>
                )}

                {viewingDoctor.experience_years && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{viewingDoctor.experience_years} years</p>
                      <p className="text-xs text-muted-foreground">Experience</p>
                    </div>
                  </div>
                )}

                {viewingDoctor.bio && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">About</p>
                    <p className="text-sm text-foreground">{viewingDoctor.bio}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setProfileModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setProfileModalOpen(false);
                  handleOpenShareModal(viewingDoctor);
                }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Records
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
