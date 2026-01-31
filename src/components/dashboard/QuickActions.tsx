import { motion } from 'framer-motion';
import { Plus, Share2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const actions = [
  {
    icon: Plus,
    label: 'Add Report',
    description: 'Upload a new medical report',
    href: '/upload',
    variant: 'hero' as const,
  },
  {
    icon: Share2,
    label: 'Share Profile',
    description: 'Generate shareable link',
    href: '/share',
    variant: 'outline' as const,
  },
  {
    icon: AlertCircle,
    label: 'Emergency Profile',
    description: 'Quick access health info',
    href: '/emergency',
    variant: 'outline' as const,
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl border border-border p-6 shadow-green-sm"
    >
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant}
            className="w-full justify-start h-auto py-3 px-4"
            asChild
          >
            <Link to={action.href}>
              <action.icon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">{action.label}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
