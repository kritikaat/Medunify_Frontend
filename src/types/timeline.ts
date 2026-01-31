// ==========================================
// Timeline API Types
// Based on Backend API Documentation
// ==========================================

// ==========================================
// Basic Timeline Data
// GET /api/v1/timeline
// ==========================================

export interface TimelineDataPoint {
  date: string;
  test_name: string;
  standard_test_name: string;
  value: number;
  unit: string;
  status: 'normal' | 'abnormal' | 'borderline' | 'critical';
  reference_min: number | null;
  reference_max: number | null;
  report_id: string;
}

export interface TimelineAnnotation {
  id: string;
  user_id: string;
  annotation_date: string;
  annotation_text: string;
  annotation_type: AnnotationType;
  created_at: string;
  updated_at: string;
}

export type AnnotationType = 'medication_change' | 'lifestyle_change' | 'symptom' | 'other';

export interface TimelineResponse {
  data: TimelineDataPoint[];
  test_names: string[];
  date_range: {
    start: string;
    end: string;
  };
  annotations: TimelineAnnotation[];
}

export interface TimelineParams {
  tests?: string[];
  date_from?: string;
  date_to?: string;
}

// ==========================================
// Graph-Ready Data (NEW)
// GET /api/v1/timeline/graph-data
// ==========================================

export interface BiomarkerDataPoint {
  date: string;
  value: number;
  status: 'normal' | 'abnormal' | 'borderline' | 'critical';
  annotation: string | null;
}

export interface NormalRange {
  min?: number;
  max?: number;
}

export interface BiomarkerGraphData {
  biomarker_name: string;
  standard_name: string;
  category: string;
  unit: string;
  data_points: BiomarkerDataPoint[];
  normal_range: NormalRange;
  latest_value: number;
  latest_date: string;
  latest_status: 'normal' | 'abnormal' | 'borderline' | 'critical';
  trend_direction: 'increasing' | 'decreasing' | 'stable';
  trend_percentage: number;
  min_value: number;
  max_value: number;
  average_value: number;
}

export interface GraphDataResponse {
  biomarkers: BiomarkerGraphData[];
  annotations: TimelineAnnotation[];
  date_range: {
    start: string;
    end: string;
  };
  total_data_points: number;
}

export interface GraphDataParams {
  biomarkers?: string[];
  date_from?: string;
  date_to?: string;
}

// ==========================================
// Available Biomarkers (NEW)
// GET /api/v1/timeline/biomarkers
// ==========================================

export interface AvailableBiomarker {
  name: string;
  standard_name: string;
  category: string;
  unit: string;
  description: string;
  normal_range: NormalRange;
  data_point_count: number;
}

export interface BiomarkersListResponse {
  biomarkers: AvailableBiomarker[];
  categories: string[];
  total_count: number;
}

// ==========================================
// AI Insights (NEW)
// GET /api/v1/timeline/insights
// ==========================================

export type InsightSeverity = 'info' | 'success' | 'warning' | 'critical';
export type InsightType = 'trend' | 'improvement' | 'warning' | 'anomaly';

export interface HealthInsight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  biomarker: string;
  action_recommended: string;
}

export interface LatestValue {
  biomarker: string;
  value: number;
  unit: string;
  status: 'normal' | 'abnormal' | 'borderline' | 'critical';
  date: string;
}

export interface InsightsResponse {
  insights: HealthInsight[];
  latest_values: LatestValue[];
  generated_at: string;
  disclaimer: string;
}

export interface InsightsParams {
  months?: number;
}

// ==========================================
// Trends Analysis
// GET /api/v1/timeline/trends
// ==========================================

export interface TrendData {
  test_name: string;
  standard_test_name: string;
  trend_direction: 'increasing' | 'decreasing' | 'stable';
  trend_percentage: number;
  current_value: number;
  previous_value: number;
  min_value: number;
  max_value: number;
  average_value: number;
}

export interface TrendsResponse {
  trends: TrendData[];
  patterns: unknown[];
  recommendations: unknown[];
}

export interface TrendsParams {
  tests?: string[];
  months?: number;
}

// ==========================================
// Annotation CRUD
// ==========================================

export interface CreateAnnotationRequest {
  annotation_date: string;
  annotation_text: string;
  annotation_type: AnnotationType;
}

export interface UpdateAnnotationRequest {
  annotation_date?: string;
  annotation_text?: string;
  annotation_type?: AnnotationType;
}
