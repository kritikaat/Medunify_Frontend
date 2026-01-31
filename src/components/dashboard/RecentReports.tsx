import { motion } from 'framer-motion';
import { FileText, Download, Trash2, Eye, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const reports = [
  {
    id: 1,
    hospital: 'City General Hospital',
    date: 'Jan 15, 2024',
    type: 'Lab Report',
    status: 'normal',
    findings: ['Blood glucose normal', 'Lipid panel optimal'],
  },
  {
    id: 2,
    hospital: 'Metro Health Center',
    date: 'Dec 20, 2023',
    type: 'Lab Report',
    status: 'warning',
    findings: ['HbA1c slightly elevated', 'Follow-up recommended'],
  },
  {
    id: 3,
    hospital: 'University Medical',
    date: 'Nov 8, 2023',
    type: 'Radiology',
    status: 'normal',
    findings: ['Chest X-ray clear', 'No abnormalities'],
  },
  {
    id: 4,
    hospital: 'City General Hospital',
    date: 'Oct 15, 2023',
    type: 'Lab Report',
    status: 'critical',
    findings: ['Creatinine elevated', 'Immediate attention needed'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function RecentReports() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl border border-border p-6 shadow-green-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Recent Reports</h3>
          <p className="text-sm text-muted-foreground">Your latest medical reports</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <motion.div
        className="grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {reports.map((report) => (
          <motion.div
            key={report.id}
            variants={itemVariants}
            className="group relative bg-background rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-green-sm transition-all"
          >
            {/* Status Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                report.status === 'normal' ? 'bg-success' :
                report.status === 'warning' ? 'bg-warning' : 'bg-error'
              }`}
            />

            <div className="p-4 pt-5">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  report.status === 'normal' ? 'bg-success/10' :
                  report.status === 'warning' ? 'bg-warning/10' : 'bg-error/10'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    report.status === 'normal' ? 'text-success' :
                    report.status === 'warning' ? 'text-warning' : 'text-error'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">{report.hospital}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {report.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.date}</p>
                  <div className="flex flex-wrap gap-2">
                    {report.findings.map((finding, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs">
                        {report.status === 'normal' ? (
                          <CheckCircle className="w-3 h-3 text-success" />
                        ) : report.status === 'warning' ? (
                          <AlertTriangle className="w-3 h-3 text-warning" />
                        ) : (
                          <AlertOctagon className="w-3 h-3 text-error" />
                        )}
                        <span className="text-muted-foreground">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:text-error">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
