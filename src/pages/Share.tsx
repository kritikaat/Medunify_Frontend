import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { DoctorProfile, ActiveShare, ShareableContent } from '@/types/share';
import { SHARE_CONTENT_OPTIONS, DATE_RANGE_OPTIONS, EXPIRY_OPTIONS } from '@/types/share';

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
  const [isLoading, setIsLoading] = useState(false);

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
        d.email.toLowerCase().includes(query)
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if already shared with this doctor
      const existingShare = activeShares.find(s => s.doctor_id === selectedDoctor.id);
      if (existingShare) {
        // Update existing share
        setActiveShares(prev =>
          prev.map(s =>
            s.id === existingShare.id
              ? {
                  ...s,
                  shared_content: shareConfig.content,
                  date_range: shareConfig.dateRange as any,
                  expires_at: new Date(Date.now() + shareConfig.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
                }
              : s
          )
        );
        toast.success('Share updated successfully');
      } else {
        // Create new share
        const newShare: ActiveShare = {
          id: `s${Date.now()}`,
          patient_id: 'p1',
          doctor_id: selectedDoctor.id,
          doctor_name: selectedDoctor.name,
          doctor_email: selectedDoctor.email,
          hospital_name: selectedDoctor.hospital_name,
          specialization: selectedDoctor.specialization,
          shared_content: shareConfig.content,
          date_range: shareConfig.dateRange as any,
          expires_at: new Date(Date.now() + shareConfig.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          access_count: 0,
          is_active: true,
        };
        setActiveShares(prev => [newShare, ...prev]);
        toast.success(`Shared successfully with ${selectedDoctor.name}`);
      }

      setShareModalOpen(false);
    } catch (error) {
      toast.error('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleRevokeShare = (shareId: string) => {
    setActiveShares(prev => prev.filter(s => s.id !== shareId));
    toast.success('Access revoked successfully');
  };

  const handleEditShare = (share: ActiveShare) => {
    setEditingShare(share);
    setShareConfig({
      content: share.shared_content as ShareableContent[],
      dateRange: share.date_range,
      expiresInDays: 30,
    });
    setEditModalOpen(true);
  };

  const handleUpdateShare = async () => {
    if (!editingShare) return;
    
    setIsSharing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setActiveShares(prev =>
        prev.map(s =>
          s.id === editingShare.id
            ? {
                ...s,
                shared_content: shareConfig.content,
                date_range: shareConfig.dateRange as any,
                expires_at: new Date(Date.now() + shareConfig.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
              }
            : s
        )
      );
      
      toast.success('Share updated successfully');
      setEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update share');
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
                          onClick={() => handleEditShare(share)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-error hover:text-error"
                          onClick={() => handleRevokeShare(share.id)}
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
    </div>
  );
}
