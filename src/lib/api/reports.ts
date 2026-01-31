import { API_ENDPOINTS } from './config';
import { get, post, apiClientFormData } from './client';
import type { 
  Report, 
  ReportListItem, 
  ListReportsParams, 
  UploadReportRequest,
  ReportType 
} from '@/types/api';

// Upload a medical report
export async function uploadReport(request: UploadReportRequest): Promise<Report> {
  const formData = new FormData();
  
  formData.append('file', request.file);
  formData.append('report_date', request.report_date);
  formData.append('report_type', request.report_type);
  
  if (request.hospital_name) {
    formData.append('hospital_name', request.hospital_name);
  }
  
  if (request.process_sync !== undefined) {
    formData.append('process_sync', String(request.process_sync));
  }

  return apiClientFormData<Report>(API_ENDPOINTS.UPLOAD_REPORT, formData);
}

// Get a single report by ID
export async function getReportById(reportId: string): Promise<Report> {
  return get<Report>(API_ENDPOINTS.REPORT_BY_ID(reportId));
}

// List all reports for the current user
export async function listReports(params: ListReportsParams = {}): Promise<ReportListItem[]> {
  return get<ReportListItem[]>(API_ENDPOINTS.REPORTS, {
    skip: params.skip,
    limit: params.limit,
    report_type: params.report_type,
    start_date: params.start_date,
    end_date: params.end_date,
  });
}

// Reprocess an existing report
export async function reprocessReport(reportId: string): Promise<Report> {
  return post<Report>(API_ENDPOINTS.REPROCESS_REPORT(reportId));
}

// Helper function to get report type display name
export function getReportTypeDisplayName(type: ReportType): string {
  const displayNames: Record<ReportType, string> = {
    lab_report: 'Lab Report',
    imaging_report: 'Imaging Report',
    prescription: 'Prescription',
    discharge_summary: 'Discharge Summary',
    other: 'Other',
  };
  return displayNames[type] || type;
}

// Helper function to get status color class
export function getStatusColor(status: string): string {
  switch (status) {
    case 'normal':
      return 'success';
    case 'warning':
    case 'abnormal':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'muted';
  }
}

// Helper to map processing status to UI-friendly text
export function getProcessingStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing...',
    completed: 'Completed',
    failed: 'Failed',
  };
  return statusMap[status] || status;
}
