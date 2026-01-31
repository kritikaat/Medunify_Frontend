import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  Share2,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Mail,
  User,
} from 'lucide-react';
import { DoctorSidebar } from '@/components/layout/DoctorSidebar';
import { DoctorHeader } from '@/components/layout/DoctorHeader';
import { Button } from '@/components/ui/button';
import type { SharedPatient, PatientReportListItem } from '@/types/doctor';
import { format } from 'date-fns';

// Dummy patient data
const DUMMY_PATIENT: SharedPatient = {
  id: 's1',
  patient_id: 'p1',
  patient_name: 'Rahul Verma',
  patient_email: 'rahul@email.com',
  patient_age: 45,
  patient_gender: 'Male',
  shared_content: ['timeline', 'lab_reports', 'prescriptions'],
  date_range: '6-months',
  expires_at: '2026-03-15',
  shared_at: '2026-01-15',
  last_accessed: '2026-01-30',
  is_active: true,
};

// Dummy reports data
const DUMMY_REPORTS: PatientReportListItem[] = [
  {
    id: 'r1',
    hospital_name: 'Labsmart Diagnostics',
    doctor_name: 'Dr. A. K. Asthana',
    report_date: '2024-11-18',
    report_type: 'lab_report',
    document_type: 'BLOOD_TEST',
    processing_status: 'completed',
    patient_friendly_summary: 'Blood sugar levels are slightly elevated. HbA1c at 6.9% indicates pre-diabetic condition.',
    clinical_summary: 'HbA1c 6.9%, Fasting Glucose 118 mg/dL. Recommend lifestyle modification and follow-up in 3 months.',
    uploaded_at: '2026-01-20T10:30:00',
  },
  {
    id: 'r2',
    hospital_name: 'City Hospital',
    doctor_name: 'Dr. Priya Sharma',
    report_date: '2024-11-10',
    report_type: 'lab_report',
    document_type: 'LIPID_PROFILE',
    processing_status: 'completed',
    patient_friendly_summary: 'Cholesterol levels are within normal range. Good heart health indicators.',
    clinical_summary: 'Total Cholesterol 185 mg/dL, LDL 110 mg/dL, HDL 55 mg/dL. Values within normal limits.',
    uploaded_at: '2026-01-15T14:20:00',
  },
  {
    id: 'r3',
    hospital_name: 'Metro Health Center',
    doctor_name: 'Dr. Amit Singh',
    report_date: '2024-10-25',
    report_type: 'lab_report',
    document_type: 'COMPLETE_BLOOD_COUNT',
    processing_status: 'completed',
    patient_friendly_summary: 'All blood cell counts are normal. No signs of infection or anemia.',
    clinical_summary: 'CBC within normal limits. Hemoglobin 14.2 g/dL, WBC 7,500/μL, Platelets 250,000/μL.',
    uploaded_at: '2026-01-10T09:15:00',
  },
];

export default function DoctorPatientReports() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<SharedPatient | null>(null);
  const [reports, setReports] = useState<PatientReportListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<PatientReportListItem | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPatient(DUMMY_PATIENT);
      setReports(DUMMY_REPORTS);
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  if (isLoading || !patient) {
    return (
      <div className="min-h-screen bg-muted/30">
        <DoctorSidebar />
        <div className="ml-64 flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  if (!patient.is_active) {
    return (
      <div className="min-h-screen bg-muted/30">
        <DoctorSidebar />
        <div className="ml-64">
          <DoctorHeader title="Patient Reports" />
          <main className="p-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/doctor/patients')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Access Expired</h2>
              <p className="text-muted-foreground">
                The patient's share has expired. You no longer have access to their reports.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DoctorSidebar />
      
      <div className="ml-64">
        <DoctorHeader 
          title={patient.patient_name}
          subtitle={`${reports.length} reports available`}
        />
        
        <main className="p-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/doctor/patients')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Patient Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {patient.patient_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {patient.patient_name}
                </h3>
                <p className="text-muted-foreground">
                  {patient.patient_age}y, {patient.patient_gender}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{patient.patient_email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Shared: {format(new Date(patient.shared_at), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Expires: {format(new Date(patient.expires_at), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Shared Data:</p>
                <div className="flex flex-wrap gap-1">
                  {patient.shared_content.map(content => (
                    <span 
                      key={content}
                      className="px-2 py-1 bg-primary/10 rounded text-xs text-primary capitalize"
                    >
                      {content.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Reports List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Medical Reports
              </h3>

              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`bg-card rounded-xl border p-6 cursor-pointer transition-all ${
                    selectedReport?.id === report.id 
                      ? 'border-primary shadow-lg' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedReport(
                    selectedReport?.id === report.id ? null : report
                  )}
                >
                  {/* Report Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{report.hospital_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.document_type?.replace('_', ' ') || report.report_type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">{format(new Date(report.report_date), 'MMM dd, yyyy')}</p>
                      <p className="text-xs text-muted-foreground">{report.doctor_name}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg mb-4">
                    <p className="text-sm text-foreground">{report.patient_friendly_summary}</p>
                  </div>

                  {/* Expanded Clinical Summary */}
                  {selectedReport?.id === report.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-border pt-4 mt-4"
                    >
                      <h5 className="text-sm font-medium text-foreground mb-2">Clinical Summary:</h5>
                      <p className="text-sm text-muted-foreground">{report.clinical_summary}</p>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      report.processing_status === 'completed'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {report.processing_status === 'completed' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {report.processing_status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedReport?.id === report.id ? 'Collapse' : 'Expand'}
                    </Button>
                  </div>
                </motion.div>
              ))}

              {reports.length === 0 && (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reports available for this patient.</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
