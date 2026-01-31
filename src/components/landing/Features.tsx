import { motion } from 'framer-motion';
import { 
  Clock, 
  FileSearch, 
  Share2, 
  Stethoscope,
  Shield,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Interactive Timeline',
    description: 'Track your health biomarkers over time with beautiful, interactive charts. Spot trends and patterns at a glance.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: FileSearch,
    title: 'Dual Summaries',
    description: 'Get both patient-friendly explanations and clinical summaries. Understand your results and share professionally.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Share2,
    title: 'Shareable Profile',
    description: 'Generate secure shareable links or QR codes. Share your health history with doctors or family instantly.',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: Stethoscope,
    title: 'AI Symptom Checker',
    description: 'Describe your symptoms and get AI-powered insights combined with your medical history for accurate assessment.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your health data is encrypted and secure. You control who sees your information and when.',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Users,
    title: 'Family Access',
    description: 'Manage health records for your loved ones. Perfect for caregivers and parents.',
    color: 'bg-accent/10 text-accent',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to understand and manage your health data
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-green-lg"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
