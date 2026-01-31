import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Loader2,
  User,
  Stethoscope,
  Calendar,
  Building2,
  Clock,
  Activity,
  Beaker,
  Info,
  FileJson,
  FileSpreadsheet,
  FileType,
  File,
} from 'lucide-react';
import { getReportById, reprocessReport, getReportTypeDisplayName } from '@/lib/api/reports';
import { downloadReportSummary, downloadReportAsJson, downloadReportAsCsv, downloadReportAsPdf } from '@/lib/api/download';
import type { Report, ExtractedValue } from '@/types/api';
import { format, parseISO } from 'date-fns';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id]);

  const fetchReport = async (reportId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReportById(reportId);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReprocess = async () => {
    if (!id) return;
    setIsReprocessing(true);
    try {
      const data = await reprocessReport(id);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reprocess report');
    } finally {
      setIsReprocessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-success/10 text-success">
            <CheckCircle className="w-4 h-4" /> Normal
          </span>
        );
      case 'warning':
      case 'abnormal':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-warning/10 text-warning">
            <AlertTriangle className="w-4 h-4" /> Abnormal
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-error/10 text-error">
            <AlertOctagon className="w-4 h-4" /> Critical
          </span>
        );
      default:
        return null;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'high':
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-error" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-success/5 border-success/20';
      case 'medium':
        return 'bg-warning/5 border-warning/20';
      case 'high':
      case 'critical':
        return 'bg-error/5 border-error/20';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  // Get extracted values
  const extractedValues: ExtractedValue[] = report?.extracted_values || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar />
        <div className="ml-64">
          <DashboardHeader />
          <main className="p-6 flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </main>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar />
        <div className="ml-64">
          <DashboardHeader />
          <main className="p-6">
            <div className="max-w-4xl mx-auto text-center py-12">
              <AlertOctagon className="w-16 h-16 text-error mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Report Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                {error || 'The report you are looking for does not exist.'}
              </p>
              <Button variant="outline" onClick={() => navigate('/reports')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reports
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="ml-64">
        <DashboardHeader />

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/reports">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Reports
                  </Link>
                </Button>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="font-heading text-2xl font-bold text-foreground">
                        {report.hospital_name || 'Medical Report'}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {getReportTypeDisplayName(report.report_type)}
                        </Badge>
                        {report.document_type && (
                          <Badge variant="outline">{report.document_type}</Badge>
                        )}
                        {report.processing_status === 'completed' && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            Processed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleReprocess}
                    disabled={isReprocessing}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isReprocessing ? 'animate-spin' : ''}`} />
                    Reprocess
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => downloadReportAsPdf(report)}>
                        <File className="w-4 h-4 mr-2" />
                        PDF Report (.pdf)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadReportSummary(report)}>
                        <FileType className="w-4 h-4 mr-2" />
                        Summary (.txt)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => downloadReportAsJson(report)}>
                        <FileJson className="w-4 h-4 mr-2" />
                        Full Report (.json)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => downloadReportAsCsv(report)}
                        disabled={!report.extracted_values?.length}
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Test Results (.csv)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>

            {/* Summaries Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-2 gap-6 mb-6"
            >
              {/* Patient-Friendly Summary */}
              {report.patient_friendly_summary && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        Patient Summary
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Easy-to-understand explanation
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {report.patient_friendly_summary}
                  </p>
                </div>
              )}

              {/* Clinical Summary */}
              {report.clinical_summary && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        Clinical Summary
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        For healthcare providers
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {report.clinical_summary}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Key Findings */}
            {report.key_findings && report.key_findings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Key Findings
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Important observations from your report
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {report.key_findings.map((finding, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${getSeverityBg(finding.severity)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getSeverityIcon(finding.severity)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{finding.finding}</p>
                          {finding.action_needed && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <span className="font-medium text-foreground">Recommended Action:</span>{' '}
                              {finding.action_needed}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={`capitalize ${
                            finding.severity === 'low'
                              ? 'border-success/30 text-success'
                              : finding.severity === 'medium'
                              ? 'border-warning/30 text-warning'
                              : 'border-error/30 text-error'
                          }`}
                        >
                          {finding.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Extracted Test Results */}
            {extractedValues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl border border-border overflow-hidden mb-6"
              >
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Beaker className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        Test Results
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {extractedValues.length} test{extractedValues.length !== 1 ? 's' : ''} extracted
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                          Test Name
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                          Value
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                          Unit
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                          Reference Range
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                          Confidence
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedValues.map((test, i) => (
                        <tr
                          key={i}
                          className={`border-t border-border ${
                            test.confidence_score < 85 ? 'bg-warning/5' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{test.test_name}</p>
                              {test.standard_test_name &&
                                test.standard_test_name !== test.test_name && (
                                  <p className="text-xs text-muted-foreground">
                                    {test.standard_test_name}
                                  </p>
                                )}
                              {test.category && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {test.category}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-foreground">
                            {test.value_numeric ?? test.value_text}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {test.unit || '-'}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {test.reference_text ||
                              (test.reference_min !== null && test.reference_max !== null
                                ? `${test.reference_min} - ${test.reference_max}`
                                : '-')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    test.confidence_score >= 90
                                      ? 'bg-success'
                                      : test.confidence_score >= 80
                                      ? 'bg-warning'
                                      : 'bg-error'
                                  }`}
                                  style={{ width: `${test.confidence_score}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {test.confidence_score}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(test.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Clinical Context */}
            {report.extracted_data?.clinical_context && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-2xl border border-border p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Clinical Context
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Additional medical information
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Disease Information */}
                  {report.extracted_data.clinical_context.disease_information?.overview && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Overview</h4>
                      <p className="text-muted-foreground">
                        {report.extracted_data.clinical_context.disease_information.overview}
                      </p>
                    </div>
                  )}

                  {/* Differential Diagnoses */}
                  {report.extracted_data.clinical_context.differential_diagnoses &&
                    report.extracted_data.clinical_context.differential_diagnoses.length > 0 && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Differential Diagnoses
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.extracted_data.clinical_context.differential_diagnoses.map(
                            (diagnosis, i) => (
                              <Badge key={i} variant="outline">
                                {diagnosis}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Diagnostic Criteria */}
                  {report.extracted_data.clinical_context.diagnostic_criteria &&
                    report.extracted_data.clinical_context.diagnostic_criteria.length > 0 && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Diagnostic Criteria
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          {report.extracted_data.clinical_context.diagnostic_criteria.map(
                            (criteria, i) => (
                              <li key={i}>{criteria}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Additional Notes */}
                  {report.extracted_data.clinical_context.additional_notes && (
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground italic">
                        {report.extracted_data.clinical_context.additional_notes}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Report Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
                Report Information
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hospital</p>
                    <p className="font-medium text-foreground">
                      {report.metadata_extracted?.hospital_name ||
                        report.hospital_name ||
                        'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-medium text-foreground">
                      {report.metadata_extracted?.doctor_name ||
                        report.doctor_name ||
                        'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Report Date</p>
                    <p className="font-medium text-foreground">
                      {formatDate(report.report_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uploaded</p>
                    <p className="font-medium text-foreground">
                      {formatDateTime(report.uploaded_at)}
                    </p>
                  </div>
                </div>

                {report.metadata_extracted?.patient_name && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Patient</p>
                      <p className="font-medium text-foreground">
                        {report.metadata_extracted.patient_name}
                        {report.metadata_extracted.patient_age &&
                          `, ${report.metadata_extracted.patient_age} yrs`}
                        {report.metadata_extracted.patient_gender &&
                          ` (${report.metadata_extracted.patient_gender})`}
                      </p>
                    </div>
                  </div>
                )}

                {report.ocr_confidence_score && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">OCR Confidence</p>
                      <p className="font-medium text-foreground">
                        {report.ocr_confidence_score.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}

                {report.extraction_confidence && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Extraction Quality</p>
                      <p
                        className={`font-medium capitalize ${
                          report.extraction_confidence === 'high'
                            ? 'text-success'
                            : report.extraction_confidence === 'medium'
                            ? 'text-warning'
                            : 'text-error'
                        }`}
                      >
                        {report.extraction_confidence}
                      </p>
                    </div>
                  </div>
                )}

                {report.original_filename && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Original File</p>
                      <p className="font-medium text-foreground truncate max-w-[200px]">
                        {report.original_filename}
                      </p>
                      {report.file_size_bytes && (
                        <p className="text-xs text-muted-foreground">
                          {(report.file_size_bytes / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
