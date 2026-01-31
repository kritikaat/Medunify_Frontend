import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Shield,
  Bell,
  Accessibility,
  Users,
  Database,
  HelpCircle,
  Camera,
  Mail,
  Phone,
  Calendar,
  Ruler,
  Weight,
  Droplets,
  Lock,
  Smartphone,
  Globe,
  LogOut,
  Trash2,
  Download,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'family', label: 'Family & Caregivers', icon: Users },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

const sessions = [
  { device: 'MacBook Pro', location: 'New York, US', lastActive: 'Now', current: true },
  { device: 'iPhone 15', location: 'New York, US', lastActive: '2 hours ago', current: false },
  { device: 'Chrome on Windows', location: 'New Jersey, US', lastActive: '3 days ago', current: false },
];

const dependents = [
  { name: 'Sarah Doe', relationship: 'Daughter', permission: 'Full Access' },
  { name: 'Robert Doe', relationship: 'Father', permission: 'View Only' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [fontSize, setFontSize] = useState([16]);
  const [notifications, setNotifications] = useState({
    critical: true,
    processing: true,
    monthly: true,
    tips: false,
    push: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </motion.div>

            <div className="flex gap-6">
              {/* Sidebar Tabs */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-64 flex-shrink-0"
              >
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </motion.div>

              {/* Content Area */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 bg-card rounded-2xl border border-border p-6"
              >
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Profile Information
                    </h3>

                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-2xl bg-primary/10 text-primary">JD</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Profile Photo</h4>
                        <p className="text-sm text-muted-foreground mb-2">JPG, PNG or GIF. Max 5MB.</p>
                        <Button variant="outline" size="sm">Upload Photo</Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input defaultValue="john@example.com" disabled className="pl-10 bg-muted" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="+1 (555) 000-0000" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="date" defaultValue="1972-06-15" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select defaultValue="male">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Blood Group</Label>
                        <Select defaultValue="o+">
                          <SelectTrigger>
                            <Droplets className="w-4 h-4 mr-2 text-error" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a+">A+</SelectItem>
                            <SelectItem value="a-">A-</SelectItem>
                            <SelectItem value="b+">B+</SelectItem>
                            <SelectItem value="b-">B-</SelectItem>
                            <SelectItem value="ab+">AB+</SelectItem>
                            <SelectItem value="ab-">AB-</SelectItem>
                            <SelectItem value="o+">O+</SelectItem>
                            <SelectItem value="o-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Height</Label>
                        <div className="relative">
                          <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="5'10&quot;" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Weight</Label>
                        <div className="relative">
                          <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="180 lbs" className="pl-10" />
                        </div>
                      </div>
                    </div>

                    <Button variant="hero" onClick={handleSave}>Save Changes</Button>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Privacy & Security
                    </h3>

                    {/* Data Storage */}
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-foreground">Cloud Storage</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Store your health data securely in the cloud for access across devices
                      </p>
                    </div>

                    {/* 2FA */}
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-foreground">Two-Factor Authentication</span>
                        </div>
                        <Switch />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>

                    {/* Active Sessions */}
                    <div>
                      <h4 className="font-medium text-foreground mb-4">Active Sessions</h4>
                      <div className="space-y-3">
                        {sessions.map((session, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Smartphone className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">
                                  {session.device}
                                  {session.current && (
                                    <span className="ml-2 text-xs text-primary">(This device)</span>
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {session.location} · {session.lastActive}
                                </p>
                              </div>
                            </div>
                            {!session.current && (
                              <Button variant="ghost" size="sm" className="text-error hover:text-error">
                                <LogOut className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="mt-4">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout from all devices
                      </Button>
                    </div>

                    {/* Change Password */}
                    <div className="pt-6 border-t border-border">
                      <h4 className="font-medium text-foreground mb-4">Change Password</h4>
                      <div className="space-y-4 max-w-md">
                        <div className="space-y-2">
                          <Label>Current Password</Label>
                          <Input type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm New Password</Label>
                          <Input type="password" />
                        </div>
                        <Button variant="hero">Update Password</Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Notification Preferences
                    </h3>

                    <div className="space-y-4">
                      {[
                        { id: 'critical', label: 'Critical abnormalities detected', desc: 'Get alerted when critical values are found' },
                        { id: 'processing', label: 'Report processing complete', desc: 'Know when your reports are ready' },
                        { id: 'monthly', label: 'Monthly health summary', desc: 'Receive a monthly overview of your health trends' },
                        { id: 'tips', label: 'Tips and recommendations', desc: 'Personalized health tips based on your data' },
                        { id: 'push', label: 'Push notifications', desc: 'Receive notifications on your device' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                          <div>
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch
                            checked={notifications[item.id as keyof typeof notifications]}
                            onCheckedChange={(checked) =>
                              setNotifications(prev => ({ ...prev, [item.id]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>

                    <Button variant="hero" onClick={handleSave}>Save Preferences</Button>
                  </div>
                )}

                {activeTab === 'accessibility' && (
                  <div className="space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Accessibility Settings
                    </h3>

                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-foreground">Assisted Mode</span>
                        <Switch />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enable simplified navigation and larger text for easier reading
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Text Size</Label>
                          <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                        </div>
                        <Slider
                          value={fontSize}
                          onValueChange={setFontSize}
                          min={14}
                          max={24}
                          step={1}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Small</span>
                          <span>Large</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <span className="font-medium text-foreground">High Contrast Mode</span>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <span className="font-medium text-foreground">Screen Reader Optimization</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'family' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        Family & Caregivers
                      </h3>
                      <Button variant="hero" size="sm">
                        <Users className="w-4 h-4 mr-2" />
                        Add Dependent
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-4">Dependents I Manage</h4>
                      <div className="space-y-3">
                        {dependents.map((dep, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {dep.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{dep.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {dep.relationship} · {dep.permission}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-error hover:text-error">
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Data Management
                    </h3>

                    {/* Export Data */}
                    <div className="p-6 bg-muted/50 rounded-xl">
                      <h4 className="font-medium text-foreground mb-2">Export Your Data</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download a copy of all your health data
                      </p>
                      <div className="flex items-center gap-4">
                        <Select defaultValue="json">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Request Export
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        You'll receive an email within 24 hours with your data
                      </p>
                    </div>

                    {/* Delete Data */}
                    <div className="p-6 bg-error/5 border border-error/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Delete Your Data</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete your account and all associated health data. This action cannot be undone.
                          </p>
                          <div className="flex items-center gap-4">
                            <Button variant="outline">Delete Specific Reports</Button>
                            <Button variant="destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete All Data
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'help' && (
                  <div className="space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Help & Support
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { label: 'FAQ', desc: 'Find answers to common questions' },
                        { label: 'Video Tutorials', desc: 'Learn how to use MedUnify' },
                        { label: 'Contact Support', desc: 'Get help from our team' },
                        { label: 'Report a Bug', desc: 'Let us know about issues' },
                      ].map((item, i) => (
                        <button
                          key={i}
                          className="p-4 bg-muted/50 rounded-xl text-left hover:bg-muted transition-colors"
                        >
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </button>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-border">
                      <h4 className="font-medium text-foreground mb-4">Send Feedback</h4>
                      <div className="space-y-4">
                        <Textarea placeholder="Tell us what you think or report an issue..." rows={4} />
                        <Button variant="hero">
                          <Send className="w-4 h-4 mr-2" />
                          Send Feedback
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
