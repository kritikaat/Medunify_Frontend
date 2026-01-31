import { post, get } from './client';
import type { 
  ChatMessageRequest, 
  ChatResponse, 
  AssessmentSession, 
  ResetResponse,
  AssessmentResponse,
  AssessmentHistoryParams,
} from '@/types/assessment';

// API Endpoints for Assessment
const ASSESSMENT_ENDPOINTS = {
  CHAT: '/api/v1/assessment/chat',
  COMPLETE: '/api/v1/assessment/chat/complete',
  RESET: '/api/v1/assessment/chat/reset',
  CURRENT: '/api/v1/assessment/chat/current',
  HISTORY: '/api/v1/assessment/chat/history',
} as const;

/**
 * Send a chat message to the AI assessment
 * @param message - User's message
 * @param sessionId - Optional existing session ID
 */
export async function sendChatMessage(
  message: string, 
  sessionId?: string | null
): Promise<ChatResponse> {
  const payload: ChatMessageRequest = {
    message,
    session_id: sessionId || null,
  };
  
  // Debug logging - check browser console
  console.log('📤 Sending to /api/v1/assessment/chat:', JSON.stringify(payload, null, 2));
  
  const response = await post<ChatResponse>(ASSESSMENT_ENDPOINTS.CHAT, payload);
  
  console.log('📥 Received response:', JSON.stringify(response, null, 2));
  
  return response;
}

/**
 * Force complete the assessment early (requires minimum 3 questions)
 * @param sessionId - The session ID to complete
 */
export async function completeAssessment(sessionId: string): Promise<AssessmentResponse> {
  return post<AssessmentResponse>(
    `${ASSESSMENT_ENDPOINTS.COMPLETE}?session_id=${sessionId}`
  );
}

/**
 * Reset/abandon current assessment and start fresh
 */
export async function resetAssessment(): Promise<ResetResponse> {
  return post<ResetResponse>(ASSESSMENT_ENDPOINTS.RESET);
}

/**
 * Get current active assessment session (if any)
 */
export async function getCurrentSession(): Promise<AssessmentSession | null> {
  try {
    return await get<AssessmentSession>(ASSESSMENT_ENDPOINTS.CURRENT);
  } catch {
    return null;
  }
}

/**
 * Get assessment history
 * @param params.limit - Maximum sessions to return (default 10)
 * @param params.include_conversation - Include full Q&A history (default true)
 * 
 * NEW: When include_conversation=true, returns conversation_history array
 * with all questions and answers for displaying full chat history
 */
export async function getAssessmentHistory(
  limit: number = 10,
  includeConversation: boolean = false
): Promise<AssessmentSession[]> {
  const params: Record<string, string> = {
    limit: String(limit),
  };
  
  // Only include conversation if explicitly requested
  if (includeConversation) {
    params.include_conversation = 'true';
  }
  
  return get<AssessmentSession[]>(ASSESSMENT_ENDPOINTS.HISTORY, params);
}

/**
 * Get a specific session with full conversation history
 * @param sessionId - The session ID to fetch
 */
export async function getSessionWithConversation(sessionId: string): Promise<AssessmentSession> {
  return get<AssessmentSession>(`${ASSESSMENT_ENDPOINTS.HISTORY}/${sessionId}`, {
    include_conversation: 'true',
  });
}

/**
 * Get urgency level display info
 */
export function getUrgencyInfo(level: string): { label: string; color: string; bgColor: string } {
  const urgencyMap: Record<string, { label: string; color: string; bgColor: string }> = {
    low: { label: 'Low', color: 'text-success', bgColor: 'bg-success/10' },
    moderate: { label: 'Moderate', color: 'text-warning', bgColor: 'bg-warning/10' },
    moderate_high: { label: 'Moderate-High', color: 'text-warning', bgColor: 'bg-warning/10' },
    high: { label: 'High', color: 'text-error', bgColor: 'bg-error/10' },
    urgent: { label: 'Urgent', color: 'text-error', bgColor: 'bg-error/10' },
    emergency: { label: 'Emergency', color: 'text-error', bgColor: 'bg-error/10 animate-pulse' },
  };
  
  return urgencyMap[level] || { label: level, color: 'text-muted-foreground', bgColor: 'bg-muted' };
}

/**
 * Get overall status display info
 */
export function getOverallStatusInfo(status: string): { label: string; color: string; icon: string } {
  const statusMap: Record<string, { label: string; color: string; icon: string }> = {
    healthy: { label: 'Generally Healthy', color: 'text-success', icon: 'check-circle' },
    needs_attention: { label: 'Needs Attention', color: 'text-warning', icon: 'alert-triangle' },
    concerning: { label: 'Concerning', color: 'text-error', icon: 'alert-octagon' },
    urgent: { label: 'Urgent Care Needed', color: 'text-error', icon: 'alert-octagon' },
  };
  
  return statusMap[status] || { label: status, color: 'text-muted-foreground', icon: 'info' };
}
