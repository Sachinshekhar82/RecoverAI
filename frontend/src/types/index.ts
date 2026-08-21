export type CategoryType = 'PAYMENT_FAILURE' | 'CHECKOUT_ABANDONMENT' | 'FAILED_SUBSCRIPTION' | 'OVERDUE_INVOICE';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ActionType = 'RETRY_PAYMENT' | 'GENERATE_PAYMENT_LINK' | 'SEND_EMAIL' | 'SEND_WHATSAPP' | 'ESCALATE_TO_MERCHANT' | 'STOP_RECOVERY';
export type CaseStatus = 'DETECTED' | 'DIAGNOSED' | 'INTERVENTION_PENDING' | 'APPROVED' | 'EXECUTING' | 'RECOVERED' | 'FAILED_ATTEMPT' | 'SAFELY_STOPPED' | 'ESCALATED' | 'EXCEPTIONAL';

export interface RecoveryCase {
  id: string;
  transaction_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  category: CategoryType;
  amount: number;
  currency: string;
  failure_reason: string;
  payment_attempts: number;
  contacts_count: number;
  days_overdue: number;
  previous_success_rate: number;
  opted_out: boolean;
  risk_level: RiskLevel;
  risk_score: number;
  root_cause: string;
  confidence: number;
  recovery_probability: number;
  recommended_action: ActionType;
  reasoning: string;
  status: CaseStatus;
  last_action?: string;
  policy_status?: string;
  policy_reason?: string;
  created_at: string;
  updated_at: string;
  last_attempt_at?: string;
}

export interface AuditEvent {
  event_id: string;
  timestamp: string;
  transaction_id: string;
  customer_id: string;
  action: string;
  actor: string;
  AI_reason: string;
  confidence: number;
  policy_decision: string;
  execution_status: string;
  provider_response: Record<string, any>;
  amount: number;
  result: string;
}

export interface CategoryEvaluation {
  total_cases: number;
  revenue_at_risk: number;
  revenue_recovered: number;
  recovery_rate: number;
  recovered_count: number;
}

export interface BatchEvaluation {
  total_records: number;
  total_revenue_at_risk: number;
  total_revenue_recovered: number;
  recovery_rate: number;
  successful_recovery_cases: number;
  failed_recovery_cases: number;
  safely_stopped_cases: number;
  unresolved_exceptions: number;
  average_recovery_amount: number;
  policy_violations_prevented: number;
  ai_accuracy: number;
  by_category: Record<string, CategoryEvaluation>;
}

export interface AgentQueryResponse {
  answer: string;
  intent: string;
  data_context?: Record<string, any>;
  recommended_actions?: Array<{ label: string; link: string }>;
}
