import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Upload as UploadIcon,
  FileText,
  Camera,
  CheckCircle,
  AlertTriangle,
  Brain,
  ArrowRight,
  X,
  Loader2,
  AlertOctagon,
  Stethoscope,
  User,
  Download,
  FileJson,
  FileSpreadsheet,
  FileType,
  File,
} from 'lucide-react';
import { uploadReport, reprocessReport, getReportTypeDisplayName } from '@/lib/api/reports';
import { downloadReportSummary, downloadReportAsJson, downloadReportAsCsv, downloadReportAsPdf } from '@/lib/api/download';
import type { Report, ReportType, ExtractedValue } from '@/types/api';

type UploadState = 'idle' | 'uploading' | 'processing' | 'review' | 'success' | 'error';

const processingSteps = [
  { label: 'Uploading file', icon: UploadIcon },
  { label: 'Extracting text (OCR)', icon: FileText },
  { label: 'Identifying medical entities', icon: Brain },
  { label: 'Normalizing values', icon: CheckCircle },
  { label: 'Detecting abnormalities', icon: AlertTriangle },
];

export default function Upload() {
  const navigate = useNavigate();
  const [state, setState] = useState<UploadState>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedReport, setUploadedReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [hospitalName, setHospitalName] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState<ReportType>('lab_report');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setError(null);
    setState('uploading');
    setCurrentStep(0);

    // Simulate step progression for UX
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    try {
      setState('processing');
      
      const report = await uploadReport({
        file: selectedFile,
        hospital_name: hospitalName || undefined,
        report_date: reportDate,
        report_type: reportType,
        process_sync: true,
      });

      clearInterval(stepInterval);
      setCurrentStep(processingSteps.length);
      setUploadedReport(report);
      
      // Short delay before showing review
      setTimeout(() => setState('review'), 500);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : 'Failed to upload report');
      setState('error');
    }
  };

  const handleReprocess = async () => {
    if (!uploadedReport) return;

    setError(null);
    setState('processing');
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, processingSteps.length - 1));
    }, 1500);

    try {
      const report = await reprocessReport(uploadedReport.id);
      clearInterval(stepInterval);
      setCurrentStep(processingSteps.length);
      setUploadedReport(report);
      setTimeout(() => setState('review'), 500);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : 'Failed to reprocess report');
      setState('error');
    }
  };

  const handleConfirm = () => {
    setState('success');
  };

  const handleReset = () => {
    setState('idle');
    setCurrentStep(0);
    setSelectedFile(null);
    setUploadedReport(null);
    setError(null);
    setHospitalName('');
    setReportDate(new Date().toISOString().split('T')[0]);
    setReportType('lab_report');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success"><CheckCircle className="w-3 h-3" /> Normal</span>;
      case 'warning':
      case 'abnormal':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning"><AlertTriangle className="w-3 h-3" /> Abnormal</span>;
      case 'critical':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error"><AlertOctagon className="w-3 h-3" /> Critical</span>;
      default:
        return null;
    }
  };

  // Get extracted values from report
  const extractedValues: ExtractedValue[] = uploadedReport?.extracted_values || [];

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                Upload Medical Report
              </h1>
              <p className="text-muted-foreground">
                Upload your medical reports for AI-powered analysis and interpretation
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                      dragActive
                        ? 'border-primary bg-primary/5'
                        : selectedFile
                        ? 'border-success bg-success/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {selectedFile ? (
                      <>
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-success/10 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-success" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                          {selectedFile.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <UploadIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                          Drag your report here or click to browse
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Supports PDF, JPG, PNG (max 10MB)
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <Button variant="hero">
                            <UploadIcon className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                          <Button variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            Use Camera
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Report Details Form */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                      Report Details
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Hospital Name (Optional)</Label>
                        <Input 
                          placeholder="Enter hospital name"
                          value={hospitalName}
                          onChange={(e) => setHospitalName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Report Date *</Label>
                        <Input 
                          type="date" 
                          value={reportDate}
                          onChange={(e) => setReportDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Report Type *</Label>
                        <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lab_report">Lab Report</SelectItem>
                            <SelectItem value="imaging_report">Imaging Report</SelectItem>
                            <SelectItem value="prescription">Prescription</SelectItem>
                            <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        variant="hero" 
                        onClick={handleUpload}
                        disabled={!selectedFile}
                      >
                        <UploadIcon className="w-4 h-4 mr-2" />
                        Upload & Analyze
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {(state === 'uploading' || state === 'processing') && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-2xl border border-border p-8"
                >
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      Processing your report...
                    </h3>
                    <p className="text-muted-foreground">
                      This may take 30-60 seconds
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-4">
                    {processingSteps.map((step, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                          i < currentStep
                            ? 'bg-success/10'
                            : i === currentStep
                            ? 'bg-primary/10'
                            : 'bg-muted/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          i < currentStep
                            ? 'bg-success text-success-foreground'
                            : i === currentStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {i < currentStep ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : i === currentStep ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <step.icon className="w-5 h-5" />
                          )}
                        </div>
                        <span className={`font-medium ${
                          i <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </span>
                        {i < currentStep && (
                          <CheckCircle className="w-5 h-5 text-success ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {state === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-2xl border border-error/30 p-12 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
                    <AlertOctagon className="w-10 h-10 text-error" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Upload Failed
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    {error || 'An unexpected error occurred'}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="hero" onClick={handleReset}>
                      Try Again
                    </Button>
                  </div>
                </motion.div>
              )}

              {state === 'review' && uploadedReport && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Summaries Section */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Patient-Friendly Summary */}
                    {uploadedReport.patient_friendly_summary && (
                      <div className="bg-card rounded-2xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-semibold text-foreground">
                              Patient Summary
                            </h3>
                            <p className="text-xs text-muted-foreground">Easy to understand</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {uploadedReport.patient_friendly_summary}
                        </p>
                      </div>
                    )}

                    {/* Clinical Summary */}
                    {uploadedReport.clinical_summary && (
                      <div className="bg-card rounded-2xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-semibold text-foreground">
                              Clinical Summary
                            </h3>
                            <p className="text-xs text-muted-foreground">For healthcare providers</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {uploadedReport.clinical_summary}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Key Findings */}
                  {uploadedReport.key_findings && uploadedReport.key_findings.length > 0 && (
                    <div className="bg-card rounded-2xl border border-border p-6">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                        Key Findings
                      </h3>
                      <div className="space-y-3">
                        {uploadedReport.key_findings.map((finding, i) => (
                          <div 
                            key={i} 
                            className={`p-4 rounded-xl ${
                              finding.severity === 'low' ? 'bg-success/5 border border-success/20' :
                              finding.severity === 'medium' ? 'bg-warning/5 border border-warning/20' :
                              'bg-error/5 border border-error/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                finding.severity === 'low' ? 'bg-success/10' :
                                finding.severity === 'medium' ? 'bg-warning/10' :
                                'bg-error/10'
                              }`}>
                                {finding.severity === 'low' ? (
                                  <CheckCircle className="w-4 h-4 text-success" />
                                ) : finding.severity === 'medium' ? (
                                  <AlertTriangle className="w-4 h-4 text-warning" />
                                ) : (
                                  <AlertOctagon className="w-4 h-4 text-error" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{finding.finding}</p>
                                {finding.action_needed && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    <span className="font-medium">Recommended:</span> {finding.action_needed}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Data Table */}
                  {extractedValues.length > 0 && (
                    <div className="bg-card rounded-2xl border border-border overflow-hidden">
                      <div className="p-6 border-b border-border">
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          Extracted Test Results
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Values extracted from your report with confidence scores
                        </p>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Test Name</th>
                              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Value</th>
                              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Unit</th>
                              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Reference</th>
                              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Confidence</th>
                              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {extractedValues.map((row, i) => (
                              <tr
                                key={i}
                                className={`border-t border-border ${
                                  row.confidence_score < 85 ? 'bg-warning/5' : ''
                                }`}
                              >
                                <td className="px-6 py-4">
                                  <div>
                                    <p className="font-medium text-foreground">{row.test_name}</p>
                                    {row.standard_test_name && row.standard_test_name !== row.test_name && (
                                      <p className="text-xs text-muted-foreground">{row.standard_test_name}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-foreground font-mono">
                                  {row.value_numeric ?? row.value_text}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{row.unit || '-'}</td>
                                <td className="px-6 py-4 text-muted-foreground">
                                  {row.reference_text || 
                                   (row.reference_min !== null && row.reference_max !== null 
                                     ? `${row.reference_min} - ${row.reference_max}` 
                                     : '-')}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-16">
                                      <div
                                        className={`h-full rounded-full ${
                                          row.confidence_score >= 90 ? 'bg-success' :
                                          row.confidence_score >= 80 ? 'bg-warning' : 'bg-error'
                                        }`}
                                        style={{ width: `${row.confidence_score}%` }}
                                      />
                                    </div>
                                    <span className="text-sm text-muted-foreground">{row.confidence_score}%</span>
                                    {row.confidence_score < 85 && (
                                      <AlertTriangle className="w-4 h-4 text-warning" />
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {getStatusBadge(row.status)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Report Metadata */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                      Report Details
                    </h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Hospital</p>
                        <p className="font-medium text-foreground">
                          {uploadedReport.metadata_extracted?.hospital_name || uploadedReport.hospital_name || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Doctor</p>
                        <p className="font-medium text-foreground">
                          {uploadedReport.metadata_extracted?.doctor_name || uploadedReport.doctor_name || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Report Date</p>
                        <p className="font-medium text-foreground">
                          {uploadedReport.report_date}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Report Type</p>
                        <p className="font-medium text-foreground">
                          {getReportTypeDisplayName(uploadedReport.report_type)}
                        </p>
                      </div>
                      {uploadedReport.metadata_extracted?.patient_name && (
                        <div>
                          <p className="text-sm text-muted-foreground">Patient Name</p>
                          <p className="font-medium text-foreground">
                            {uploadedReport.metadata_extracted.patient_name}
                          </p>
                        </div>
                      )}
                      {uploadedReport.metadata_extracted?.patient_age && (
                        <div>
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p className="font-medium text-foreground">
                            {uploadedReport.metadata_extracted.patient_age} years
                          </p>
                        </div>
                      )}
                      {uploadedReport.ocr_confidence_score && (
                        <div>
                          <p className="text-sm text-muted-foreground">OCR Confidence</p>
                          <p className="font-medium text-foreground">
                            {uploadedReport.ocr_confidence_score.toFixed(1)}%
                          </p>
                        </div>
                      )}
                      {uploadedReport.extraction_confidence && (
                        <div>
                          <p className="text-sm text-muted-foreground">Extraction Quality</p>
                          <p className={`font-medium capitalize ${
                            uploadedReport.extraction_confidence === 'high' ? 'text-success' :
                            uploadedReport.extraction_confidence === 'medium' ? 'text-warning' :
                            'text-error'
                          }`}>
                            {uploadedReport.extraction_confidence}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4">
                    <Button variant="outline" onClick={handleReset}>
                      Cancel
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => downloadReportAsPdf(uploadedReport)}>
                          <File className="w-4 h-4 mr-2" />
                          PDF Report (.pdf)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadReportSummary(uploadedReport)}>
                          <FileType className="w-4 h-4 mr-2" />
                          Summary (.txt)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => downloadReportAsJson(uploadedReport)}>
                          <FileJson className="w-4 h-4 mr-2" />
                          Full Report (.json)
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => downloadReportAsCsv(uploadedReport)}
                          disabled={!uploadedReport.extracted_values?.length}
                        >
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Test Results (.csv)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" onClick={handleReprocess}>
                      Re-process
                    </Button>
                    <Button variant="hero" onClick={handleConfirm}>
                      Confirm & Add to Timeline
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {state === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-2xl border border-border p-12 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Report Added Successfully!
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Your medical report has been processed and added to your timeline
                  </p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Button variant="hero" onClick={() => navigate('/timeline')}>
                      View on Timeline
                    </Button>
                    <Button variant="outline" onClick={() => navigate(`/reports/${uploadedReport?.id}`)}>
                      View Report Details
                    </Button>
                    {uploadedReport && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          <DropdownMenuItem onClick={() => downloadReportAsPdf(uploadedReport)}>
                            <File className="w-4 h-4 mr-2" />
                            PDF Report (.pdf)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadReportSummary(uploadedReport)}>
                            <FileType className="w-4 h-4 mr-2" />
                            Summary (.txt)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => downloadReportAsJson(uploadedReport)}>
                            <FileJson className="w-4 h-4 mr-2" />
                            Full Report (.json)
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => downloadReportAsCsv(uploadedReport)}
                            disabled={!uploadedReport.extracted_values?.length}
                          >
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Test Results (.csv)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button variant="outline" onClick={handleReset}>
                      Upload Another
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
