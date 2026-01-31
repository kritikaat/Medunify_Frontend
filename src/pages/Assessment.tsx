import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle,
  Send,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ChevronRight,
  RotateCcw,
  Copy,
  AlertOctagon,
  Info,
  Loader2,
  History,
  Check,
  X,
} from 'lucide-react';
import { 
  sendChatMessage, 
  completeAssessment, 
  resetAssessment, 
  getCurrentSession,
  getAssessmentHistory,
  getUrgencyInfo,
  getOverallStatusInfo,
} from '@/lib/api/assessment';
import type { 
  ChatMessage, 
  ChatResponse, 
  AssessmentResponse, 
  AssessmentSession,
  QuestionResponse,
} from '@/types/assessment';
import { isAssessmentResponse, isQuestionResponse } from '@/types/assessment';
import { toast } from 'sonner';

export default function Assessment() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const [identifiedSymptoms, setIdentifiedSymptoms] = useState<string[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResponse | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AssessmentSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, assessmentResult]);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const session = await getCurrentSession();
      if (session && session.status === 'active') {
        setSessionId(session.session_id);
        setQuestionCount(session.question_count);
        setIdentifiedSymptoms(session.identified_symptoms);
        
        // Add a message about existing session
        addAssistantMessage(
          `Welcome back! You have an active assessment session. Your last message was: "${session.last_message}". You can continue from where you left off or start over.`
        );
      } else {
        // Start fresh
        addAssistantMessage(
          "Hi! I'm here to help assess your health. Based on your medical history and uploaded reports, I'll ask some questions to understand your symptoms better. What health concern would you like to discuss today?"
        );
      }
    } catch (error) {
      // Start fresh if error
      addAssistantMessage(
        "Hi! I'm here to help assess your health. Based on your medical history and uploaded reports, I'll ask some questions to understand your symptoms better. What health concern would you like to discuss today?"
      );
    }
  };

  const addAssistantMessage = (content: string, options?: string[], contextRef?: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      options,
      context_reference: contextRef,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleResponse = (response: ChatResponse) => {
    console.log('🔄 Setting session_id to:', response.session_id);
    setSessionId(response.session_id);
    
    if (isQuestionResponse(response)) {
      const questionRes = response as QuestionResponse;
      setProgress(questionRes.progress);
      setQuestionCount(questionRes.question_count);
      setCanComplete(questionRes.can_complete);
      setIdentifiedSymptoms(questionRes.identified_symptoms);
      
      addAssistantMessage(
        questionRes.message,
        questionRes.options,
        questionRes.context_reference
      );
    } else if (isAssessmentResponse(response)) {
      const assessmentRes = response as AssessmentResponse;
      setProgress(100);
      setQuestionCount(assessmentRes.question_count);
      setAssessmentResult(assessmentRes);
      
      addAssistantMessage(assessmentRes.message);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    console.log('📨 handleSend - Current sessionId state:', sessionId);
    
    try {
      const response = await sendChatMessage(userMessage, sessionId);
      handleResponse(response);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (option: string) => {
    if (isLoading) return;
    
    addUserMessage(option);
    setIsLoading(true);

    console.log('📨 handleOptionSelect - Current sessionId state:', sessionId);
    
    try {
      const response = await sendChatMessage(option, sessionId);
      handleResponse(response);
    } catch (error) {
      toast.error('Failed to send response. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceComplete = async () => {
    if (!sessionId || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await completeAssessment(sessionId);
      setProgress(100);
      setAssessmentResult(response);
      addAssistantMessage(response.message);
    } catch (error: any) {
      toast.error(error.detail || 'Cannot complete assessment yet. Need more information.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const response = await resetAssessment();
      setSessionId(response.session_id);
      setMessages([]);
      setProgress(0);
      setQuestionCount(0);
      setCanComplete(false);
      setIdentifiedSymptoms([]);
      setAssessmentResult(null);
      
      addAssistantMessage(response.message);
      toast.success('Assessment reset. Starting fresh!');
    } catch (error) {
      toast.error('Failed to reset assessment.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const sessions = await getAssessmentHistory(10);
      setHistory(sessions);
      setShowHistory(true);
    } catch (error) {
      toast.error('Failed to load history.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const copyDoctorSummary = () => {
    if (assessmentResult?.summary_for_doctor) {
      navigator.clipboard.writeText(assessmentResult.summary_for_doctor);
      setCopiedSummary(true);
      toast.success('Summary copied to clipboard!');
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  const getUrgencyBadgeClass = (urgency: string) => {
    const info = getUrgencyInfo(urgency);
    return `${info.bgColor} ${info.color}`;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        
        <main className="p-6 h-[calc(100vh-4rem)]">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                    AI Health Assessment
                  </h1>
                  <p className="text-muted-foreground">
                    Describe your symptoms for personalized health insights based on your medical history
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={loadHistory}
                    disabled={isLoadingHistory}
                  >
                    {isLoadingHistory ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <History className="w-4 h-4 mr-2" />
                    )}
                    History
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-4">
                <Progress value={progress} className="flex-1" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {progress}% • {questionCount} questions
                </span>
                {canComplete && !assessmentResult && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleForceComplete}
                    disabled={isLoading}
                  >
                    Complete Now
                  </Button>
                )}
              </div>

              {/* Identified Symptoms */}
              {identifiedSymptoms.length > 0 && !assessmentResult && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Identified:</span>
                  {identifiedSymptoms.map((symptom, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Chat Container */}
            <div className="flex-1 bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                          {message.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium text-foreground">MedUnify AI</span>
                            </div>
                          )}
                          
                          <div className={`p-4 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-sm'
                              : 'bg-muted rounded-tl-sm'
                          }`}>
                            <p className={message.role === 'user' ? 'text-primary-foreground' : 'text-foreground'}>
                              {message.content}
                            </p>
                            
                            {/* Context Reference */}
                            {message.context_reference && (
                              <div className="mt-3 p-2 bg-background/50 rounded-lg border border-border/50">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  From your reports: {message.context_reference}
                                </p>
                              </div>
                            )}
                            
                            {/* Options */}
                            {message.options && message.options.length > 0 && !assessmentResult && (
                              <div className="mt-4 space-y-2">
                                {message.options.map((option, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={isLoading}
                                    className="w-full text-left p-3 rounded-xl bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <span className="text-sm text-foreground">{option}</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Assessment Results */}
                  {assessmentResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 pt-6"
                    >
                      {/* Overall Status */}
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-foreground">
                            Assessment Results
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Based on {assessmentResult.question_count} questions answered
                          </p>
                        </div>
                        <Badge className={getUrgencyBadgeClass(assessmentResult.overall_status)}>
                          {getOverallStatusInfo(assessmentResult.overall_status).label}
                        </Badge>
                      </div>

                      {/* Conditions */}
                      {assessmentResult.conditions.map((condition, i) => (
                        <div
                          key={i}
                          className="bg-background rounded-xl border border-border overflow-hidden"
                        >
                          <div className="p-4 border-b border-border">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-heading font-semibold text-foreground">
                                {condition.name}
                              </h4>
                              <Badge className={getUrgencyBadgeClass(condition.urgency_level)}>
                                {condition.urgency_level === 'urgent' && <AlertOctagon className="w-3 h-3 mr-1" />}
                                {getUrgencyInfo(condition.urgency_level).label}
                              </Badge>
                            </div>
                            
                            {/* Confidence Bar */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">Match Confidence:</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-32">
                                <div
                                  className={`h-full rounded-full ${
                                    condition.confidence >= 70 ? 'bg-error' :
                                    condition.confidence >= 50 ? 'bg-warning' : 'bg-success'
                                  }`}
                                  style={{ width: `${condition.confidence}%` }}
                                />
                              </div>
                              <span className="font-semibold text-foreground">{condition.confidence}%</span>
                            </div>

                            {/* Description */}
                            {condition.description && (
                              <p className="mt-3 text-sm text-muted-foreground">
                                {condition.description}
                              </p>
                            )}
                          </div>

                          <div className="p-4 grid md:grid-cols-3 gap-4">
                            {/* Matching Symptoms */}
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-2">Matching Symptoms</h5>
                              <div className="flex flex-wrap gap-1">
                                {condition.matching_symptoms.map((s, j) => (
                                  <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>
                                ))}
                              </div>
                            </div>
                            
                            {/* Lab Values */}
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-2">Lab Values</h5>
                              <div className="flex flex-wrap gap-1">
                                {condition.matching_lab_values.map((l, j) => (
                                  <Badge key={j} className="text-xs bg-warning/10 text-warning border-warning/20">{l}</Badge>
                                ))}
                              </div>
                            </div>
                            
                            {/* Risk Factors */}
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-2">Risk Factors</h5>
                              <div className="flex flex-wrap gap-1">
                                {condition.risk_factors.map((r, j) => (
                                  <Badge key={j} variant="outline" className="text-xs">{r}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div className="p-4 bg-muted/50">
                            <h5 className="text-sm font-medium text-foreground mb-2">Recommended Actions</h5>
                            <ul className="space-y-1">
                              {condition.recommendations.map((action, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}

                      {/* Lifestyle Recommendations */}
                      {assessmentResult.lifestyle_recommendations.length > 0 && (
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            Lifestyle Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {assessmentResult.lifestyle_recommendations.map((rec, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Follow-up Timeframe */}
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Recommended follow-up: <strong className="text-foreground">{assessmentResult.follow_up_timeframe}</strong>
                        </span>
                      </div>

                      {/* Disclaimer */}
                      <div className="p-4 bg-warning/10 rounded-xl border border-warning/20">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-foreground mb-1">Important Disclaimer</h4>
                            <p className="text-sm text-muted-foreground">
                              {assessmentResult.disclaimer}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <Button variant="hero">
                          <FileText className="w-4 h-4 mr-2" />
                          Add to Timeline
                        </Button>
                        <Button variant="outline" onClick={copyDoctorSummary}>
                          {copiedSummary ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Summary for Doctor
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          New Assessment
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              {!assessmentResult && (
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Describe your symptoms or type your response..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      variant="hero" 
                      onClick={handleSend} 
                      disabled={!inputValue.trim() || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Your responses are private and encrypted. AI uses your uploaded reports for context.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowHistory(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border z-50 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">Assessment History</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No previous assessments found
                    </p>
                  ) : (
                    history.map((session) => (
                      <div
                        key={session.session_id}
                        className="p-4 bg-muted/50 rounded-xl border border-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            variant={session.status === 'completed' ? 'default' : 'secondary'}
                            className={session.status === 'completed' ? 'bg-success/10 text-success' : ''}
                          >
                            {session.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(session.started_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground mb-2 line-clamp-2">
                          "{session.last_message}"
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{session.question_count} questions</span>
                          {session.identified_symptoms.length > 0 && (
                            <span>{session.identified_symptoms.length} symptoms</span>
                          )}
                        </div>
                        
                        {session.has_assessment && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Has Assessment
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
