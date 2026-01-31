import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Share2,
  Search,
  Calendar,
  Eye,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle,
  Building2,
  Stethoscope,
  X,
  Clock,
  Users,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { DoctorProfile, ActiveShare, ShareableContent } from '@/types/share';
import { SHARE_CONTENT_OPTIONS, DATE_RANGE_OPTIONS, EXPIRY_OPTIONS } from '@/types/share';
import { listDoctorShares, shareWithDoctors, revokeDoctorShare, updateDoctorShare, getDoctorShareDetails } from '@/lib/api/patient-doctor-share';
import { listDoctors } from '@/lib/api/doctor-discovery';

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
];

// Dummy active shares
const DUMMY_ACTIVE_SHARES: ActiveShare[] = [
  {
    id: 's1',
    patient_id: 'p1',
    doctor_id: 'd1',
    doctor_name: 'Dr. Rajesh Kumar',
    doctor_email: 'rajesh@cityhospital.com',
    hospital_name: 'City Hospital',
    specialization: 'Cardiology',
    shared_content: ['timeline', 'lab_reports', 'prescriptions'],
    date_range: '6-months',
    expires_at: '2026-03-30',
    created_at: '2026-01-30',
    access_count: 12,
    is_active: true,
  },
  {
    id: 's2',
    patient_id: 'p1',
    doctor_id: 'd2',
    doctor_name: 'Dr. Priya Sharma',
    doctor_email: 'priya@cityhospital.com',
    hospital_name: 'City Hospital',
    specialization: 'Endocrinology',
    shared_content: ['lab_reports', 'assessment'],
    date_range: '1-year',
    expires_at: '2026-06-20',
    created_at: '2025-12-20',
    access_count: 8,
    is_active: true,
  },
];

