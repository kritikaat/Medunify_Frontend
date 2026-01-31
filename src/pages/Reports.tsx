import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  FileText,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Building2,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { listReports, getReportTypeDisplayName, getReportById } from '@/lib/api/reports';
import { downloadReportAsJson, downloadMultipleReports, downloadReportSummary, downloadReportAsPdf } from '@/lib/api/download';
import type { ReportListItem, ReportType } from '@/types/api';
import { format, parseISO, isWithinInterval, subDays, subMonths, subYears } from 'date-fns';
import { toast } from 'sonner';

// Dummy reports data (fallback when API fails)
const DUMMY_REPORTS: ReportListItem[] = [
  {
    id: 'report-1',
    hospital_name: 'City General Hospital',
    doctor_name: 'Dr. Rajesh Kumar',
    report_date: '2026-01-15',
    report_type: 'lab_report',
    document_type: 'BLOOD_TEST',
    processing_status: 'completed',
    extraction_confidence: 'high',
    patient_friendly_summary: 'Your blood test results show normal values for most parameters. HbA1c is slightly elevated at 6.5%, indicating pre-diabetic range.',
    clinical_summary: 'CBC within normal limits. HbA1c 6.5% (pre-diabetic). Lipid panel: TC 185 mg/dL, LDL 110 mg/dL.',
    key_findings: [
      { finding: 'HbA1c elevated (6.5%)', severity: 'medium', action_needed: 'Monitor blood sugar, consider lifestyle changes' },
      { finding: 'Cholesterol within normal range', severity: 'low', action_needed: 'Continue current diet' },
    ],
    uploaded_at: '2026-01-15T10:30:00Z',
  },
  {
    id: 'report-2',
    hospital_name: 'Metro Health Center',
    doctor_name: 'Dr. Priya Sharma',
    report_date: '2026-01-10',
    report_type: 'lab_report',
    document_type: 'BLOOD_TEST',
    processing_status: 'completed',
    extraction_confidence: 'high',
    patient_friendly_summary: 'Complete blood count shows all values within normal range. Good overall health indicators.',
    clinical_summary: 'CBC normal. Hemoglobin 14.2 g/dL, WBC 7500/µL, Platelets 250000/µL.',
    key_findings: [
      { finding: 'All parameters normal', severity: 'low', action_needed: 'Routine follow-up in 6 months' },
    ],
    uploaded_at: '2026-01-10T09:15:00Z',
  },
  {
    id: 'report-3',
    hospital_name: 'University Medical',
    doctor_name: 'Dr. Amit Singh',
    report_date: '2025-12-20',
    report_type: 'imaging_report',
    document_type: 'X_RAY',
    processing_status: 'completed',
    extraction_confidence: 'medium',
    patient_friendly_summary: 'Chest X-ray shows clear lung fields with no abnormalities detected.',
    clinical_summary: 'PA view chest radiograph: Clear lung fields, normal cardiac silhouette, no pleural effusion.',
    key_findings: [
      { finding: 'Normal chest X-ray', severity: 'low', action_needed: 'No follow-up needed' },
    ],
    uploaded_at: '2025-12-20T14:45:00Z',
  },
  {
    id: 'report-4',
    hospital_name: 'City General Hospital',
    doctor_name: 'Dr. Kavita Menon',
    report_date: '2025-12-05',
    report_type: 'lab_report',
    document_type: 'KIDNEY_FUNCTION',
    processing_status: 'completed',
    extraction_confidence: 'high',
    patient_friendly_summary: 'Kidney function tests show slightly elevated creatinine levels. Recommend increased water intake and follow-up.',
    clinical_summary: 'Creatinine 1.4 mg/dL (elevated), BUN 22 mg/dL, eGFR 65 mL/min/1.73m².',
    key_findings: [
      { finding: 'Creatinine elevated (1.4 mg/dL)', severity: 'medium', action_needed: 'Increase hydration, retest in 3 months' },
      { finding: 'eGFR mildly reduced', severity: 'medium', action_needed: 'Monitor kidney function' },
    ],
    uploaded_at: '2025-12-05T11:20:00Z',
  },
  {
    id: 'report-5',
    hospital_name: 'Downtown Clinic',
    doctor_name: 'Dr. Suresh Reddy',
    report_date: '2025-11-15',
    report_type: 'prescription',
    document_type: 'PRESCRIPTION',
    processing_status: 'completed',
    extraction_confidence: 'high',
    patient_friendly_summary: 'Prescription for diabetes management and blood pressure control.',
    clinical_summary: 'Metformin 500mg BD, Amlodipine 5mg OD prescribed.',
    key_findings: [],
    uploaded_at: '2025-11-15T16:30:00Z',
  },
];

