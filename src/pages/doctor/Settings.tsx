import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Award,
  Briefcase,
  FileText,
  Save,
  Loader2,
  Building2,
  Stethoscope,
} from 'lucide-react';
import { DoctorSidebar } from '@/components/layout/DoctorSidebar';
import { DoctorHeader } from '@/components/layout/DoctorHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function DoctorSettings() {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    qualification: '',
    experience_years: '',
    bio: '',
  });

  // Load initial data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        qualification: user.qualification || '',
        experience_years: user.experience_years?.toString() || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local user state
      updateUser({
        name: formData.name,
        phone: formData.phone,
        qualification: formData.qualification,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        bio: formData.bio,
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DoctorSidebar />
      
      <div className="ml-64">
        <DoctorHeader 
          title="Profile Settings" 
          subtitle="Update your profile information"
        />
        
        <main className="p-6">
          <div className="max-w-4xl">
            {/* Profile Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-6 mb-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {user?.name?.split(' ').slice(1).map(n => n[0]).join('') || 'DR'}
                  </span>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground">
                    {user?.name || 'Doctor'}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Stethoscope className="w-4 h-4" />
                    <span>{user?.specialization || 'Specialization'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Building2 className="w-4 h-4" />
                    <span>{user?.hospital_name || 'Hospital'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Editable Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 mb-6"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
                Personal Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Read-only)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user?.email || ''}
                      className="pl-10 bg-muted"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contact your hospital admin to change email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
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
                      min="0"
                      max="60"
                      value={formData.experience_years}
                      onChange={(e) => handleChange('experience_years', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Professional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6 mb-6"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
                Professional Information
              </h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization (Read-only)</Label>
                    <Input
                      id="specialization"
                      value={user?.specialization || ''}
                      className="bg-muted"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact your hospital admin to change specialization
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license_number">License Number (Read-only)</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="license_number"
                        value={user?.license_number || ''}
                        className="pl-10 bg-muted"
                        disabled
                      />
                    </div>
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
                      placeholder="MBBS, MD (Cardiology)"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / About Me</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Write a brief description about yourself, your expertise, and areas of interest..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be visible to patients when they view your profile
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Hospital Info (Read-only) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6 mb-6"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
                Hospital Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hospital Name</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{user?.hospital_name || 'Not assigned'}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Hospital affiliation is managed by your hospital administrator
              </p>
            </motion.div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                variant="hero"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
