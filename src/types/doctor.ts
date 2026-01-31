// ==========================================
// Doctor Portal Types
// ==========================================

// Patient who has shared reports with doctor
export interface SharedPatient {
  id: string;                     // Share ID
  patient_id: string;
  patient_name: string;
  patient_email: string;
  patient_age?: number;
  patient_gender?: string;
  shared_content: string[];       // What content they shared
  date_range: string;
  date_from?: string;
  date_to?: string;
  expires_at: string;
  shared_at: string;
  last_accessed?: string;
  is_active: boolean;
}

// Doctor dashboard statistics
export interface DoctorStats {
  total_patients: number;         // Total patients who shared
  active_shares: number;          // Currently active shares
  expired_shares: number;         // Expired shares
  new_shares_this_week: number;
  new_shares_this_month: number;
  reports_viewed_today: number;
  reports_viewed_this_week: number;
}

// Doctor profile (editable by doctor)
export interface DoctorProfileUpdate {
  name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  qualification?: string;
  experience_years?: number;
}

// Doctor login request
export interface DoctorLoginRequest {
  email: string;
  password: string;
}

// Doctor login response
export interface DoctorLoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'doctor';
    hospital_id: string;
    hospital_name: string;
    specialization: string;
    qualification?: string;
    experience_years?: number;
    license_number?: string;
    phone?: string;
    bio?: string;
    avatar_url?: string;
  };
}

// Patient report list for doctor view
export interface PatientReportListItem {
  id: string;
  hospital_name: string;
  doctor_name?: string;
  report_date: string;
  report_type: string;
  document_type?: string;
  processing_status: string;
  patient_friendly_summary?: string;
  clinical_summary?: string;
  uploaded_at: string;
}

// Filter params for patient list
export interface PatientListParams {
  query?: string;                 // Search by name or email
  is_active?: boolean;            // Only active shares
  skip?: number;
  limit?: number;
}

// Activity log entry for doctor
export interface DoctorActivity {
  id: string;
  type: 'view_report' | 'new_share' | 'share_expired' | 'share_revoked';
  patient_name: string;
  patient_id: string;
  report_id?: string;
  timestamp: string;
  description: string;
}
