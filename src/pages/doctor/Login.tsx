import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = (location.state as { from?: Location })?.from?.pathname || '/doctor';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('🔄 [Doctor Login] Attempting login with:', { email });
      
      // Use ONLY real API login
      await login({ email, password });
      
      console.log('✅ [Doctor Login] Login successful');
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      const errorDetails = {
        timestamp: new Date().toISOString(),
        endpoint: '/auth/login',
        method: 'POST',
        role: 'doctor',
        email: email,
        error: errorMessage,
        fullError: err,
      };
      
      console.error('❌ [Doctor Login] API Error:', errorDetails);
      
      toast.error('Doctor login failed', {
        description: errorMessage,
        duration: 5000,
      });
      
      setError(`Login failed: ${errorMessage}`);
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
          <h1 className="font-heading text-2xl font-bold text-foreground">Doctor Portal</h1>
          <p className="text-muted-foreground mt-2">Sign in to access patient records</p>
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
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
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
            <p className="text-xs text-muted-foreground">Email: doctor@cityhospital.com</p>
            <p className="text-xs text-muted-foreground">Password: doctor123</p>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/hospital/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
            >
              Hospital Admin? Sign in here →
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
