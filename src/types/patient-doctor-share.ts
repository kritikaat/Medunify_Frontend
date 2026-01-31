// ==========================================
// Patient → Doctor Share API Types
// Based on Backend API Documentation
// ==========================================

import type { PublicDoctorProfile } from './doctor-discovery';

// ==========================================
// Share Configuration for Doctor Shares
// ==========================================

export type DoctorSharePermission = 'view' | 'download' | 'print';
export type ReportTypeFilter = 'lab_report' | 'radiology' | 'prescription' | 'discharge_summary' | 'imaging_report';

export interface DoctorShareConfig {
  include_profile: boolean;
  include_reports: boolean;
  include_timeline: boolean;
  include_assessments: boolean;
  include_prescriptions: boolean;
  report_types?: ReportTypeFilter[];
  date_range_start?: string;
  date_range_end?: string;
  permissions: DoctorSharePermission[];
}

// ==========================================
// Create Doctor Share
// POST /api/v1/patient/doctor-shares
// ==========================================

export interface CreateDoctorShareRequest {
  doctor_ids: string[];
  config: DoctorShareConfig;
  patient_note?: string;
  expires_in_days?: number;
}

// ==========================================
// Doctor Share Response
// ==========================================

export interface DoctorShare {
  id: string;
  doctor: PublicDoctorProfile;
  config: DoctorShareConfig;
  patient_note?: string;
  expires_at: string;
  is_active: boolean;
  is_expired: boolean;
  access_count: number;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// List Doctor Shares
// GET /api/v1/patient/doctor-shares
// ==========================================

export interface ListDoctorSharesParams {
  include_expired?: boolean;
  include_revoked?: boolean;
}

export interface ListDoctorSharesResponse {
  shares: DoctorShare[];
  total: number;
}

// ==========================================
// Update Doctor Share
// PUT /api/v1/patient/doctor-shares/{share_id}
// ==========================================

export interface UpdateDoctorShareRequest {
  config?: Partial<DoctorShareConfig>;
  patient_note?: string;
  expires_in_days?: number;
  is_active?: boolean;
}

// ==========================================
// Frontend UI Constants for API Integration
// Note: Basic UI constants (DATE_RANGE_OPTIONS, EXPIRY_OPTIONS) 
// are in @/types/share.ts for backward compatibility
// ==========================================

export const API_CONTENT_OPTIONS = [
  { value: 'profile', key: 'include_profile', label: 'Basic Profile', description: 'Name, age, blood group, allergies' },
  { value: 'reports', key: 'include_reports', label: 'Medical Reports', description: 'Lab reports, imaging, prescriptions' },
  { value: 'timeline', key: 'include_timeline', label: 'Health Timeline', description: 'Biomarker trends and graphs' },
  { value: 'assessments', key: 'include_assessments', label: 'Health Assessments', description: 'AI assessment results' },
] as const;
