// ==========================================
// Patient → Doctor Share API Service
// Based on Backend API Documentation
// ==========================================

import { get, post, put, del } from './client';
import type {
  CreateDoctorShareRequest,
  DoctorShare,
  ListDoctorSharesParams,
  ListDoctorSharesResponse,
  UpdateDoctorShareRequest,
} from '@/types/patient-doctor-share';

// ==========================================
// Patient Doctor Share Endpoints
// ==========================================

/**
 * Share profile with doctor(s)
 * POST /api/v1/patient/doctor-shares
 * 
 * Creates new share or updates existing share with specified doctor(s)
 */
export async function shareWithDoctors(data: CreateDoctorShareRequest): Promise<DoctorShare[]> {
  return post<DoctorShare[]>('/api/v1/patient/doctor-shares', data);
}

/**
 * List all my doctor shares
 * GET /api/v1/patient/doctor-shares
 */
export async function listDoctorShares(params?: ListDoctorSharesParams): Promise<ListDoctorSharesResponse> {
  return get<ListDoctorSharesResponse>('/api/v1/patient/doctor-shares', {
    include_expired: params?.include_expired !== undefined ? String(params.include_expired) : undefined,
    include_revoked: params?.include_revoked !== undefined ? String(params.include_revoked) : undefined,
  });
}

/**
 * Get share details
 * GET /api/v1/patient/doctor-shares/{share_id}
 */
export async function getDoctorShareDetails(shareId: string): Promise<DoctorShare> {
  return get<DoctorShare>(`/api/v1/patient/doctor-shares/${shareId}`);
}

/**
 * Update share settings
 * PUT /api/v1/patient/doctor-shares/{share_id}
 */
export async function updateDoctorShare(
  shareId: string,
  data: UpdateDoctorShareRequest
): Promise<DoctorShare> {
  return put<DoctorShare>(`/api/v1/patient/doctor-shares/${shareId}`, data);
}

/**
 * Revoke/delete share permanently
 * DELETE /api/v1/patient/doctor-shares/{share_id}
 */
export async function revokeDoctorShare(shareId: string): Promise<void> {
  return del<void>(`/api/v1/patient/doctor-shares/${shareId}`);
}

/**
 * Toggle share on/off (temporary disable/enable)
 * POST /api/v1/patient/doctor-shares/{share_id}/toggle
 */
export async function toggleDoctorShare(shareId: string): Promise<DoctorShare> {
  return post<DoctorShare>(`/api/v1/patient/doctor-shares/${shareId}/toggle`);
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Check if a share is expired
 */
export function isShareExpired(share: DoctorShare): boolean {
  return share.is_expired || new Date(share.expires_at) < new Date();
}

/**
 * Get days until share expires
 */
export function getDaysUntilExpiry(share: DoctorShare): number {
  const now = new Date();
  const expiresAt = new Date(share.expires_at);
  const diffTime = expiresAt.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
