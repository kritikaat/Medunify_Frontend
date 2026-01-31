// ==========================================
// Doctor → Patient View API Service
// Based on Backend API Documentation v2.0
// ==========================================

import { get } from './client';
import type {
  ListSharedPatientsResponse,
  PatientProfileForDoctor,
  PatientTimelineResponse,
  PatientReportsResponse,
  PatientAssessmentsResponse,
} from '@/types/doctor-patient-view';

// ==========================================
// Doctor Portal - Patient Access Endpoints
// All endpoints use JWT authentication (no doctor_id param needed)
// ==========================================

/**
 * List patients who have shared with this doctor
 * GET /api/v1/doctor/patients
 * 
 * JWT authenticated - doctor_id derived from token
 */
export async function listSharedPatients(params?: {
  query?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}): Promise<ListSharedPatientsResponse> {
  const queryParams: Record<string, string> = {};
  
  if (params?.query) queryParams.query = params.query;
  if (params?.is_active !== undefined) queryParams.is_active = String(params.is_active);
  if (params?.skip !== undefined) queryParams.skip = String(params.skip);
  if (params?.limit !== undefined) queryParams.limit = String(params.limit);
  
  return get<ListSharedPatientsResponse>('/api/v1/doctor/patients', queryParams);
}

/**
 * Get patient profile
 * GET /api/v1/doctors/patients/{patient_id}/profile
 * 
 * JWT authenticated
 */
export async function getPatientProfile(patientId: string): Promise<PatientProfileForDoctor> {
  return get<PatientProfileForDoctor>(`/api/v1/doctors/patients/${patientId}/profile`);
}

/**
 * Get patient timeline data
 * GET /api/v1/doctors/patients/{patient_id}/timeline
 * 
 * JWT authenticated
 */
export async function getPatientTimeline(
  patientId: string,
  months?: number
): Promise<PatientTimelineResponse> {
  const params: Record<string, string> = {};
  if (months) params.months = String(months);
  
  return get<PatientTimelineResponse>(`/api/v1/doctors/patients/${patientId}/timeline`, params);
}

/**
 * Get patient reports
 * GET /api/v1/doctors/patients/{patient_id}/reports
 * 
 * JWT authenticated
 */
export async function getPatientReports(patientId: string): Promise<PatientReportsResponse> {
  return get<PatientReportsResponse>(`/api/v1/doctors/patients/${patientId}/reports`);
}

/**
 * Get patient assessments
 * GET /api/v1/doctors/patients/{patient_id}/assessments
 * 
 * JWT authenticated
 */
export async function getPatientAssessments(patientId: string): Promise<PatientAssessmentsResponse> {
  return get<PatientAssessmentsResponse>(`/api/v1/doctors/patients/${patientId}/assessments`);
}

// ==========================================
// Doctor Portal - Stats & Profile Endpoints
// ==========================================

export interface DoctorStats {
  total_patients: number;
  active_shares: number;
  expired_shares: number;
  new_shares_this_week: number;
  new_shares_this_month: number;
  reports_viewed_today: number;
  reports_viewed_this_week: number;
}

export interface DoctorActivity {
  id: string;
  type: 'new_share' | 'view_report' | 'share_expired';
  patient_name: string;
  patient_id: string;
  report_id?: string;
  timestamp: string;
  description: string;
}

/**
 * Get doctor dashboard stats
 * GET /api/v1/doctor/stats
 */
export async function getDoctorStats(): Promise<DoctorStats> {
  return get<DoctorStats>('/api/v1/doctor/stats');
}

/**
 * Get doctor activity log
 * GET /api/v1/doctor/activity
 */
export async function getDoctorActivity(limit: number = 20): Promise<{ activities: DoctorActivity[] }> {
  return get<{ activities: DoctorActivity[] }>('/api/v1/doctor/activity', { limit: String(limit) });
}

/**
 * Update doctor's own profile
 * PUT /api/v1/doctor/profile
 */
export interface UpdateDoctorProfileRequest {
  name?: string;
  phone?: string;
  qualification?: string;
  experience_years?: number;
  bio?: string;
}

export async function updateDoctorProfile(data: UpdateDoctorProfileRequest): Promise<any> {
  const { put } = await import('./client');
  return put('/api/v1/doctor/profile', data);
}
