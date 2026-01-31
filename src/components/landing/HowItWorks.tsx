import { motion } from 'framer-motion';
import { Upload, Brain, LineChart, Lightbulb } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Reports',
    description: 'Simply upload your medical reports in PDF or image format. We support lab reports, prescriptions, and more.',
  },
  {
    icon: Brain,
    step: '02',
    title: 'AI Extracts & Interprets',
    description: 'Our AI extracts medical data, identifies abnormalities, and translates complex terms into plain language.',
  },
  {
    icon: LineChart,
    step: '03',
    title: 'Visualize Trends',
    description: 'See your health data on an interactive timeline. Track changes over time and spot important patterns.',
  },
  {
    icon: Lightbulb,
    step: '04',
    title: 'Get Personalized Insights',
    description: 'Receive actionable recommendations, understand when to see a doctor, and take control of your health.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            How MedUnify Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From upload to insight in four simple steps
          </p>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Step Circle */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-green-lg">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                {/* Step Number */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-bold text-primary bg-background px-2">
                  {step.step}
                </div>
                
                <div className="text-center">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
