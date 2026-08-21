import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchAuditTrail } from '../services/api';
import { AuditEvent } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton, EmptyState } from '../components/common/States';
import { Search, Clock, ShieldCheck } from 'lucide-react';

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
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Audit Trail" subtitle="Every recovery decision and financial action is recorded." />

        <main className="p-6 space-y-5 max-w-7xl mx-auto w-full">
          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail by event ID, transaction ID, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#E7E7E3] rounded-lg pl-9 pr-4 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717] shadow-card"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="bg-white border border-[#E7E7E3] rounded-lg px-3 py-2 text-[#171717] shadow-card focus:outline-none"
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
                className="bg-white border border-[#E7E7E3] rounded-lg px-3 py-2 text-[#171717] shadow-card focus:outline-none"
              >
                <option value="">All Outcomes</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Audit Event Timeline Log */}
          <Card padding="p-5" className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton height="h-12" />
                <Skeleton height="h-12" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <EmptyState title="No audit logs found" subtitle="No events matching current query." />
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.event_id}
                    className="p-3.5 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-[#171717]">{evt.event_id}</span>
                        <span className="text-[11px] font-mono text-[#8A8A8A]">{evt.timestamp}</span>
                        <span className="text-[11px] font-mono text-[#666666] bg-white border border-[#E7E7E3] px-2 py-0.5 rounded">
                          Txn: {evt.transaction_id}
                        </span>
                        <Badge variant={evt.policy_decision}>Policy: {evt.policy_decision}</Badge>
                      </div>

                      <p className="text-[#171717] font-semibold text-xs">{evt.result}</p>
                      <p className="text-[11px] text-[#666666]">
                        <strong className="text-[#171717]">Reason:</strong> {evt.AI_reason}
                      </p>
                      <div className="text-[10px] text-[#8A8A8A] flex items-center gap-3">
                        <span>Actor: <strong className="text-[#171717]">{evt.actor}</strong></span>
                        <span>Action: <strong className="text-[#171717]">{evt.action}</strong></span>
                        <span>Amount: <strong className="text-[#197A55]">₹{evt.amount.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-[#E7E7E3] text-right font-mono text-[10px] text-[#666666] min-w-[180px]">
                      <span className="text-[9px] uppercase font-bold text-[#8A8A8A] block">Provider Response</span>
                      <p className="text-[#197A55] font-bold mt-0.5">Status: {evt.provider_response?.status || evt.execution_status}</p>
                      {evt.provider_response?.razorpay_payment_id && (
                        <p className="text-[9px] text-[#8A8A8A] mt-0.5">{evt.provider_response.razorpay_payment_id}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};
