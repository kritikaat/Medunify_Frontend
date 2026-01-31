// ==========================================
// Doctor Discovery API Service
// Based on Backend API Documentation
// ==========================================

import { get } from './client';
import type {
  PublicDoctorProfile,
  ListDoctorsParams,
  ListDoctorsResponse,
  SpecializationsList,
  CitiesList,
} from '@/types/doctor-discovery';

// ==========================================
// Public Doctor Discovery Endpoints
// ==========================================

/**
 * List doctors with filters
 * GET /api/v1/doctors/public
 */
export async function listDoctors(params?: ListDoctorsParams): Promise<ListDoctorsResponse> {
  return get<ListDoctorsResponse>('/api/v1/doctors/public', {
    query: params?.query,
    specialization: params?.specialization,
    city: params?.city,
    is_available: params?.is_available !== undefined ? String(params.is_available) : undefined,
    page: params?.page,
    per_page: params?.per_page,
  });
}

/**
 * Get single doctor profile
 * GET /api/v1/doctors/public/{doctor_id}
 */
export async function getDoctorProfile(doctorId: string): Promise<PublicDoctorProfile> {
  return get<PublicDoctorProfile>(`/api/v1/doctors/public/${doctorId}`);
}

/**
 * Get list of all specializations
 * GET /api/v1/doctors/public/specializations
 */
export async function getSpecializations(): Promise<SpecializationsList> {
  return get<SpecializationsList>('/api/v1/doctors/public/specializations');
}

/**
 * Get list of all cities with doctors
 * GET /api/v1/doctors/public/cities
 */
export async function getCities(): Promise<CitiesList> {
  return get<CitiesList>('/api/v1/doctors/public/cities');
}
