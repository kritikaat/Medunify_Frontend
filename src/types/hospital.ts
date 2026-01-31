// ==========================================
// Hospital Portal Types
// ==========================================

// Doctor as managed by hospital
export interface Doctor {
  id: string;
  email: string;
  name: string;
  specialization: string;
  qualification?: string;
  license_number: string;
  hospital_id: string;
  hospital_name?: string;
  experience_years?: number;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  patients_count: number;       // How many patients shared with them
}

// Request to create a new doctor account
export interface CreateDoctorRequest {
  email: string;
  name: string;
  password: string;
  specialization: string;
  license_number: string;
  qualification?: string;
  experience_years?: number;
  phone?: string;
}

// Request to update doctor details (by hospital)
export interface UpdateDoctorRequest {
  name?: string;
  specialization?: string;
  qualification?: string;
  license_number?: string;
  experience_years?: number;
  phone?: string;
  is_active?: boolean;
}

// Hospital dashboard statistics
export interface HospitalStats {
  total_doctors: number;
  active_doctors: number;
  inactive_doctors: number;
  total_patient_shares: number;   // Total shares across all doctors
  this_month_shares: number;
  this_week_shares: number;
}

// Hospital profile
export interface HospitalInfo {
  id: string;
  name: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  logo_url?: string;
  registration_number?: string;
  established_year?: number;
  created_at: string;
}

// Hospital login request
export interface HospitalLoginRequest {
  email: string;
  password: string;
}

// Hospital login response
export interface HospitalLoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'hospital';
  };
}

// Filter options for doctors list
export interface DoctorListParams {
  query?: string;
  specialization?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}

// Specialization options for UI
export const SPECIALIZATIONS: string[] = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Nephrology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Surgery',
  'Urology',
  'Other',
];
