import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchAuditTrail } from '../services/api';
import { AuditEvent } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton, EmptyState } from '../components/common/States';
import { Search, Clock, ShieldCheck, Server, Terminal, Activity } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [policyFilter, setPolicyFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEvents = () => {
    setLoading(true);
    fetchAuditTrail({
      actor: actorFilter || undefined,
      policy_decision: policyFilter || undefined,
    }).then((res) => {
      setEvents(res.audit_events || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadEvents();
  }, [actorFilter, policyFilter]);

  const filteredEvents = events.filter(
    (e) =>
      e.event_id.toLowerCase().includes(search.toLowerCase()) ||
      e.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      e.customer_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Audit Trail" subtitle="Immutable compliance log of every recovery decision and provider action." />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-[#34D399]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Financial & AI Compliance Trail</h3>
                <p className="text-xs text-[#64748B]">All actions are bounded by deterministic Policy Engine rules before execution.</p>
              </div>
            </div>
            <Badge variant="PASSED">Policy Engine Guard Active</Badge>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by event ID, transaction ID, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-lg pl-9 pr-4 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0F172A] shadow-sm font-medium"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-[#0F172A] font-medium shadow-sm focus:outline-none"
              >
                <option value="">All Actors</option>
                <option value="EXECUTION_SERVICE">Execution Service</option>
                <option value="POLICY_ENGINE">Policy Engine</option>
                <option value="AI_AGENT">AI Agent</option>
                <option value="MERCHANT_USER">Merchant Operations</option>
              </select>

              <select
                value={policyFilter}
                onChange={(e) => setPolicyFilter(e.target.value)}
                className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-[#0F172A] font-medium shadow-sm focus:outline-none"
              >
                <option value="">All Policy Outcomes</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Audit Event List */}
          {loading ? (
            <div className="space-y-3">
              <Skeleton height="h-24" />
              <Skeleton height="h-24" />
              <Skeleton height="h-24" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <EmptyState title="No audit events found" subtitle="No logs match your current filter parameters." />
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((evt) => {
                const statusStr = (evt.provider_response?.status || evt.execution_status || 'UNKNOWN').toUpperCase();
                let statusBadgeStyle = 'bg-[#78350F] text-[#FDE68A] border-[#92400E]'; // default amber
                if (statusStr === 'SUCCESS' || statusStr === 'DELIVERED' || statusStr === '200' || statusStr === 'PASSED') {
                  statusBadgeStyle = 'bg-[#065F46] text-[#A7F3D0] border-[#047857]'; // emerald green
                } else if (statusStr === 'REJECTED' || statusStr === 'FAILED' || statusStr === 'ERROR') {
                  statusBadgeStyle = 'bg-[#7F1D1D] text-[#FECACA] border-[#991B1B]'; // dark red
                }

                return (
                  <div
                    key={evt.event_id}
                    className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    {/* Left & Middle Column */}
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Top Meta Line */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-[#0F172A] text-white px-2.5 py-1 rounded-md shadow-xs">
                          {evt.event_id}
                        </span>
                        <span className="font-mono text-xs text-[#64748B] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#94A3B8]" /> {evt.timestamp}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#334155] bg-[#F1F5F9] px-2.5 py-0.5 rounded-md border border-[#E2E8F0]">
                          Txn: {evt.transaction_id}
                        </span>
                        <Badge variant={evt.policy_decision}>Policy: {evt.policy_decision}</Badge>
                      </div>

                      {/* Primary Event Statement */}
                      <p className="text-sm font-bold text-[#0F172A] leading-snug">
                        {evt.result}
                      </p>

                      {/* Diagnostic Reason */}
                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] leading-relaxed">
                        <strong className="text-[#0F172A]">Diagnostic Reason:</strong> {evt.AI_reason}
                      </div>

                      {/* Execution Details */}
                      <div className="flex items-center gap-4 text-xs text-[#64748B] pt-0.5">
                        <span>Actor: <strong className="text-[#0F172A] font-semibold">{evt.actor}</strong></span>
                        <span>•</span>
                        <span>Action: <strong className="text-[#0F172A] font-semibold">{evt.action}</strong></span>
                        <span>•</span>
                        <span>Amount: <strong className="text-[#047857] font-bold">₹{evt.amount.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>

                    {/* Right Column: High-Contrast Provider Response Box */}
                    <div className="bg-[#0F172A] text-white p-4 rounded-xl border border-[#1E293B] shadow-md min-w-[240px] max-w-full lg:max-w-[260px] w-full lg:w-auto shrink-0 flex flex-col justify-between space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                          <Server className="w-3.5 h-3.5 text-[#38BDF8]" /> Provider Response
                        </span>
                        <Activity className="w-3.5 h-3.5 text-[#34D399]" />
                      </div>

                      <div>
                        <span className={`inline-block px-2.5 py-1 rounded-md border text-xs font-bold font-mono uppercase tracking-wide ${statusBadgeStyle}`}>
                          Status: {statusStr}
                        </span>
                      </div>

                      {evt.provider_response?.razorpay_payment_id ? (
                        <div className="text-[11px] font-mono text-[#E2E8F0] border-t border-[#334155] pt-2 truncate">
                          ID: <span className="text-[#38BDF8]">{evt.provider_response.razorpay_payment_id}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] font-mono text-[#94A3B8] border-t border-[#334155] pt-2">
                          Gateway: Verified 200 OK
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
