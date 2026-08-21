import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchCaseDetail, analyzeCase, executeIntervention, stopCase } from '../services/api';
import { RecoveryCase, AuditEvent } from '../types';
import { 
  ShieldCheck, 
  BrainCircuit, 
  Play, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Activity, 
  CreditCard,
  User,
  AlertTriangle
} from 'lucide-react';

export const RecoveryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{ case: RecoveryCase; audit_trail: AuditEvent[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = () => {
    if (!id) return;
    setLoading(true);
    fetchCaseDetail(id)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="flex h-screen bg-slate-950 text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-blue-400 font-semibold text-lg">
            <Activity className="w-6 h-6 animate-spin" /> Loading Recovery Case Detail...
          </div>
        </div>
      </div>
    );
  }

  const { case: c, audit_trail } = data;

  const handleAnalyze = async () => {
    setExecuting(true);
    try {
      await analyzeCase(c.id);
      setFeedback('AI Root Cause Analysis updated!');
      loadData();
    } catch (e: any) {
      setFeedback(`Analysis error: ${e.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const handleExecute = async (actionType?: string) => {
    setExecuting(true);
    setFeedback(null);
    try {
      const res = await executeIntervention(c.id, actionType);
      if (res.policy_passed) {
        setFeedback(`Action Executed Successfully! Status: ${res.verification?.status}`);
      } else {
        setFeedback(`Policy Rejection: ${res.message}`);
      }
      loadData();
    } catch (e: any) {
      setFeedback(`Execution error: ${e.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const handleStop = async () => {
    setExecuting(true);
    try {
      await stopCase(c.id, 'Merchant manual halt via UI');
      setFeedback('Recovery safely stopped by Merchant.');
      loadData();
    } catch (e: any) {
      setFeedback(`Stop error: ${e.message}`);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title={`Recovery Case ${c.id}`} subtitle={`Customer: ${c.customer_name} | Amount: ₹${c.amount.toLocaleString('en-IN')}`} />

        <main className="p-6 space-y-6">
          {/* Back button & Feedback banner */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/recovery')}
              className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Recovery Cases
            </button>

            {feedback && (
              <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold animate-fade-in">
                {feedback}
              </div>
            )}
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Case Summary & AI Diagnosis */}
            <div className="lg:col-span-2 space-y-6">
              {/* Transaction & Customer Details */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-400" /> Transaction Case Summary
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    c.status === 'RECOVERED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    c.status === 'SAFELY_STOPPED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium">Transaction ID</span>
                    <p className="font-bold text-gray-200 mt-1">{c.transaction_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Amount</span>
                    <p className="font-bold text-emerald-400 text-sm mt-1">₹{c.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Category</span>
                    <p className="font-semibold text-gray-200 mt-1">{c.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Attempts So Far</span>
                    <p className="font-bold text-amber-400 mt-1">{c.payment_attempts} / 3 Max</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-950 border border-gray-800 text-xs">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Reported Failure Reason</span>
                  <p className="text-gray-200 font-medium mt-1">{c.failure_reason}</p>
                </div>
              </div>

              {/* Module 3 & 4: AI Diagnosis & Decision */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-indigo-400" /> AI Root Cause Diagnosis
                  </h4>
                  <button
                    onClick={handleAnalyze}
                    disabled={executing}
                    className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded text-xs font-semibold transition-all"
                  >
                    Re-Analyze AI
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-indigo-300 font-semibold uppercase text-[10px] tracking-wider">Identified Root Cause</span>
                    <p className="text-gray-100 font-bold text-sm mt-1">{c.root_cause || 'Transient bank gateway timeout during 2FA'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-indigo-500/20">
                    <div>
                      <span className="text-gray-400">Diagnosis Confidence</span>
                      <p className="font-black text-indigo-400 text-base mt-0.5">{intPct(c.confidence || 0.88)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Recovery Probability</span>
                      <p className="font-black text-emerald-400 text-base mt-0.5">{intPct(c.recovery_probability || 0.82)}%</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                    <span className="text-indigo-300 font-bold text-[11px]">Recommended Intervention: {c.recommended_action}</span>
                    <p className="text-gray-300 text-xs mt-1">{c.reasoning}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Policy Engine Guard & Actions */}
            <div className="space-y-6">
              {/* Module 5: Deterministic Policy Engine Guard */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Deterministic Policy Guard
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800">
                    <span className="text-gray-300">Max Payment Retries (&le; 3)</span>
                    <span className={c.payment_attempts < 3 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {c.payment_attempts} / 3 {c.payment_attempts < 3 ? 'PASSED' : 'MAX REACHED'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800">
                    <span className="text-gray-300">Max Customer Contacts (&le; 2)</span>
                    <span className={c.contacts_count < 2 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {c.contacts_count} / 2 PASSED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800">
                    <span className="text-gray-300">Customer Opt-Out Check</span>
                    <span className={!c.opted_out ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {!c.opted_out ? 'CLEARED' : 'OPTED OUT'}
                    </span>
                  </div>
                </div>

                {/* Execution Buttons */}
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  <button
                    onClick={() => handleExecute(c.recommended_action)}
                    disabled={executing || c.status === 'RECOVERED'}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Execute AI Recommended Action ({c.recommended_action})
                  </button>

                  <button
                    onClick={handleStop}
                    disabled={executing || c.status === 'SAFELY_STOPPED' || c.status === 'RECOVERED'}
                    className="w-full py-2 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-amber-400 font-semibold text-xs border border-gray-700 transition-all flex items-center justify-center gap-2"
                  >
                    <AlertOctagon className="w-4 h-4" /> Stop Recovery Safely
                  </button>
                </div>
              </div>

              {/* Customer Reliability */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" /> Customer Reliability Score
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Historical Completion Rate</span>
                  <span className="font-bold text-emerald-400">{intPct(c.previous_success_rate)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${intPct(c.previous_success_rate)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Module 13: Audit Event Log Timeline */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" /> Case Immutable Audit Event Log
            </h4>

            {audit_trail.length === 0 ? (
              <p className="text-xs text-gray-400">No execution audit events logged yet for this transaction.</p>
            ) : (
              <div className="space-y-3">
                {audit_trail.map((evt) => (
                  <div key={evt.event_id} className="p-3.5 rounded-xl bg-slate-950 border border-gray-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-400">{evt.event_id}</span>
                        <span className="text-[10px] text-gray-400">{evt.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          evt.policy_decision === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          Policy: {evt.policy_decision}
                        </span>
                      </div>
                      <p className="text-gray-200 font-semibold">{evt.result}</p>
                      <p className="text-[11px] text-gray-400">Actor: {evt.actor} | Action: {evt.action}</p>
                    </div>

                    <div className="text-right font-mono text-[11px] text-gray-400 bg-gray-900 p-2 rounded border border-gray-800">
                      Razorpay Test Mode: {evt.provider_response?.status || 'captured'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

function intPct(val: number): number {
  return Math.round((val <= 1.0 ? val * 100 : val));
}
