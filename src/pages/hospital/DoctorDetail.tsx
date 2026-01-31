import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Award,
  Briefcase,
  FileText,
  Loader2,
  UserCheck,
  UserX,
  Edit,
  Save,
  X,
  Users,
  Calendar,
} from 'lucide-react';
import { HospitalSidebar } from '@/components/layout/HospitalSidebar';
import { HospitalHeader } from '@/components/layout/HospitalHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { Doctor } from '@/types/hospital';
import { SPECIALIZATIONS } from '@/types/hospital';
import { format } from 'date-fns';

// Dummy doctor data
const DUMMY_DOCTOR: Doctor = {
  id: 'd1',
  email: 'rajesh@cityhospital.com',
  name: 'Dr. Rajesh Kumar',
  specialization: 'Cardiology',
  qualification: 'MBBS, MD (Cardiology)',
  license_number: 'MED12345',
  hospital_id: 'h1',
  hospital_name: 'City Hospital',
  experience_years: 15,
  phone: '+91 98765 43210',
  bio: 'Dr. Rajesh Kumar is a renowned cardiologist with over 15 years of experience in treating complex heart conditions. He specializes in interventional cardiology and preventive heart care.',
  is_active: true,
  is_verified: true,
  created_at: '2024-06-15',
  patients_count: 45,
};

export default function HospitalDoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    license_number: '',
    experience_years: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    // Simulate API call
    const loadDoctor = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real app, fetch by id
      setDoctor(DUMMY_DOCTOR);
      setFormData({
        name: DUMMY_DOCTOR.name,
        specialization: DUMMY_DOCTOR.specialization,
        qualification: DUMMY_DOCTOR.qualification || '',
        license_number: DUMMY_DOCTOR.license_number,
        experience_years: DUMMY_DOCTOR.experience_years?.toString() || '',
        phone: DUMMY_DOCTOR.phone || '',
        bio: DUMMY_DOCTOR.bio || '',
      });
      setIsLoading(false);
    };
    loadDoctor();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDoctor(prev => prev ? {
        ...prev,
        ...formData,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
      } : null);
      setIsEditing(false);
      toast.success('Doctor details updated');
    } catch (error) {
      toast.error('Failed to update doctor');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async () => {
    if (!doctor) return;
    setDoctor(prev => prev ? { ...prev, is_active: !prev.is_active } : null);
    toast.success(`Doctor ${doctor.is_active ? 'deactivated' : 'activated'}`);
  };

  if (isLoading || !doctor) {
    return (
      <div className="min-h-screen bg-muted/30">
        <HospitalSidebar />
        <div className="ml-64 flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <HospitalSidebar />
      
      <div className="ml-64">
        <HospitalHeader 
          title={isEditing ? 'Edit Doctor' : 'Doctor Details'} 
          subtitle={doctor.email}
        />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/hospital/doctors')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Doctors
              </Button>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      variant="hero"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant={doctor.is_active ? 'destructive' : 'default'}
                      onClick={toggleStatus}
                    >
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
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {doctor.name}
                  </h3>
                  <p className="text-muted-foreground">{doctor.specialization}</p>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 mt-2 rounded-full text-sm font-medium ${
                    doctor.is_active
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {doctor.is_active ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <UserX className="w-4 h-4" />
                        Inactive
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <Users className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-2xl font-bold text-foreground">{doctor.patients_count}</p>
                    <p className="text-xs text-muted-foreground">Patients</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <Briefcase className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-2xl font-bold text-foreground">{doctor.experience_years || 0}</p>
                    <p className="text-xs text-muted-foreground">Years Exp.</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {format(new Date(doctor.created_at), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Contact Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{doctor.email}</span>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{doctor.phone || 'Not provided'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Professional Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="specialization">Specialization</Label>
                          <Select
                            value={formData.specialization}
                            onValueChange={(value) => handleChange('specialization', value)}
                          >
                            <SelectTrigger id="specialization">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SPECIALIZATIONS.map(spec => (
                                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="license_number">License Number</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="license_number"
                              value={formData.license_number}
                              onChange={(e) => handleChange('license_number', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="qualification">Qualification</Label>
                          <div className="relative">
                            <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="qualification"
                              value={formData.qualification}
                              onChange={(e) => handleChange('qualification', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience_years">Years of Experience</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="experience_years"
                              type="number"
                              value={formData.experience_years}
                              onChange={(e) => handleChange('experience_years', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Specialization</Label>
                          <div className="p-3 bg-muted/50 rounded-lg text-foreground">
                            {doctor.specialization}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>License Number</Label>
                          <div className="p-3 bg-muted/50 rounded-lg text-foreground">
                            {doctor.license_number}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Qualification</Label>
                          <div className="p-3 bg-muted/50 rounded-lg text-foreground">
                            {doctor.qualification || 'Not provided'}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Years of Experience</Label>
                          <div className="p-3 bg-muted/50 rounded-lg text-foreground">
                            {doctor.experience_years || 'Not provided'}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="bio">Bio / About</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg text-foreground">
                        {doctor.bio || 'No bio provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
