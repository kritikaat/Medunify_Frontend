// ==========================================
// Share Types - Patient sharing with Doctors
// ==========================================

// Doctor profile as seen by patients when browsing
export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  hospital_id: string;
  hospital_name: string;
  avatar_url?: string;
  qualification?: string;
  experience_years?: number;
  bio?: string;
  phone?: string;
  is_verified: boolean;
}

// Hospital profile for browsing
export interface HospitalProfile {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  doctors_count: number;
  logo_url?: string;
}

// Content types that can be shared
export type ShareableContent = 
  | 'timeline'
  | 'lab_reports'
  | 'prescriptions'
  | 'radiology'
  | 'patient_summary'
  | 'clinical_summary'
  | 'assessment';

// Date range options for sharing
export type ShareDateRange = '3-months' | '6-months' | '1-year' | 'all' | 'custom';

// Active share from patient to doctor
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
  date_from?: string;           // For custom range (ISO date string)
  date_to?: string;             // For custom range (ISO date string)
  expires_at: string;           // ISO date string
  created_at: string;           // ISO date string
  access_count: number;
  is_active: boolean;
}

// Request to create a new share
export interface CreateShareRequest {
  doctor_id: string;
  shared_content: ShareableContent[];
  date_range: ShareDateRange;
  date_from?: string;
  date_to?: string;
  expires_in_days: number;      // 7, 30, 90, etc.
}

// Request to update an existing share
export interface UpdateShareRequest {
  shared_content?: ShareableContent[];
  date_range?: ShareDateRange;
  date_from?: string;
  date_to?: string;
  expires_in_days?: number;
}

// Response when creating/updating a share
export interface ShareResponse {
  id: string;
  message: string;
  share: ActiveShare;
}

// Filter options for browsing doctors
export interface DoctorSearchParams {
  query?: string;               // Search by name or email
  hospital_id?: string;
  specialization?: string;
  skip?: number;
  limit?: number;
}

// Share content options for UI
export const SHARE_CONTENT_OPTIONS: { id: ShareableContent; label: string; description: string }[] = [
  { id: 'timeline', label: 'Medical Timeline', description: 'Complete history of medical events' },
  { id: 'lab_reports', label: 'Lab Reports', description: 'Blood tests, urine tests, etc.' },
  { id: 'prescriptions', label: 'Prescriptions', description: 'Medication prescriptions' },
  { id: 'radiology', label: 'Radiology Reports', description: 'X-rays, MRIs, CT scans' },
  { id: 'patient_summary', label: 'Patient-Friendly Summary', description: 'Easy-to-understand health summary' },
  { id: 'clinical_summary', label: 'Clinical Summary', description: 'Professional medical summary' },
  { id: 'assessment', label: 'Health Assessment', description: 'AI health assessment results' },
];

// Date range options for UI
export const DATE_RANGE_OPTIONS: { value: ShareDateRange; label: string }[] = [
  { value: '3-months', label: 'Last 3 months' },
  { value: '6-months', label: 'Last 6 months' },
  { value: '1-year', label: 'Last year' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom range' },
];

// Expiry options for UI
export const EXPIRY_OPTIONS: { value: number; label: string }[] = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '3 months' },
  { value: 180, label: '6 months' },
  { value: 365, label: '1 year' },
];
