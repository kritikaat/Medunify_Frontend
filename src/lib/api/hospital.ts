// ==========================================
// Hospital Portal API Service
// Based on Backend API Documentation v2.0
// ==========================================

import { get, post, put, patch } from './client';

// ==========================================
// Types
// ==========================================

export interface HospitalStats {
  total_doctors: number;
  active_doctors: number;
  inactive_doctors: number;
  total_patient_shares: number;
  this_month_shares: number;
  this_week_shares: number;
}

export interface HospitalDoctor {
  id: string;
  email: string;
  name: string;
  specialization: string;
  qualification: string;
  license_number: string;
  experience_years: number;
  phone: string;
  bio?: string;
  profile_photo_url?: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  last_login_at?: string | null;
  patients_count: number;
}

export interface ListDoctorsResponse {
  total: number;
  doctors: HospitalDoctor[];
}

export interface CreateDoctorRequest {
  email: string;
  name: string;
  password: string;
  specialization: string;
  license_number: string;
  qualification: string;
  experience_years: number;
  phone: string;
}

export interface CreateDoctorResponse {
  id: string;
  message: string;
  doctor: HospitalDoctor;
}

export interface UpdateDoctorRequest {
  name?: string;
  specialization?: string;
  license_number?: string;
  is_active?: boolean;
}

// ==========================================
// Hospital Portal - Stats Endpoint
// ==========================================

/**
 * Get hospital dashboard stats
 * GET /api/v1/hospital/stats
 */
export async function getHospitalStats(): Promise<HospitalStats> {
  return get<HospitalStats>('/api/v1/hospital/stats');
}

// ==========================================
// Hospital Portal - Doctor Management
// ==========================================

/**
 * List hospital's doctors
 * GET /api/v1/hospital/doctors
 */
export async function listHospitalDoctors(params?: {
  query?: string;
  specialization?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}): Promise<ListDoctorsResponse> {
  const queryParams: Record<string, string> = {};
  
  if (params?.query) queryParams.query = params.query;
  if (params?.specialization) queryParams.specialization = params.specialization;
  if (params?.is_active !== undefined) queryParams.is_active = String(params.is_active);
  if (params?.skip !== undefined) queryParams.skip = String(params.skip);
  if (params?.limit !== undefined) queryParams.limit = String(params.limit);
  
  return get<ListDoctorsResponse>('/api/v1/hospital/doctors', queryParams);
}

/**
 * Create a new doctor account
 * POST /api/v1/hospital/doctors
 */
export async function createDoctor(data: CreateDoctorRequest): Promise<CreateDoctorResponse> {
  return post<CreateDoctorResponse>('/api/v1/hospital/doctors', data);
}

/**
 * Get doctor details
 * GET /api/v1/hospital/doctors/{doctor_id}
 */
export async function getDoctorDetails(doctorId: string): Promise<HospitalDoctor> {
  return get<HospitalDoctor>(`/api/v1/hospital/doctors/${doctorId}`);
}

/**
 * Update doctor (hospital can update name, specialization, license_number, is_active)
 * PUT /api/v1/hospital/doctors/{doctor_id}
 */
export async function updateDoctor(doctorId: string, data: UpdateDoctorRequest): Promise<HospitalDoctor> {
  return put<HospitalDoctor>(`/api/v1/hospital/doctors/${doctorId}`, data);
}

/**
 * Toggle doctor active status
 * PATCH /api/v1/hospital/doctors/{doctor_id}/status
 */
export async function toggleDoctorStatus(doctorId: string, isActive: boolean): Promise<{ message: string }> {
  return patch<{ message: string }>(`/api/v1/hospital/doctors/${doctorId}/status`, {
    is_active: isActive,
  });
}
