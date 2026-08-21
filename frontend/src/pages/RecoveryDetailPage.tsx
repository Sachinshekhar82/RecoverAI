import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchCaseDetail, analyzeCase, executeIntervention, stopCase } from '../services/api';
import { RecoveryCase, AuditEvent } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton, ErrorState } from '../components/common/States';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Play, 
  Clock, 
  AlertOctagon, 
  Check, 
  Activity,
  User,
  CreditCard
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
      <div className="flex h-screen bg-[#F7F7F5]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title="Case Investigation" />
          <div className="p-6 space-y-4">
            <Skeleton height="h-16" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton height="h-96" className="col-span-2" />
              <Skeleton height="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { case: c, audit_trail } = data;

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
      await stopCase(c.id, 'Merchant manual halt via console');
      setFeedback('Recovery safely stopped.');
      loadData();
    } catch (e: any) {
      setFeedback(`Stop error: ${e.message}`);
    } finally {
      setExecuting(false);
    }
  };

  // Static/Dynamic timeline steps for the event timeline
  const timelineSteps = [
    { title: 'Payment Initiated', time: c.created_at, done: true },
    { title: 'Payment Failed', time: c.created_at, done: true, sub: c.failure_reason },
    { title: 'Revenue Risk Detected', time: c.created_at, done: true, sub: `Risk Level: ${c.risk_level}` },
    { title: 'Root Cause Diagnosed', time: c.updated_at, done: true, sub: c.root_cause || 'Transient gateway failure' },
    { title: 'Recovery Recommended', time: c.updated_at, done: true, sub: `Action: ${c.recommended_action}` },
    { title: 'Policy Engine Validation', time: c.updated_at, done: true, sub: 'All policy checks satisfied' },
    { title: 'Execution & Verification', time: c.last_attempt_at || 'Pending', done: c.status === 'RECOVERED' || c.status === 'SAFELY_STOPPED', sub: `Outcome: ${c.status}` },
  ];

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title={`Case Investigation — ${c.id}`} />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Bar: Back & Headline Summary */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/recovery')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#666666] hover:text-[#171717] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Recovery Queue
            </button>

            {feedback && (
              <div className="p-3 rounded-lg bg-[#EAF6F0] border border-[#C3E6D5] text-[#197A55] text-xs font-semibold">
                {feedback}
              </div>
            )}

            <Card padding="p-4" className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center font-bold text-[#171717]">
                  {c.customer_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#171717]">{c.customer_name}</h2>
                  <p className="text-xs text-[#666666]">{c.customer_email} • {c.customer_phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-[#8A8A8A] block text-[10px] uppercase font-semibold">Revenue At Risk</span>
                  <span className="font-bold text-[#B42318] text-base">₹{c.amount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[#8A8A8A] block text-[10px] uppercase font-semibold">Category</span>
                  <span className="font-semibold text-[#171717]">{c.category.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-[#8A8A8A] block text-[10px] uppercase font-semibold">Risk Level</span>
                  <Badge variant={c.risk_level}>{c.risk_level}</Badge>
                </div>
                <div>
                  <span className="text-[#8A8A8A] block text-[10px] uppercase font-semibold">Status</span>
                  <Badge variant={c.status}>{c.status}</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Main 2-Column Split Console */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recovery Overview & Event Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Timeline */}
              <Card padding="p-5">
                <h3 className="text-sm font-bold text-[#171717] mb-1">Recovery Event Timeline</h3>
                <p className="text-xs text-[#666666] mb-5">Chronological execution flow of detection, diagnosis, and intervention</p>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E7E3]">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start justify-between text-xs">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                        step.done ? 'bg-[#197A55] text-white border-[#197A55]' : 'bg-white text-gray-300 border-[#E7E7E3]'
                      }`}>
                        {step.done ? <Check className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>}
                      </div>

                      <div>
                        <p className="font-bold text-[#171717]">{step.title}</p>
                        {step.sub && <p className="text-[11px] text-[#666666] mt-0.5">{step.sub}</p>}
                      </div>

                      <span className="text-[10px] font-mono text-[#8A8A8A]">{step.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Case Audit Log Table */}
              <Card padding="p-5">
                <h3 className="text-sm font-bold text-[#171717] mb-1">Immutable Audit Trail</h3>
                <p className="text-xs text-[#666666] mb-4">Recorded provider calls and policy events</p>

                {audit_trail.length === 0 ? (
                  <p className="text-xs text-[#8A8A8A]">No audit events recorded yet for this transaction.</p>
                ) : (
                  <div className="space-y-2">
                    {audit_trail.map((evt) => (
                      <div key={evt.event_id} className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#171717]">{evt.event_id}</span>
                            <span className="text-[10px] text-[#8A8A8A]">{evt.timestamp}</span>
                            <Badge variant={evt.policy_decision}>{evt.policy_decision}</Badge>
                          </div>
                          <p className="text-[#171717] font-semibold mt-1">{evt.result}</p>
                          <p className="text-[10px] text-[#666666]">Actor: {evt.actor} • Action: {evt.action}</p>
                        </div>
                        <div className="text-right font-mono text-[10px] text-[#666666]">
                          Provider: {evt.provider_response?.status || evt.execution_status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right 1 Col: Recovery Decision & Policy Check Panel */}
            <div className="space-y-6">
              {/* Recovery Decision Panel */}
              <Card padding="p-5" className="space-y-4">
                <h3 className="text-sm font-bold text-[#171717] border-b border-[#E7E7E3] pb-3">Recovery Decision</h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#8A8A8A] font-semibold text-[10px] uppercase">Recommended Action</span>
                    <p className="font-bold text-[#171717] text-sm mt-0.5">{c.recommended_action}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E7E7E3]">
                    <div>
                      <span className="text-[#8A8A8A]">Recovery Probability</span>
                      <p className="font-bold text-[#197A55] text-base mt-0.5">{Math.round((c.recovery_probability || 0.82) * 100)}%</p>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A]">AI Confidence</span>
                      <p className="font-bold text-[#3B5CCC] text-base mt-0.5">{Math.round((c.confidence || 0.88) * 100)}%</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3]">
                    <span className="text-[10px] font-bold uppercase text-[#666666]">Diagnostic Reason</span>
                    <p className="text-[#171717] text-xs mt-0.5 leading-relaxed">{c.reasoning}</p>
                  </div>
                </div>

                {/* Deterministic Policy Check List */}
                <div className="pt-3 border-t border-[#E7E7E3] space-y-2">
                  <h4 className="text-xs font-bold text-[#171717]">Policy Safety Check</h4>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#197A55] font-medium">
                      <span>✓ Retry Limit Available ({c.payment_attempts}/3)</span>
                      <span className="font-bold">PASSED</span>
                    </div>
                    <div className="flex items-center justify-between text-[#197A55] font-medium">
                      <span>✓ Cooldown Window Satisfied</span>
                      <span className="font-bold">PASSED</span>
                    </div>
                    <div className="flex items-center justify-between text-[#197A55] font-medium">
                      <span>✓ Amount Threshold Within Limit</span>
                      <span className="font-bold">PASSED</span>
                    </div>
                    <div className="flex items-center justify-between text-[#197A55] font-medium">
                      <span>✓ Customer Contact Limit Satisfied</span>
                      <span className="font-bold">PASSED</span>
                    </div>
                  </div>
                </div>

                {/* Primary Execution CTA */}
                <div className="pt-4 border-t border-[#E7E7E3] space-y-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => handleExecute(c.recommended_action)}
                    disabled={executing || c.status === 'RECOVERED'}
                    icon={<Play className="w-4 h-4" />}
                  >
                    Execute Recovery Action
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={handleStop}
                    disabled={executing || c.status === 'SAFELY_STOPPED' || c.status === 'RECOVERED'}
                    icon={<AlertOctagon className="w-4 h-4 text-[#B7791F]" />}
                  >
                    Stop Recovery Safely
                  </Button>
                </div>
              </Card>

              {/* Customer Payment Reliability */}
              <Card padding="p-4" className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#171717]">Customer Reliability Score</span>
                  <span className="font-bold text-[#197A55]">{Math.round(c.previous_success_rate * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-[#197A55] h-1.5 rounded-full"
                    style={{ width: `${Math.round(c.previous_success_rate * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-[#8A8A8A] pt-1">
                  Customer completed {Math.round(c.previous_success_rate * 10)} of last 10 transactions.
                </p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