const hospitals = ['City General Hospital', 'Metro Health Center', 'University Medical', 'Downtown Clinic'];
const types: { value: ReportType; label: string }[] = [
  { value: 'lab_report', label: 'Lab Report' },
  { value: 'imaging_report', label: 'Imaging Report' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
];
const statuses = ['All', 'Normal', 'Abnormal', 'Critical'];
const dateFilters = ['Last 7 days', 'Last month', 'Last 3 months', 'Last year', 'All time'];

export default function Reports() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    date: 'All time',
    hospitals: [] as string[],
    types: [] as ReportType[],
    status: 'All',
  });

  // API state
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if using dummy data
  const [usingDummyData, setUsingDummyData] = useState(false);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    setUsingDummyData(false);
    
    try {
      const data = await listReports({ limit: 100 });
      setReports(data);
    } catch (err) {
      // Get error details
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const errorDetails = (err as any)?.status ? `Status: ${(err as any).status}` : '';
      
      console.error('❌ Reports API Error:', {
        message: errorMessage,
        status: (err as any)?.status,
        fullError: err,
      });
      
      // Show error toast with details
      toast.error(`API Error: ${errorMessage}`, {
        description: errorDetails || 'Check console for details. Using demo data.',
        duration: 5000,
      });
      
      // Fallback to dummy data
      setReports(DUMMY_REPORTS);
      setUsingDummyData(true);
      setError(errorMessage); // Keep error for display
    } finally {
      setIsLoading(false);
    }
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        report.hospital_name?.toLowerCase().includes(query) ||
        report.doctor_name?.toLowerCase().includes(query) ||
        report.patient_friendly_summary?.toLowerCase().includes(query) ||
        report.key_findings?.some(f => f.finding.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Hospital filter
    if (filters.hospitals.length > 0 && report.hospital_name) {
      if (!filters.hospitals.includes(report.hospital_name)) return false;
    }

    // Type filter
    if (filters.types.length > 0) {
      if (!filters.types.includes(report.report_type)) return false;
    }

    // Status filter
    if (filters.status !== 'All') {
      const reportStatus = getReportStatus(report);
      if (filters.status.toLowerCase() !== reportStatus) return false;
    }

    // Date filter
    if (filters.date !== 'All time') {
      const reportDate = parseISO(report.uploaded_at);
      const now = new Date();
      let startDate: Date;

      switch (filters.date) {
        case 'Last 7 days':
          startDate = subDays(now, 7);
          break;
        case 'Last month':
          startDate = subMonths(now, 1);
          break;
        case 'Last 3 months':
          startDate = subMonths(now, 3);
          break;
        case 'Last year':
          startDate = subYears(now, 1);
          break;
        default:
          return true;
      }

      if (!isWithinInterval(reportDate, { start: startDate, end: now })) {
        return false;
      }
    }

    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedReports(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleFilter = (category: 'hospitals' | 'types', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value as never)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value],
    }));
  };

  // Determine report status from key_findings
  const getReportStatus = (report: ReportListItem): string => {
    if (!report.key_findings || report.key_findings.length === 0) {
      return 'normal';
    }
    
    const hasCritical = report.key_findings.some(f => f.severity === 'high' || f.severity === 'critical');
    const hasWarning = report.key_findings.some(f => f.severity === 'medium');
    
    if (hasCritical) return 'critical';
    if (hasWarning) return 'warning';
    return 'normal';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'critical':
        return <AlertOctagon className="w-4 h-4 text-error pulse-critical" />;
      default:
        return null;
    }
  };

  const getStatusBgClass = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'critical':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // Download a single report as PDF
  const handleSingleDownload = async (reportId: string) => {
    try {
      toast.loading('Generating PDF...', { id: 'download' });
      const fullReport = await getReportById(reportId);
      downloadReportAsPdf(fullReport);
      toast.success('PDF downloaded!', { id: 'download' });
    } catch (err) {
      toast.error('Failed to download report', { id: 'download' });
      console.error('Download error:', err);
    }
  };

  // Download multiple selected reports
  const handleBulkDownload = async () => {
    if (selectedReports.length === 0) return;
    
    try {
      toast.loading(`Downloading ${selectedReports.length} reports...`, { id: 'bulk-download' });
      
      // Fetch full details for all selected reports
      const fullReports = await Promise.all(
        selectedReports.map(id => getReportById(id))
      );
      
      downloadMultipleReports(fullReports);
      toast.success(`${selectedReports.length} reports downloaded!`, { id: 'bulk-download' });
      setSelectedReports([]);
    } catch (err) {
      toast.error('Failed to download reports', { id: 'bulk-download' });
      console.error('Bulk download error:', err);
    }
  };

  // Get unique hospitals from reports
  const uniqueHospitals = [...new Set(reports.map(r => r.hospital_name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="flex items-start gap-6">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`w-64 bg-card rounded-2xl border border-border p-6 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-foreground">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ date: 'All time', hospitals: [], types: [], status: 'All' })}
                >
                  Clear All
                </Button>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </h4>
                <div className="space-y-2">
                  {dateFilters.map((date) => (
                    <label key={date} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="date"
                        checked={filters.date === date}
                        onChange={() => setFilters(prev => ({ ...prev, date }))}
                        className="accent-primary"
                      />
                      <span className="text-sm text-muted-foreground">{date}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hospitals */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Hospital
                </h4>
                <div className="space-y-2">
                  {(uniqueHospitals.length > 0 ? uniqueHospitals : hospitals).map((hospital) => (
                    <label key={hospital} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.hospitals.includes(hospital)}
                        onCheckedChange={() => toggleFilter('hospitals', hospital)}
                      />
                      <span className="text-sm text-muted-foreground truncate">{hospital}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Report Type */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Report Type
                </h4>
                <div className="space-y-2">
                  {types.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.types.includes(type.value)}
                        onCheckedChange={() => toggleFilter('types', type.value)}
                      />
                      <span className="text-sm text-muted-foreground">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilters(prev => ({ ...prev, status }))}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        filters.status === status
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Bar */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search reports, tests, hospitals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchReports}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>

                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                <div className="flex items-center border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Bulk Actions */}
              {selectedReports.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 mb-6 p-4 bg-primary/10 rounded-xl"
                >
                  <span className="text-sm font-medium text-foreground">
                    {selectedReports.length} selected
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkDownload()}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="text-error hover:text-error">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedReports([])}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </motion.div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              )}

              {/* API Error Banner (shows when using dummy data) */}
              {usingDummyData && error && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">API Connection Failed</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Error:</strong> {error}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Showing demo data. Check browser console (F12) for full error details.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchReports}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Retry
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Old Error State - only show if NO fallback data */}
              {error && !usingDummyData && !isLoading && (
                <div className="text-center py-12">
                  <AlertOctagon className="w-12 h-12 text-error mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    Failed to load reports
                  </h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button variant="outline" onClick={fetchReports}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    No reports found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filters.hospitals.length > 0 || filters.types.length > 0 || filters.status !== 'All'
                      ? 'Try adjusting your filters'
                      : 'Upload your first medical report to get started'}
                  </p>
                  <Button variant="hero" asChild>
                    <Link to="/upload">Upload Report</Link>
                  </Button>
                </div>
              )}

              {/* Reports Grid/List */}
              {!isLoading && !error && filteredReports.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}
                >
                  {filteredReports.map((report, i) => {
                    const status = getReportStatus(report);
                    return (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-green-sm transition-all ${
                          viewMode === 'list' ? 'flex items-center' : ''
                        }`}
                      >
                        {/* Status Bar */}
                        <div
                          className={`h-1 w-full ${getStatusBgClass(status)} ${viewMode === 'list' ? 'hidden' : ''}`}
                        />

                        <div className={`p-4 ${viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}`}>
                          {/* Checkbox */}
                          <Checkbox
                            checked={selectedReports.includes(report.id)}
                            onCheckedChange={() => toggleSelect(report.id)}
                            className={viewMode === 'list' ? '' : 'absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'}
                          />

                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            status === 'normal' ? 'bg-success/10' :
                            status === 'warning' ? 'bg-warning/10' : 'bg-error/10'
                          } ${viewMode === 'grid' ? 'mb-3' : ''}`}>
                            <FileText className={`w-5 h-5 ${
                              status === 'normal' ? 'text-success' :
                              status === 'warning' ? 'text-warning' : 'text-error'
                            }`} />
                          </div>

                          {/* Content */}
                          <div className={viewMode === 'list' ? 'flex-1' : ''}>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground truncate">
                                {report.hospital_name || 'Unknown Hospital'}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {getReportTypeDisplayName(report.report_type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {formatDate(report.report_date || report.uploaded_at)}
                            </p>
                            
                            {viewMode === 'grid' && report.key_findings && (
                              <div className="space-y-1">
                                {report.key_findings.slice(0, 2).map((finding, j) => (
                                  <div key={j} className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {getStatusIcon(status)}
                                    <span className="truncate">{finding.finding}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {viewMode === 'grid' && report.patient_friendly_summary && !report.key_findings?.length && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {report.patient_friendly_summary}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className={`flex items-center gap-1 ${
                            viewMode === 'grid' ? 'mt-4 pt-4 border-t border-border' : ''
                          } ${viewMode === 'list' ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/reports/${report.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSingleDownload(report.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-error hover:text-error">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
