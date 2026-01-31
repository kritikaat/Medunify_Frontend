// API Configuration
// The base URL can be changed via environment variables

// In development mode, use empty string to let Vite proxy handle it
// In production, use the full API URL
const isDev = import.meta.env.DEV;
const configuredUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Use empty string in development (requests go through Vite proxy)
// Use full URL in production
export const API_BASE_URL = isDev ? '' : configuredUrl;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  
  // Reports
  REPORTS: '/api/v1/reports',
  UPLOAD_REPORT: '/api/v1/reports/upload',
  REPORT_BY_ID: (id: string) => `/api/v1/reports/${id}`,
  REPROCESS_REPORT: (id: string) => `/api/v1/reports/${id}/reprocess`,
} as const;

// Token storage key
export const TOKEN_STORAGE_KEY = 'medunify_access_token';
export const USER_STORAGE_KEY = 'medunify_user';
