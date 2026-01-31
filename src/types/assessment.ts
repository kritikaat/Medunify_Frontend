// ==========================================
// Assessment Chat Types
// ==========================================

export interface ChatMessageRequest {
  message: string;
  session_id?: string | null;
}

export interface AssessmentCondition {
  name: string;
  confidence: number;
  urgency_level: 'low' | 'moderate' | 'moderate_high' | 'high' | 'urgent' | 'emergency';
  matching_symptoms: string[];
  matching_lab_values: string[];
  risk_factors: string[];
  recommendations: string[];
  description: string;
}

// Response when AI asks a follow-up question
export interface QuestionResponse {
  session_id: string;
  response_type: 'question';
  message: string;
  options?: string[];
  context_reference?: string;
  progress: number;
  question_count: number;
  assessment_confidence: number;
  can_complete: boolean;
  identified_symptoms: string[];
}

// Response when assessment is complete
export interface AssessmentResponse {
  session_id: string;
  response_type: 'assessment';
  message: string;
  conditions: AssessmentCondition[];
  overall_status: 'healthy' | 'needs_attention' | 'concerning' | 'urgent';
  summary_for_doctor: string;
  lifestyle_recommendations: string[];
  follow_up_timeframe: string;
  completed_at: string;
  question_count: number;
  disclaimer: string;
}

export type ChatResponse = QuestionResponse | AssessmentResponse;

// Helper type guard
export function isAssessmentResponse(response: ChatResponse): response is AssessmentResponse {
  return response.response_type === 'assessment';
}

export function isQuestionResponse(response: ChatResponse): response is QuestionResponse {
  return response.response_type === 'question';
}

// ==========================================
// Session Types
// ==========================================

export interface AssessmentSession {
  session_id: string;
  status: 'active' | 'completed' | 'abandoned';
  started_at: string;
  completed_at: string | null;
  question_count: number;
  last_message: string;
  identified_symptoms: string[];
  has_assessment: boolean;
}

export interface ResetResponse {
  session_id: string;
  message: string;
  status: string;
}

// ==========================================
// UI Types
// ==========================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
  context_reference?: string;
  timestamp: Date;
  isAssessment?: boolean;
  assessmentData?: AssessmentResponse;
}
