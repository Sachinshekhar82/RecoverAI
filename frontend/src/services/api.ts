import { RecoveryCase, AuditEvent, BatchEvaluation, AgentQueryResponse } from '../types';

const API_BASE = '/api';

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function fetchRecoveryCases(filters?: { category?: string; status?: string; risk_level?: string }) {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.risk_level) params.append('risk_level', filters.risk_level);
  
  const res = await fetch(`${API_BASE}/recovery/cases?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch recovery cases');
  return res.json();
}

export async function fetchCaseDetail(caseId: string) {
  const res = await fetch(`${API_BASE}/recovery/${caseId}`);
  if (!res.ok) throw new Error(`Failed to fetch case detail for ${caseId}`);
  return res.json();
}

export async function analyzeCase(caseId: string) {
  const res = await fetch(`${API_BASE}/recovery/${caseId}/analyze`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to analyze case');
  return res.json();
}

export async function executeIntervention(caseId: string, actionType?: string) {
  const params = actionType ? `?action_type=${actionType}` : '';
  const res = await fetch(`${API_BASE}/recovery/${caseId}/execute${params}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to execute intervention');
  return res.json();
}

export async function stopCase(caseId: string, reason?: string) {
  const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
  const res = await fetch(`${API_BASE}/recovery/${caseId}/stop${params}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to stop recovery case');
  return res.json();
}

export async function queryAgentConsole(query: string): Promise<AgentQueryResponse> {
  const res = await fetch(`${API_BASE}/agent/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Failed to query AI Agent console');
  return res.json();
}

export async function fetchBatchEvaluation(): Promise<BatchEvaluation> {
  const res = await fetch(`${API_BASE}/evaluation`);
  if (!res.ok) throw new Error('Failed to fetch evaluation metrics');
  return res.json();
}

export async function fetchExceptions() {
  const res = await fetch(`${API_BASE}/evaluation/exceptions`);
  if (!res.ok) throw new Error('Failed to fetch exceptions');
  return res.json();
}

export async function fetchAuditTrail(filters?: { transaction_id?: string; actor?: string; policy_decision?: string }) {
  const params = new URLSearchParams();
  if (filters?.transaction_id) params.append('transaction_id', filters.transaction_id);
  if (filters?.actor) params.append('actor', filters.actor);
  if (filters?.policy_decision) params.append('policy_decision', filters.policy_decision);
  
  const res = await fetch(`${API_BASE}/audit?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch audit trail');
  return res.json();
}

export async function fetchTransactions() {
  const res = await fetch(`${API_BASE}/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function fetchCustomers() {
  const res = await fetch(`${API_BASE}/customers`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function fetchSubscriptions() {
  const res = await fetch(`${API_BASE}/subscriptions`);
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return res.json();
}

export async function fetchInvoices() {
  const res = await fetch(`${API_BASE}/invoices`);
  if (!res.ok) throw new Error('Failed to fetch invoices');
  return res.json();
}
