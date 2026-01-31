// ==========================================
// Doctor → Patient View API Types
// Based on Backend API Documentation v2.0
// ==========================================

// ==========================================
// Shared Patient Info (Doctor View)
// GET /api/v1/doctor/patients
// ==========================================

export interface SharedPatientListItem {
  share_id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  patient_age: number;
  patient_gender: string;
  shared_content: string[];
  date_range: string;
  date_from: string | null;
  date_to: string | null;
  expires_at: string;
  shared_at: string;
  last_accessed: string | null;
  is_active: boolean;
}

export interface ListSharedPatientsResponse {
  patients: SharedPatientListItem[];
  total: number;
}

// ==========================================
// Patient Profile (Doctor View)
// GET /api/v1/doctors/patients/{patient_id}/profile
// ==========================================

export interface PatientProfileForDoctor {
  id: string;
  name: string;
  age: number;
  gender: string;
  blood_group: string | null;
  allergies: string[];
  chronic_conditions: string[];
  current_medications: string[];
  share_id: string;
  share_config: {
    include_profile: boolean;
    include_reports: boolean;
    include_timeline: boolean;
    include_assessments: boolean;
  };
  shared_at: string;
  expires_at: string;
  report_count: number;
  latest_report_date: string | null;
  has_assessments: boolean;
  latest_assessment_date: string | null;
}

// ==========================================
// Patient Timeline (Doctor View)
// GET /api/v1/doctors/patients/{patient_id}/timeline
// ==========================================

export interface PatientTimelineBiomarker {
  biomarker_name: string;
  unit: string;
  data_points: {
    date: string;
    value: number;
    status: 'normal' | 'abnormal' | 'borderline' | 'critical';
  }[];
  latest_value: number;
  trend_direction: 'increasing' | 'decreasing' | 'stable';
  normal_range: {
    min?: number;
    max?: number;
  };
}

export interface PatientTimelineInsight {
  biomarker: string;
  type: 'improvement' | 'warning' | 'trend';
  title: string;
  description: string;
  trend: string;
}

export interface PatientTimelineResponse {
  patient_id: string;
  patient_name: string;
  biomarkers: PatientTimelineBiomarker[];
  date_range: {
    start: string;
    end: string;
  };
  insights: PatientTimelineInsight[];
}

// ==========================================
// Patient Reports (Doctor View)
// GET /api/v1/doctors/patients/{patient_id}/reports
// ==========================================

export interface ExtractedValueForDoctor {
  test_name: string;
  value: number | string;
  unit: string | null;
  status: 'normal' | 'abnormal' | 'borderline' | 'critical';
  reference_range: string | null;
}

export interface PatientReportForDoctor {
  id: string;
  report_type: string;
  hospital_name: string;
  report_date: string;
  patient_friendly_summary: string | null;
  clinical_summary: string | null;
  extracted_values: ExtractedValueForDoctor[];
  can_download: boolean;
}

export interface PatientReportsResponse {
  patient_id: string;
  patient_name: string;
  reports: PatientReportForDoctor[];
  total: number;
}

// ==========================================
// Patient Assessments (Doctor View)
// GET /api/v1/doctors/patients/{patient_id}/assessments
// ==========================================

export interface AssessmentCondition {
  name: string;
  confidence: number;
  urgency_level: 'low' | 'moderate' | 'moderate_high' | 'high' | 'critical';
  recommendations?: string[];
}

export interface PatientAssessmentForDoctor {
  id: string;
  status: 'active' | 'completed' | 'abandoned';
  started_at: string;
  completed_at: string | null;
  symptoms: string[];
  conditions: AssessmentCondition[];
  summary: string | null;
  recommended_tests: string[];
}

export interface PatientAssessmentsResponse {
  patient_id: string;
  patient_name: string;
  assessments: PatientAssessmentForDoctor[];
  total: number;
}
