import { motion } from 'framer-motion';
import { FileText, TrendingUp, HelpCircle } from 'lucide-react';

const problems = [
  {
    icon: FileText,
    title: 'Medical jargon is confusing',
    description: 'Lab reports are filled with complex terminology that leaves patients feeling lost and anxious about their health.',
  },
  {
    icon: TrendingUp,
    title: 'Hard to track health trends over time',
    description: 'Without a unified view of your medical history, spotting important health patterns becomes nearly impossible.',
  },
  {
    icon: HelpCircle,
    title: 'Unclear when to see a doctor',
    description: 'Understanding which test results need immediate attention versus routine follow-up can be overwhelming.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Problems() {
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
            The Problem We're Solving
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Millions struggle to understand their health data. We're here to change that.
          </p>
        </motion.div>
        
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-green-lg hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <problem.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
