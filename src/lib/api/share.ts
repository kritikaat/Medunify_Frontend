// ==========================================
// Share API Service (Link-based Sharing)
// Based on Backend API Documentation
// ==========================================

import { get, post, put, del, apiClient } from './client';
import type {
  CreateShareRequest,
  ShareLink,
  UpdateShareRequest,
  SharedProfileView,
  EmergencyProfile,
} from '@/types/share';

// ==========================================
// Share Link Management
// ==========================================

/**
 * Create a new share link
 * POST /api/v1/share/create
 */
export async function createShareLink(data: CreateShareRequest): Promise<ShareLink> {
  return post<ShareLink>('/api/v1/share/create', data);
}

/**
 * List all my share links
 * GET /api/v1/share
 */
export async function listShareLinks(): Promise<ShareLink[]> {
  return get<ShareLink[]>('/api/v1/share');
}

/**
 * Update a share link
 * PUT /api/v1/share/{share_uuid}
 */
export async function updateShareLink(
  shareUuid: string,
  data: UpdateShareRequest
): Promise<ShareLink> {
  return put<ShareLink>(`/api/v1/share/${shareUuid}`, data);
}

/**
 * Revoke/delete a share link
 * DELETE /api/v1/share/{share_uuid}
 */
export async function revokeShareLink(shareUuid: string): Promise<void> {
  return del<void>(`/api/v1/share/${shareUuid}`);
}

// ==========================================
// Public View Endpoints
// ==========================================

/**
 * View shared profile (public - no auth required)
 * GET /api/v1/share/{share_id}/view
 * 
 * @param shareId - The share ID (not UUID)
 * @param password - Required if share is password-protected
 * @param email - Required if share is email-restricted
 */
export async function viewSharedProfile(
  shareId: string,
  options?: { password?: string; email?: string }
): Promise<SharedProfileView> {
  const searchParams = new URLSearchParams();
  if (options?.password) searchParams.append('password', options.password);
  if (options?.email) searchParams.append('email', options.email);
  
  const queryString = searchParams.toString();
  const url = `/api/v1/share/${shareId}/view${queryString ? `?${queryString}` : ''}`;
  
  // This endpoint is public - no auth header needed
  const response = await fetch(url, { method: 'GET' });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to view shared profile');
  }
  
  return response.json();
}

/**
 * Get emergency profile (public)
 * GET /api/v1/share/emergency/{user_id}
 */
export async function getEmergencyProfile(userId: string): Promise<EmergencyProfile> {
  const response = await fetch(`/api/v1/share/emergency/${userId}`, { method: 'GET' });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get emergency profile');
  }
  
  return response.json();
}

// ==========================================
// Helper to generate shareable URL
// ==========================================

/**
 * Generate full shareable URL from share link
 */
export function getFullShareUrl(shareLink: ShareLink): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared/${shareLink.share_id}`;
}

/**
 * Generate QR code data URL from base64
 */
export function getQrCodeDataUrl(base64: string): string {
  return `data:image/png;base64,${base64}`;
}
