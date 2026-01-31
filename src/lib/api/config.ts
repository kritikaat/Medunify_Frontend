// ==========================================
// API Configuration
// Based on Backend API Documentation
// ==========================================

// In development mode, use empty string to let Vite proxy handle it
// In production, use the full API URL
const isDev = import.meta.env.DEV;
const configuredUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Use empty string in development (requests go through Vite proxy)
// Use full URL in production
export const API_BASE_URL = isDev ? '' : configuredUrl;

// ==========================================
// API Endpoints
// ==========================================

export const API_ENDPOINTS = {
  // ========== BACKWARD COMPATIBLE (flat) ==========
  // Keep these for existing code that uses them
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  REPORTS: '/api/v1/reports',
  UPLOAD_REPORT: '/api/v1/reports/upload',
  REPORT_BY_ID: (id: string) => `/api/v1/reports/${id}`,
  REPROCESS_REPORT: (id: string) => `/api/v1/reports/${id}/reprocess`,

  // ========== Authentication (nested) ==========
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me',
    LOGOUT: '/api/v1/auth/logout',
  },

  // ========== Reports (nested - use REPORTS_API to avoid conflict) ==========
  REPORTS_API: {
    LIST: '/api/v1/reports',
    UPLOAD: '/api/v1/reports/upload',
    BY_ID: (id: string) => `/api/v1/reports/${id}`,
    REPROCESS: (id: string) => `/api/v1/reports/${id}/reprocess`,
  },

  // ========== Timeline ==========
  TIMELINE: {
    DATA: '/api/v1/timeline',
    GRAPH_DATA: '/api/v1/timeline/graph-data',
    BIOMARKERS: '/api/v1/timeline/biomarkers',
    INSIGHTS: '/api/v1/timeline/insights',
    TRENDS: '/api/v1/timeline/trends',
    ANNOTATIONS: '/api/v1/timeline/annotations',
    ANNOTATION_BY_ID: (id: string) => `/api/v1/timeline/annotations/${id}`,
  },

  // ========== Share (Link-based) ==========
  SHARE: {
    CREATE: '/api/v1/share/create',
    LIST: '/api/v1/share',
    BY_UUID: (uuid: string) => `/api/v1/share/${uuid}`,
    VIEW: (shareId: string) => `/api/v1/share/${shareId}/view`,
    EMERGENCY: (userId: string) => `/api/v1/share/emergency/${userId}`,
  },

  // ========== Doctor Discovery (Public) ==========
  DOCTORS_PUBLIC: {
    LIST: '/api/v1/doctors/public',
    BY_ID: (id: string) => `/api/v1/doctors/public/${id}`,
    SPECIALIZATIONS: '/api/v1/doctors/public/specializations',
    CITIES: '/api/v1/doctors/public/cities',
  },

  // ========== Patient Doctor Shares ==========
  PATIENT_DOCTOR_SHARES: {
    LIST: '/api/v1/patient/doctor-shares',
    CREATE: '/api/v1/patient/doctor-shares',
    BY_ID: (id: string) => `/api/v1/patient/doctor-shares/${id}`,
    TOGGLE: (id: string) => `/api/v1/patient/doctor-shares/${id}/toggle`,
  },

  // ========== Doctor Patient View ==========
  DOCTOR_PATIENTS: {
    LIST: '/api/v1/doctors/patients',
    PROFILE: (patientId: string) => `/api/v1/doctors/patients/${patientId}/profile`,
    TIMELINE: (patientId: string) => `/api/v1/doctors/patients/${patientId}/timeline`,
    REPORTS: (patientId: string) => `/api/v1/doctors/patients/${patientId}/reports`,
    ASSESSMENTS: (patientId: string) => `/api/v1/doctors/patients/${patientId}/assessments`,
  },

  // ========== Assessment ==========
  ASSESSMENT: {
    CHAT: '/api/v1/assessment/chat',
    COMPLETE: '/api/v1/assessment/chat/complete',
    RESET: '/api/v1/assessment/chat/reset',
    CURRENT: '/api/v1/assessment/chat/current',
    HISTORY: '/api/v1/assessment/chat/history',
  },

  // ========== Hospital Portal (Backend TBD) ==========
  HOSPITAL: {
    LOGIN: '/api/v1/hospital/auth/login',
    STATS: '/api/v1/hospital/stats',
    DOCTORS: '/api/v1/hospital/doctors',
    DOCTOR_BY_ID: (id: string) => `/api/v1/hospital/doctors/${id}`,
    DOCTOR_STATUS: (id: string) => `/api/v1/hospital/doctors/${id}/status`,
    SETTINGS: '/api/v1/hospital/settings',
  },

  // ========== Doctor Portal (Backend TBD) ==========
  DOCTOR: {
    LOGIN: '/api/v1/doctor/auth/login',
    PROFILE: '/api/v1/doctor/profile',
    STATS: '/api/v1/doctor/stats',
    ACTIVITY: '/api/v1/doctor/activity',
  },
} as const;

// ==========================================
// Storage Keys
// ==========================================

export const TOKEN_STORAGE_KEY = 'medunify_access_token';
export const USER_STORAGE_KEY = 'medunify_user';

// ==========================================
// API Response Status Codes
// ==========================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  GONE: 410, // Share expired/revoked
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
} as const;
