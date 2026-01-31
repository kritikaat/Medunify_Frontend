// ==========================================
// Timeline API Service
// Based on Backend API Documentation
// ==========================================

import { get, post, put, del } from './client';
import type {
  TimelineResponse,
  TimelineParams,
  GraphDataResponse,
  GraphDataParams,
  BiomarkersListResponse,
  InsightsResponse,
  InsightsParams,
  TrendsResponse,
  TrendsParams,
  TimelineAnnotation,
  CreateAnnotationRequest,
  UpdateAnnotationRequest,
} from '@/types/timeline';

// ==========================================
// Timeline Data Endpoints
// ==========================================

/**
 * Get basic timeline data
 * GET /api/v1/timeline
 */
export async function getTimelineData(params?: TimelineParams): Promise<TimelineResponse> {
  const queryParams: Record<string, string | undefined> = {
    date_from: params?.date_from,
    date_to: params?.date_to,
  };
  
  // Handle array params - need custom handling
  let url = '/api/v1/timeline';
  const searchParams = new URLSearchParams();
  
  if (params?.tests?.length) {
    params.tests.forEach(test => searchParams.append('tests', test));
  }
  if (params?.date_from) searchParams.append('date_from', params.date_from);
  if (params?.date_to) searchParams.append('date_to', params.date_to);
  
  const queryString = searchParams.toString();
  if (queryString) {
    url = `${url}?${queryString}`;
  }
  
  return get<TimelineResponse>(url);
}

/**
 * Get graph-ready timeline data (organized by biomarker)
 * GET /api/v1/timeline/graph-data
 * 
 * Best for chart visualization - returns data with trends and statistics
 */
export async function getGraphData(params?: GraphDataParams): Promise<GraphDataResponse> {
  let url = '/api/v1/timeline/graph-data';
  const searchParams = new URLSearchParams();
  
  if (params?.biomarkers?.length) {
    params.biomarkers.forEach(biomarker => searchParams.append('biomarkers', biomarker));
  }
  if (params?.date_from) searchParams.append('date_from', params.date_from);
  if (params?.date_to) searchParams.append('date_to', params.date_to);
  
  const queryString = searchParams.toString();
  if (queryString) {
    url = `${url}?${queryString}`;
  }
  
  return get<GraphDataResponse>(url);
}

/**
 * Get list of available biomarkers for the user
 * GET /api/v1/timeline/biomarkers
 * 
 * Use to populate biomarker selector/filter UI
 */
export async function getAvailableBiomarkers(): Promise<BiomarkersListResponse> {
  return get<BiomarkersListResponse>('/api/v1/timeline/biomarkers');
}

/**
 * Get AI-generated health insights
 * GET /api/v1/timeline/insights
 */
export async function getHealthInsights(params?: InsightsParams): Promise<InsightsResponse> {
  return get<InsightsResponse>('/api/v1/timeline/insights', {
    months: params?.months,
  });
}

/**
 * Get trends analysis
 * GET /api/v1/timeline/trends
 */
export async function getTrendsAnalysis(params?: TrendsParams): Promise<TrendsResponse> {
  let url = '/api/v1/timeline/trends';
  const searchParams = new URLSearchParams();
  
  if (params?.tests?.length) {
    params.tests.forEach(test => searchParams.append('tests', test));
  }
  if (params?.months) searchParams.append('months', String(params.months));
  
  const queryString = searchParams.toString();
  if (queryString) {
    url = `${url}?${queryString}`;
  }
  
  return get<TrendsResponse>(url);
}

// ==========================================
// Annotation CRUD
// ==========================================

/**
 * Create a new annotation
 * POST /api/v1/timeline/annotations
 */
export async function createAnnotation(data: CreateAnnotationRequest): Promise<TimelineAnnotation> {
  return post<TimelineAnnotation>('/api/v1/timeline/annotations', data);
}

/**
 * Update an annotation
 * PUT /api/v1/timeline/annotations/{annotation_id}
 */
export async function updateAnnotation(
  annotationId: string,
  data: UpdateAnnotationRequest
): Promise<TimelineAnnotation> {
  return put<TimelineAnnotation>(`/api/v1/timeline/annotations/${annotationId}`, data);
}

/**
 * Delete an annotation
 * DELETE /api/v1/timeline/annotations/{annotation_id}
 */
export async function deleteAnnotation(annotationId: string): Promise<void> {
  return del<void>(`/api/v1/timeline/annotations/${annotationId}`);
}
