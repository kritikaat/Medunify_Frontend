import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { DoctorSidebar } from '@/components/layout/DoctorSidebar';
import { DoctorHeader } from '@/components/layout/DoctorHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getPatientProfile, getPatientReports } from '@/lib/api/doctor-patient-view';
import type { PatientProfileForDoctor } from '@/types/doctor-patient-view';

export default function DoctorPatientReports() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientProfileForDoctor | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    if (!patientId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 [Doctor Patient Reports] Fetching patient data and reports...', { patientId });

      // Fetch patient profile and reports in parallel
      const [profileData, reportsData] = await Promise.all([
        getPatientProfile(patientId),
        getPatientReports(patientId),
      ]);

      console.log('✅ [Doctor Patient Reports] Data fetched successfully:', {
        patient: profileData.name,
        reportsCount: reportsData.reports.length,
      });

      setPatient(profileData);
      setReports(reportsData.reports);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load patient data';
      const errorDetails = {
        timestamp: new Date().toISOString(),
        endpoint: `/doctors/patients/${patientId}/profile and /reports`,
        method: 'GET',
        error: errorMessage,
        patientId,
        fullError: err,
      };

      console.error('❌ [Doctor Patient Reports] API Error:', errorDetails);

      toast.error('Failed to load patient reports', {
        description: `Error: ${errorMessage}. Please try again.`,
        duration: 8000,
      });

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <DoctorSidebar />
        <div className="ml-64">
          <DoctorHeader title="Patient Reports" />
          <main className="p-6 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Loading patient reports...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !patient) {
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
            <div className="bg-destructive/10 border border-destructive rounded-2xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                Failed to Load Patient Data
              </h2>
              <p className="text-muted-foreground mb-4">
                {error || 'Unable to access patient reports. The share may have expired.'}
              </p>
              <Button onClick={fetchPatientData} variant="hero">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
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
          title={patient.name}
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
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {patient.name}
                </h3>
                <p className="text-muted-foreground">
                  {patient.age}y, {patient.gender}
                </p>
                {patient.blood_group && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Blood Group: <span className="font-medium text-foreground">{patient.blood_group}</span>
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Shared: {format(new Date(patient.shared_at), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Expires: {format(new Date(patient.expires_at), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              {/* Health Info */}
              {((patient.allergies?.length ?? 0) > 0 || (patient.chronic_conditions?.length ?? 0) > 0 || (patient.current_medications?.length ?? 0) > 0) && (
                <div className="mt-6 pt-6 border-t border-border space-y-4">
                  {(patient.allergies?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Allergies:</p>
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies?.map((allergy, i) => (
                          <span key={i} className="px-2 py-1 bg-destructive/10 rounded text-xs text-destructive">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(patient.chronic_conditions?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Chronic Conditions:</p>
                      <div className="flex flex-wrap gap-1">
                        {patient.chronic_conditions?.map((condition, i) => (
                          <span key={i} className="px-2 py-1 bg-warning/10 rounded text-xs text-warning">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(patient.current_medications?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Current Medications:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {patient.current_medications?.map((med, i) => (
                          <li key={i}>• {med}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>{patient.report_count}</strong> reports
                </p>
                {patient.latest_report_date && (
                  <p className="text-xs text-muted-foreground">
                    Latest: {format(new Date(patient.latest_report_date), 'MMM dd, yyyy')}
                  </p>
                )}
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
                        <p className="text-sm text-muted-foreground capitalize">
                          {report.report_type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">{format(new Date(report.report_date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>

                  {/* Patient-Friendly Summary */}
                  {report.patient_friendly_summary && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg mb-4">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Patient Summary:
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{report.patient_friendly_summary}</p>
                    </div>
                  )}

                  {/* Clinical Summary (Always visible for doctors) */}
                  {report.clinical_summary && (
                    <div className="p-4 bg-primary/5 rounded-lg mb-4">
                      <p className="text-sm font-medium text-foreground mb-1">Clinical Summary:</p>
                      <p className="text-sm text-muted-foreground">{report.clinical_summary}</p>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedReport?.id === report.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-border pt-4 mt-4 space-y-4"
                    >
                      {/* Extracted Values */}
                      {report.extracted_values && report.extracted_values.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-foreground mb-3">Test Results:</h5>
                          <div className="space-y-2">
                            {report.extracted_values.map((value: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground">{value.test_name}</p>
                                  {value.reference_range && (
                                    <p className="text-xs text-muted-foreground">Normal: {value.reference_range}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm font-semibold ${
                                    value.status === 'normal' ? 'text-success' :
                                    value.status === 'abnormal' ? 'text-destructive' :
                                    value.status === 'borderline' ? 'text-warning' :
                                    'text-foreground'
                                  }`}>
                                    {value.value} {value.unit}
                                  </p>
                                  <p className="text-xs text-muted-foreground capitalize">{value.status}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Download Note */}
                      {!report.can_download && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <AlertCircle className="w-4 h-4" />
                          <span>Download permission not granted by patient</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedReport(
                        selectedReport?.id === report.id ? null : report
                      )}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedReport?.id === report.id ? 'Collapse' : 'View Details'}
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
