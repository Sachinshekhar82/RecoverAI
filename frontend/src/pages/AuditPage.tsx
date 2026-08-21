import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchAuditTrail } from '../services/api';
import { AuditEvent } from '../types';
import { ShieldCheck, Search, Filter, Clock } from 'lucide-react';

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
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Immutable Audit Trail Log" subtitle="Complete verifiable audit log for every detection, AI decision, and policy outcome" />

        <main className="p-6 space-y-5">
          {/* Search & Filters */}
          <div className="p-4 rounded-xl bg-slate-900 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by Event ID, Transaction ID, Customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="bg-slate-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300"
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
                className="bg-slate-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300"
              >
                <option value="">All Policy Outcomes</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Audit Events Timeline List */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-4">
            <div className="space-y-3">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.event_id}
                  className="p-4 rounded-xl bg-slate-950 border border-gray-800 hover:border-gray-700 transition-all text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-blue-400 font-mono text-sm">{evt.event_id}</span>
                      <span className="text-gray-400 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" /> {evt.timestamp}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium">
                        Txn: {evt.transaction_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        evt.policy_decision === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        Policy: {evt.policy_decision}
                      </span>
                    </div>

                    <p className="text-gray-100 font-bold text-sm">{evt.result}</p>
                    <p className="text-gray-400 text-[11px]">
                      <span className="font-semibold text-gray-300">AI Reason:</span> {evt.AI_reason}
                    </p>
                    <div className="text-[10px] text-gray-500 flex items-center gap-3">
                      <span>Actor: <strong className="text-gray-300">{evt.actor}</strong></span>
                      <span>Action: <strong className="text-gray-300">{evt.action}</strong></span>
                      <span>Confidence: <strong className="text-indigo-300">{Math.round(evt.confidence * 100)}%</strong></span>
                      <span>Amount: <strong className="text-emerald-400">₹{evt.amount.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-gray-800 text-right min-w-[200px] font-mono text-[11px] text-gray-400">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Razorpay Provider Data</span>
                    <p className="text-emerald-400 font-bold">Status: {evt.provider_response?.status || evt.execution_status}</p>
                    {evt.provider_response?.razorpay_payment_id && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{evt.provider_response.razorpay_payment_id}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