export default function Share() {
  const [activeShares, setActiveShares] = useState<ActiveShare[]>(DUMMY_ACTIVE_SHARES);
  const [doctors, setDoctors] = useState<DoctorProfile[]>(DUMMY_DOCTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorProfile[]>(DUMMY_DOCTORS);
  const [isLoading, setIsLoading] = useState(true);
  const [usingDummyData, setUsingDummyData] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Edit share modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingShare, setEditingShare] = useState<ActiveShare | null>(null);

  // Revoke confirmation dialog state
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [shareToRevoke, setShareToRevoke] = useState<{ id: string; doctorName: string } | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setUsingDummyData(false);

    try {
      // Fetch active shares and doctors in parallel
      const [sharesResponse, doctorsResponse] = await Promise.all([
        listDoctorShares({}),
        listDoctors({ page: 1, per_page: 50 }),
      ]);

      // Transform shares
      const transformedShares: ActiveShare[] = sharesResponse.shares.map(s => ({
        id: s.id,
        patient_id: '', // Current user
        doctor_id: s.doctor.id,
        doctor_name: s.doctor.name,
        doctor_email: '', // Not exposed
        hospital_name: s.doctor.hospital_name,
        specialization: s.doctor.specialization,
        shared_content: [
          'profile', // Always included - doctors need basic profile
          s.config.include_timeline ? 'timeline' : '',
          s.config.include_reports ? 'lab_reports' : '',
          s.config.include_assessments ? 'assessment' : '',
          s.config.include_prescriptions ? 'prescriptions' : '',
        ].filter(Boolean) as ShareableContent[],
        date_range: 'custom',
        expires_at: s.expires_at,
        created_at: s.created_at,
        access_count: s.access_count,
        is_active: s.is_active && !s.is_expired,
      }));

      // Transform doctors
      const transformedDoctors: DoctorProfile[] = doctorsResponse.doctors.map(d => ({
        id: d.id,
        name: d.name,
        email: '', // Not exposed
        specialization: d.specialization,
        hospital_id: '',
        hospital_name: d.hospital_name,
        qualification: d.qualifications?.join(', ') || '',
        experience_years: d.experience_years,
        bio: d.bio || '',
        is_verified: d.is_verified,
      }));

      setActiveShares(transformedShares);
      setDoctors(transformedDoctors);
      setFilteredDoctors(transformedDoctors);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      console.error('❌ Share Page API Error:', { message: errorMessage, fullError: err });
      
      toast.error(`Share API Error: ${errorMessage}`, {
        description: 'Using demo data. Check console for details.',
        duration: 5000,
      });

      setActiveShares(DUMMY_ACTIVE_SHARES);
      setDoctors(DUMMY_DOCTORS);
      setFilteredDoctors(DUMMY_DOCTORS);
      setUsingDummyData(true);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter doctors based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = doctors.filter(
      d =>
        d.name.toLowerCase().includes(query) ||
        d.specialization.toLowerCase().includes(query) ||
        d.hospital_name.toLowerCase().includes(query) ||
        (d.email && d.email.toLowerCase().includes(query))
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  const handleOpenShareModal = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor);
    setShareConfig({
      content: ['profile', 'timeline', 'lab_reports'], // Always include profile by default
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
      // Map UI content options to API config
      // NOTE: Always include profile - it's required for doctors to view patient data
      const apiConfig: any = {
        include_profile: true, // Always true - doctors need basic profile info
        include_reports: shareConfig.content.includes('lab_reports') || shareConfig.content.includes('radiology'),
        include_timeline: shareConfig.content.includes('timeline'),
        include_assessments: shareConfig.content.includes('assessment'),
        include_prescriptions: shareConfig.content.includes('prescriptions'),
        permissions: ['view', 'download'] as any[],
      };

      console.log('📤 [Share] Sending share request:', {
        doctor: selectedDoctor.name,
        doctor_id: selectedDoctor.id,
        config: apiConfig,
        expires_in_days: shareConfig.expiresInDays,
      });

      // Call the real API
      const shares = await shareWithDoctors({
        doctor_ids: [selectedDoctor.id],
        config: apiConfig,
        expires_in_days: shareConfig.expiresInDays,
      });

      console.log('✅ [Share] API Response:', {
        shares_created: shares.length,
        first_share: shares[0] ? {
          id: shares[0].id,
          include_profile: shares[0].config.include_profile,
          is_active: shares[0].is_active,
        } : null,
      });

      // Transform and add to state
      const newShares: ActiveShare[] = shares.map(s => ({
        id: s.id,
        patient_id: '', // Current user
        doctor_id: s.doctor.id,
        doctor_name: s.doctor.name,
        doctor_email: '', // Not exposed
        hospital_name: s.doctor.hospital_name,
        specialization: s.doctor.specialization,
        shared_content: [
          'profile', // Always included
          s.config.include_timeline ? 'timeline' : '',
          s.config.include_reports ? 'lab_reports' : '',
          s.config.include_assessments ? 'assessment' : '',
          s.config.include_prescriptions ? 'prescriptions' : '',
        ].filter(Boolean) as any[],
        date_range: 'custom',
        expires_at: s.expires_at,
        created_at: s.created_at,
        access_count: s.access_count,
        is_active: s.is_active && !s.is_expired,
      }));

      // Update state - replace if exists, add if new
      const existingIndex = activeShares.findIndex(s => s.doctor_id === selectedDoctor.id);
      if (existingIndex >= 0) {
        setActiveShares(prev => [
          ...prev.slice(0, existingIndex),
          newShares[0],
          ...prev.slice(existingIndex + 1),
        ]);
        toast.success(`Share updated with ${selectedDoctor.name}`, {
          description: 'Access has been renewed and updated.',
        });
      } else {
        setActiveShares(prev => [newShares[0], ...prev]);
        toast.success(`Shared successfully with ${selectedDoctor.name}`, {
          description: 'They can now access your medical records.',
        });
      }

      setShareModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share';
      console.error('❌ Share Error:', { message: errorMessage, fullError: error });
      
      toast.error('Failed to share', {
        description: errorMessage,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const openRevokeDialog = (shareId: string, doctorName: string) => {
    setShareToRevoke({ id: shareId, doctorName });
    setRevokeDialogOpen(true);
  };

  const handleConfirmRevoke = async () => {
    if (!shareToRevoke) return;

    setIsRevoking(true);
    try {
      // Call API to revoke the share
      await revokeDoctorShare(shareToRevoke.id);
      
      // Remove from local state
      setActiveShares(prev => prev.filter(s => s.id !== shareToRevoke.id));
      
      toast.success(`Access revoked for ${shareToRevoke.doctorName}`, {
        description: 'The doctor can no longer view your medical records.',
      });
      
      setRevokeDialogOpen(false);
      setShareToRevoke(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to revoke access';
      console.error('❌ Revoke Share Error:', { message: errorMessage, fullError: error });
      
      toast.error('Failed to revoke access', {
        description: errorMessage,
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const debugShareDetails = async (shareId: string, doctorName: string) => {
    try {
      const shareDetails = await getDoctorShareDetails(shareId);
      console.log('🔍 [DEBUG] Share Details for', doctorName, ':', {
        shareId,
        include_profile: shareDetails.config.include_profile,
        include_reports: shareDetails.config.include_reports,
        include_timeline: shareDetails.config.include_timeline,
        include_assessments: shareDetails.config.include_assessments,
        is_active: shareDetails.is_active,
        is_expired: shareDetails.is_expired,
        expires_at: shareDetails.expires_at,
        fullConfig: shareDetails.config,
      });
      
      const profileStatus = shareDetails.config.include_profile ? '✅ ENABLED' : '❌ DISABLED';
      toast.info(`Profile Access: ${profileStatus}`, {
        description: `Check browser console for full details`,
        duration: 5000,
      });
    } catch (error) {
      console.error('❌ Failed to get share details:', error);
      toast.error('Failed to load share details');
    }
  };

  const handleEditShare = (share: ActiveShare) => {
    setEditingShare(share);
    // Ensure profile is always included in the content
    const content = share.shared_content as ShareableContent[];
    if (!content.includes('profile')) {
      content.unshift('profile');
    }
    setShareConfig({
      content,
      dateRange: share.date_range,
      expiresInDays: 30,
    });
    setEditModalOpen(true);
  };

  const handleUpdateShare = async () => {
    if (!editingShare) return;
    
    setIsSharing(true);
    try {
      // Map UI content options to API config
      // NOTE: Always include profile - it's required for doctors to view patient data
      const apiConfig: any = {
        include_profile: true, // Always true - doctors need basic profile info
        include_reports: shareConfig.content.includes('lab_reports') || shareConfig.content.includes('radiology'),
        include_timeline: shareConfig.content.includes('timeline'),
        include_assessments: shareConfig.content.includes('assessment'),
        include_prescriptions: shareConfig.content.includes('prescriptions'),
        permissions: ['view', 'download'] as any[],
      };

      // Call the real API to update the share
      const updatedShare = await updateDoctorShare(editingShare.id, {
        config: apiConfig,
        expires_in_days: shareConfig.expiresInDays,
      });
      
      // Update local state with API response
      setActiveShares(prev =>
        prev.map(s =>
          s.id === editingShare.id
            ? {
                ...s,
                shared_content: [
                  updatedShare.config.include_timeline ? 'timeline' : '',
                  updatedShare.config.include_reports ? 'lab_reports' : '',
                  updatedShare.config.include_assessments ? 'assessment' : '',
                  updatedShare.config.include_prescriptions ? 'prescriptions' : '',
                  'profile', // Always include profile in display
                ].filter(Boolean) as any[],
                date_range: shareConfig.dateRange as any,
                expires_at: updatedShare.expires_at,
                is_active: updatedShare.is_active && !updatedShare.is_expired,
              }
            : s
        )
      );
      
      toast.success('Share updated successfully', {
        description: 'Access permissions have been updated.',
      });
      setEditModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update share';
      console.error('❌ Update Share Error:', { message: errorMessage, fullError: error });
      
      toast.error('Failed to update share', {
        description: errorMessage,
      });
    } finally {
      setIsSharing(false);
    }
  };

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
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                Share Your Health Profile
              </h1>
              <p className="text-muted-foreground">
                Share your medical records securely with doctors
              </p>
            </motion.div>

            {/* Active Shares */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Active Shares ({activeShares.length})
                </h3>
              </div>
              
              {activeShares.length > 0 ? (
                <div className="space-y-4">
                  {activeShares.map((share) => (
                    <div
                      key={share.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{share.doctor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {share.specialization} • {share.hospital_name}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {share.shared_content.slice(0, 3).map(content => (
                            <span
                              key={content}
                              className="px-2 py-0.5 bg-muted rounded text-xs text-foreground capitalize"
                            >
                              {content.replace('_', ' ')}
                            </span>
                          ))}
                          {share.shared_content.length > 3 && (
                            <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                              +{share.shared_content.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          Expires {format(new Date(share.expires_at), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {share.access_count} views
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => debugShareDetails(share.id, share.doctor_name)}
                          title="Debug share configuration"
                        >
                          <AlertCircle className="w-4 h-4 text-info" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditShare(share)}
                          title="Edit share settings"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-error hover:text-error"
                          onClick={() => openRevokeDialog(share.id, share.doctor_name)}
                          title={`Revoke access for ${share.doctor_name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Share2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No active shares. Search for doctors below to share your records.</p>
                </div>
              )}
            </motion.div>

            {/* Browse Doctors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Browse Doctors
                </h3>
                <Link to="/doctors">
                  <Button variant="outline" size="sm">
                    View All Doctors
                  </Button>
                </Link>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors by name, specialization, or hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Doctors Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor) => {
                  const isShared = activeShares.some(s => s.doctor_id === doctor.id);
                  return (
                    <div
                      key={doctor.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{doctor.name}</p>
                          {doctor.is_verified && (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {doctor.hospital_name}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant={isShared ? 'outline' : 'default'}
                          onClick={() => handleOpenShareModal(doctor)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          {isShared ? 'Update' : 'Share'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewProfile(doctor)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Profile
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No doctors found matching your search.</p>
                </div>
              )}
            </motion.div>
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
                    } ${option.id === 'profile' ? 'opacity-100' : ''}`}
                  >
                    <Checkbox
                      checked={shareConfig.content.includes(option.id)}
                      onCheckedChange={() => toggleShareContent(option.id)}
                      disabled={option.id === 'profile'}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">{option.label}</span>
                      {option.id === 'profile' && (
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          Always included
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Basic Profile is always shared with doctors for proper patient identification
              </p>
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

      {/* Edit Share Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Share with {editingShare?.doctor_name}</DialogTitle>
            <DialogDescription>
              Update what data you're sharing
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
                    } ${option.id === 'profile' ? 'opacity-100' : ''}`}
                  >
                    <Checkbox
                      checked={shareConfig.content.includes(option.id)}
                      onCheckedChange={() => toggleShareContent(option.id)}
                      disabled={option.id === 'profile'}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">{option.label}</span>
                      {option.id === 'profile' && (
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          Always included
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Basic Profile is always shared with doctors for proper patient identification
              </p>
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

            {/* Extend Expiry */}
            <div className="space-y-2">
              <Label>Extend Access By</Label>
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
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateShare} disabled={isSharing}>
              {isSharing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Share'
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
                <p className="text-muted-foreground">{viewingDoctor.specialization}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{viewingDoctor.hospital_name}</p>
                    <p className="text-xs text-muted-foreground">Hospital</p>
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
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{viewingDoctor.experience_years} years</p>
                      <p className="text-xs text-muted-foreground">Experience</p>
                    </div>
                  </div>
                )}

                {viewingDoctor.bio && (
                  <div className="p-3 bg-muted/50 rounded-lg">
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
                  Share with {viewingDoctor.name.split(' ')[1]}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Doctor Access?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke access for <strong>{shareToRevoke?.doctorName}</strong>?
              <br /><br />
              They will no longer be able to view your medical records, timeline, or any shared health data.
              This action will take effect immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRevoke}
              disabled={isRevoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRevoking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Revoking...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revoke Access
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
