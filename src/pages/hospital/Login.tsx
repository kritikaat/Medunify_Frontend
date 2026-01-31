import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Dummy hospital credentials for testing
const DUMMY_HOSPITAL = {
  email: 'hospital@cityhospital.com',
  password: 'hospital123',
  user: {
    id: 'h1',
    email: 'hospital@cityhospital.com',
    name: 'City Hospital',
    role: 'hospital' as const,
  },
};

export default function HospitalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = (location.state as { from?: Location })?.from?.pathname || '/hospital';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // For now, use dummy data
      if (email === DUMMY_HOSPITAL.email && password === DUMMY_HOSPITAL.password) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Store dummy user in localStorage
        localStorage.setItem('medunify_token', 'dummy_hospital_token');
        localStorage.setItem('medunify_user', JSON.stringify(DUMMY_HOSPITAL.user));
        
        // Reload to pick up auth state
        window.location.href = '/hospital';
      } else {
        // Try real API
        await login({ email, password });
        navigate(from, { replace: true });
      }
      
      toast.success('Login successful!');
    } catch (err) {
      setError('Invalid credentials. Try: hospital@cityhospital.com / hospital123');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-green-md">
              <Activity className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">Hospital Portal</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your hospital</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Hospital Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="hospital@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="hero"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-muted-foreground">Email: hospital@cityhospital.com</p>
            <p className="text-xs text-muted-foreground">Password: hospital123</p>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/doctor/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
            >
              Doctor? Sign in to Doctor Portal →
            </Link>
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
            >
              Patient? Sign in here →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
