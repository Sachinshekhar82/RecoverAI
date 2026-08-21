import { RecoveryCase, AuditEvent, BatchEvaluation, AgentQueryResponse } from '../types';

const PRIMARY_API = '/api';
const FALLBACK_API = 'https://recoverai-bjs3.onrender.com/api';

/**
 * Robust fetch helper with automatic cold-start retries & endpoint fallbacks
 */
async function safeFetch(endpoint: string, options?: RequestInit, retries = 3): Promise<Response> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Try primary endpoint (/api) first, then direct Render URL fallback
  const urlsToTry = [
    `${PRIMARY_API}${cleanEndpoint}`,
    `${FALLBACK_API}${cleanEndpoint}`
  ];

  let lastError: any = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    for (const baseUrl of urlsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout per attempt

        const res = await fetch(baseUrl, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          return res;
        }
      } catch (err) {
        lastError = err;
      }
    }
    // Delay 1.5s before next retry if server is waking up
    if (attempt < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  throw lastError || new Error(`Failed to fetch from ${endpoint}`);
}

export async function fetchDashboardSummary() {
  const res = await safeFetch('/dashboard');
  return res.json();
}

export async function fetchRecoveryCases(filters?: { category?: string; status?: string; risk_level?: string }) {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.risk_level) params.append('risk_level', filters.risk_level);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await safeFetch(`/recovery/cases${queryString}`);
  return res.json();
}

export async function fetchCaseDetail(caseId: string) {
  const res = await safeFetch(`/recovery/${caseId}`);
  return res.json();
}

export async function analyzeCase(caseId: string) {
  const res = await safeFetch(`/recovery/${caseId}/analyze`, { method: 'POST' });
  return res.json();
}

export async function executeIntervention(caseId: string, actionType?: string) {
  const params = actionType ? `?action_type=${actionType}` : '';
  const res = await safeFetch(`/recovery/${caseId}/execute${params}`, { method: 'POST' });
  return res.json();
}

export async function stopCase(caseId: string, reason?: string) {
  const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
  const res = await safeFetch(`/recovery/${caseId}/stop${params}`, { method: 'POST' });
  return res.json();
}

export async function queryAgentConsole(query: string): Promise<AgentQueryResponse> {
  const res = await safeFetch('/agent/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return res.json();
}

export async function fetchBatchEvaluation(): Promise<BatchEvaluation> {
  const res = await safeFetch('/evaluation');
  return res.json();
}

export async function fetchExceptions() {
  const res = await safeFetch('/evaluation/exceptions');
  return res.json();
}

export async function fetchAuditTrail(filters?: { transaction_id?: string; actor?: string; policy_decision?: string }) {
  const params = new URLSearchParams();
  if (filters?.transaction_id) params.append('transaction_id', filters.transaction_id);
  if (filters?.actor) params.append('actor', filters.actor);
  if (filters?.policy_decision) params.append('policy_decision', filters.policy_decision);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await safeFetch(`/audit${queryString}`);
  return res.json();
}

export async function fetchTransactions() {
  const res = await safeFetch('/transactions');
  return res.json();
}

export async function fetchCustomers() {
  const res = await safeFetch('/customers');
  return res.json();
}

export async function fetchSubscriptions() {
  const res = await safeFetch('/subscriptions');
  return res.json();
}

export async function fetchInvoices() {
  const res = await safeFetch('/invoices');
  return res.json();
}
