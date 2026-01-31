// ==========================================
// Authentication Types
// ==========================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ==========================================
// User Roles
// ==========================================

export type UserRole = 'patient' | 'doctor' | 'hospital';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // Doctor-specific fields
  hospital_id?: string;
  hospital_name?: string;
  specialization?: string;
  qualification?: string;
  experience_years?: number;
  license_number?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
}

// ==========================================
// Report Types
// ==========================================

export interface KeyFinding {
  finding: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action_needed: string;
}

export interface DiseaseInformation {
  overview: string;
  transmission?: string;
  serotypes_variants?: string;
  classification?: string;
  complications?: string;
}

export interface TestInterpretation {
  timing_guidelines?: string;
  antibody_kinetics?: string;
  result_patterns?: {
    primary_infection?: string;
    secondary_infection?: string;
    other_patterns?: string;
  };
}

export interface Limitations {
  cross_reactivity?: string;
  false_positives?: string;
  false_negatives?: string | null;
  technical_limitations?: string | null;
}

export interface ClinicalContext {
  disease_information?: DiseaseInformation;
  test_interpretation?: TestInterpretation;
  diagnostic_criteria?: string[];
  limitations?: Limitations;
  differential_diagnoses?: string[];
  additional_notes?: string;
}

export interface TestResult {
  name: string;
  standard_name: string;
  value: string;
  value_numeric: number | null;
  unit: string | null;
  reference_range: string | null;
  reference_min: number | null;
  reference_max: number | null;
  status: 'normal' | 'warning' | 'critical' | 'abnormal';
  category: string;
}

export interface ExtractedData {
  tests: TestResult[];
  clinical_context?: ClinicalContext;
}

export interface ExtractedMetadata {
  hospital_name?: string;
  doctor_name?: string;
  report_date?: string;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  report_id?: string;
}

export interface ExtractedValue {
  id: string;
  test_name: string;
  standard_test_name: string;
  loinc_code: string | null;
  category: string;
  value_numeric: number | null;
  value_text: string;
  unit: string | null;
  reference_min: number | null;
  reference_max: number | null;
  reference_text: string | null;
  status: 'normal' | 'warning' | 'critical' | 'abnormal';
  abnormality_type: string | null;
  confidence_score: number;
  manually_verified: boolean;
  test_date: string;
}

export interface Report {
  id: string;
  user_id: string;
  hospital_name: string;
  doctor_name?: string;
  report_date: string;
  report_type: ReportType;
  document_type?: string;
  original_filename?: string;
  file_type?: string;
  file_size_bytes?: number;
  processing_status: ProcessingStatus;
  ocr_confidence_score?: number;
  extraction_confidence?: 'low' | 'medium' | 'high';
  patient_friendly_summary?: string;
  clinical_summary?: string;
  key_findings?: KeyFinding[];
  extracted_data?: ExtractedData;
  metadata_extracted?: ExtractedMetadata;
  extraction_issues?: string[];
  uploaded_at: string;
  processed_at?: string;
  extracted_values?: ExtractedValue[];
}

export type ReportType = 
  | 'lab_report' 
  | 'imaging_report' 
  | 'prescription' 
  | 'discharge_summary'
  | 'other';

export type ProcessingStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed';

// ==========================================
// Upload Types
// ==========================================

export interface UploadReportRequest {
  file: File;
  hospital_name?: string;
  report_date: string;
  report_type: ReportType;
  process_sync?: boolean;
}

// ==========================================
// List Reports Types
// ==========================================

export interface ListReportsParams {
  skip?: number;
  limit?: number;
  report_type?: ReportType;
  start_date?: string;
  end_date?: string;
}

// ==========================================
// Report List Item (lighter version for list view)
// ==========================================

export interface ReportListItem {
  id: string;
  hospital_name: string;
  doctor_name?: string;
  report_date: string;
  report_type: ReportType;
  document_type?: string;
  processing_status: ProcessingStatus;
  extraction_confidence?: 'low' | 'medium' | 'high';
  patient_friendly_summary?: string;
  clinical_summary?: string;
  key_findings?: KeyFinding[];
  uploaded_at: string;
}

// ==========================================
// API Error Types
// ==========================================

export interface ApiError {
  detail: string;
  status_code?: number;
}
