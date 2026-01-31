// ==========================================
// Doctor Discovery API Types
// Based on Backend API Documentation
// ==========================================

// ==========================================
// Public Doctor Profile
// GET /api/v1/doctors/public
// GET /api/v1/doctors/public/{doctor_id}
// ==========================================

export interface PublicDoctorProfile {
  id: string;
  name: string;
  specialization: string;
  qualifications: string[];
  experience_years: number;
  hospital_name: string;
  city: string;
  profile_photo_url: string | null;
  bio: string | null;
  is_available: boolean;
  is_verified: boolean;
}

// ==========================================
// List Doctors
// GET /api/v1/doctors/public
// ==========================================

export interface ListDoctorsParams {
  query?: string;
  specialization?: string;
  city?: string;
  is_available?: boolean;
  page?: number;
  per_page?: number;
}

export interface ListDoctorsResponse {
  doctors: PublicDoctorProfile[];
  total: number;
  page: number;
  per_page: number;
}

// ==========================================
// Specializations & Cities
// GET /api/v1/doctors/public/specializations
// GET /api/v1/doctors/public/cities
// ==========================================

export type SpecializationsList = string[];
export type CitiesList = string[];

// Note: SPECIALIZATIONS constant is in @/types/hospital.ts
// This avoids duplicate exports
