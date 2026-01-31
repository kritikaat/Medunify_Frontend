// ==========================================
// Share Types - Both UI Types and API Types
// ==========================================

// ==========================================
// UI Types for Patient Sharing (used by Share.tsx)
// ==========================================

// Doctor profile for patient browsing
export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  hospital_id: string;
  hospital_name: string;
  qualification?: string;
  experience_years?: number;
  bio?: string;
  is_verified: boolean;
  avatar_url?: string;
  city?: string;
}

// Hospital profile for patient browsing
export interface HospitalProfile {
  id: string;
  name: string;
  city?: string;
  state?: string;
  logo_url?: string;
  doctors_count?: number;
}

// Shareable content types
export type ShareableContent = 
  | 'timeline'
  | 'lab_reports'
  | 'prescriptions'
  | 'radiology'
  | 'assessment'
  | 'profile';

// Date range options
export type ShareDateRange = 
  | '3-months'
  | '6-months'
  | '1-year'
  | 'all'
  | 'custom';

// Active share record
export interface ActiveShare {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  doctor_email: string;
  hospital_name: string;
  specialization: string;
  shared_content: ShareableContent[];
  date_range: ShareDateRange;
  date_from?: string;
  date_to?: string;
  expires_at: string;
  created_at: string;
  access_count: number;
  is_active: boolean;
}

// ==========================================
// UI Constants (used by Share.tsx, Doctors.tsx)
// ==========================================

export const SHARE_CONTENT_OPTIONS: { id: ShareableContent; label: string; description: string }[] = [
  { id: 'timeline', label: 'Health Timeline', description: 'Biomarker trends and graphs' },
  { id: 'lab_reports', label: 'Lab Reports', description: 'Blood tests and other lab work' },
  { id: 'prescriptions', label: 'Prescriptions', description: 'Medication history' },
  { id: 'radiology', label: 'Imaging', description: 'X-rays, MRI, CT scans' },
  { id: 'assessment', label: 'Assessments', description: 'AI health assessment results' },
  { id: 'profile', label: 'Basic Profile', description: 'Name, age, blood group, allergies' },
];

export const DATE_RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: '3-months', label: 'Last 3 Months' },
  { value: '6-months', label: 'Last 6 Months' },
  { value: '1-year', label: 'Last 1 Year' },
  { value: 'all', label: 'All Time' },
  { value: 'custom', label: 'Custom Range' },
];

export const EXPIRY_OPTIONS: { value: number; label: string }[] = [
  { value: 7, label: '1 Week' },
  { value: 14, label: '2 Weeks' },
  { value: 30, label: '1 Month' },
  { value: 90, label: '3 Months' },
  { value: 180, label: '6 Months' },
  { value: 365, label: '1 Year' },
];

// ==========================================
// API Types for Link-based Sharing
// Based on Backend API Documentation
// ==========================================

export type ShareAccessType = 'public' | 'password' | 'email_restricted';
export type SharePermission = 'view' | 'download' | 'print';

export interface ShareConfig {
  include_reports: string[]; // Report types to include
  include_timeline: boolean;
  include_patient_summary: boolean;
  include_clinical_summary: boolean;
  include_assessment_results: boolean;
  date_range_start?: string;
  date_range_end?: string;
  permissions: SharePermission[];
}

// Create Share Link Request
export interface CreateShareRequest {
  config: ShareConfig;
  access_type: ShareAccessType;
  password?: string;
  allowed_emails?: string[];
  expires_in_days?: number;
}

// Share Link Response
export interface ShareLink {
  id: string;
  share_id: string;
  share_url: string;
  qr_code_base64?: string;
  config: ShareConfig;
  access_type: ShareAccessType;
  expires_at: string;
  access_count: number;
  is_active: boolean;
  created_at: string;
  last_accessed_at?: string;
}

// Update Share Request
export interface UpdateShareRequest {
  config?: Partial<ShareConfig>;
  expires_in_days?: number;
  is_active?: boolean;
}

// Shared Timeline Data (for public view)
export interface SharedTimelineData {
  biomarker_name: string;
  unit: string;
  data_points: {
    date: string;
    value: number;
    status: string;
  }[];
  latest_value: number;
  trend_direction: 'increasing' | 'decreasing' | 'stable';
  normal_range: {
    min?: number;
    max?: number;
  };
}

// Shared Timeline Insight
export interface SharedTimelineInsight {
  biomarker: string;
  type: string;
  title: string;
  trend: string;
}

// Shared Assessment Result
export interface SharedAssessmentResult {
  completed_at: string;
  symptoms: string[];
  conditions: {
    name: string;
    confidence: number;
  }[];
  summary: string;
  recommended_tests: string[];
}

// Shared Report
export interface SharedReport {
  id: string;
  hospital_name: string;
  report_date: string;
  report_type: string;
  patient_friendly_summary?: string;
  clinical_summary?: string;
}

// Shared Profile View Response
export interface SharedProfileView {
  patient_name: string;
  patient_age?: number;
  patient_gender?: string;
  patient_blood_group?: string;
  reports: SharedReport[];
  timeline_data: SharedTimelineData[];
  timeline_insights: SharedTimelineInsight[];
  assessment_results?: SharedAssessmentResult;
  shared_at: string;
  share_config: ShareConfig;
}

// Emergency Profile
export interface EmergencyProfile {
  name: string;
  blood_type: string;
  allergies: string[];
  chronic_conditions: string[];
  current_medications: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}
