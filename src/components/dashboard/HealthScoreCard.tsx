import { motion } from 'framer-motion';
import { HealthGlobe } from '@/components/three/HealthGlobe';
import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';

interface HealthScoreCardProps {
  score: number;
}

export function HealthScoreCard({ score }: HealthScoreCardProps) {
  const getScoreLabel = () => {
    if (score >= 80) return { label: 'Excellent', color: 'text-success' };
    if (score >= 60) return { label: 'Good', color: 'text-success' };
    if (score >= 40) return { label: 'Fair', color: 'text-warning' };
    return { label: 'Needs Attention', color: 'text-error' };
  };

  const { label, color } = getScoreLabel();

  const metrics = [
    {
      name: 'Blood Sugar',
      value: '6.9%',
      status: 'warning',
      trend: 'up',
      change: '+0.3%',
    },
    {
      name: 'Cholesterol',
      value: '185 mg/dL',
      status: 'normal',
      trend: 'down',
      change: '-12%',
    },
    {
      name: 'Kidney Function',
      value: 'eGFR 58',
      status: 'critical',
      trend: 'down',
      change: '-8%',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border p-6 shadow-green-sm hover:shadow-green-md transition-shadow"
    >
      <div className="flex items-start gap-6">
        {/* 3D Globe */}
        <div className="w-48 h-48 flex-shrink-0">
          <HealthGlobe score={score} />
        </div>

        {/* Score & Metrics */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-bold text-foreground">{score}</span>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <div className={`text-lg font-semibold ${color}`}>{label}</div>
            
            {/* Progress Bar */}
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${score > 70 ? 'bg-success' : score > 40 ? 'bg-warning' : 'bg-error'}`}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl ${
                  metric.status === 'normal' ? 'bg-success/10' :
                  metric.status === 'warning' ? 'bg-warning/10' : 'bg-error/10'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  {metric.status === 'normal' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertTriangle className={`w-4 h-4 ${metric.status === 'warning' ? 'text-warning' : 'text-error pulse-critical'}`} />
                  )}
                  <span className="text-xs text-muted-foreground">{metric.name}</span>
                </div>
                <div className="font-semibold text-foreground">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {metric.trend === 'up' ? (
                    <TrendingUp className={`w-3 h-3 ${metric.status === 'normal' ? 'text-success' : 'text-warning'}`} />
                  ) : (
                    <TrendingDown className={`w-3 h-3 ${metric.status === 'normal' ? 'text-success' : 'text-error'}`} />
                  )}
                  <span className={metric.status === 'normal' ? 'text-success' : metric.status === 'warning' ? 'text-warning' : 'text-error'}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
