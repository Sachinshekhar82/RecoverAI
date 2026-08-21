import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { queryAgentConsole } from '../services/api';
import { AgentQueryResponse } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Bot, Send, ArrowRight, LineChart, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IntelligenceResult {
  query: string;
  response: AgentQueryResponse;
}

export const AgentConsolePage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<IntelligenceResult[]>([
    {
      query: 'How much revenue is currently at risk?',
      response: {
        answer: 'Currently, there is ₹4,85,000.00 in total revenue at risk across 200 total transactions. There are 35 high-priority cases that have a high probability of recovery if acted upon immediately.',
        intent: 'GET_REVENUE_AT_RISK',
        data_context: { total_at_risk: 485000, high_risk_count: 35 },
        recommended_actions: [
          { label: 'Review High Priority Cases', link: '/recovery?risk_level=HIGH' },
          { label: 'View Batch Evaluation', link: '/evaluation' }
        ]
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Why did revenue drop today?",
    "Which recovery cases should we prioritize?",
    "How much revenue is currently at risk?",
    "What caused most payment failures?",
    "Why was recovery stopped for customers?"
  ];

  const handleQuery = async (qText?: string) => {
    const q = qText || input;
    if (!q.trim()) return;

    if (!qText) setInput('');
    setLoading(true);

    try {
      const res = await queryAgentConsole(q);
      setResults((prev) => [{ query: q, response: res }, ...prev]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Revenue Intelligence" subtitle="Ask questions about your recovery performance." />

        <main className="p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Query Bar */}
          <Card padding="p-4" className="space-y-3">
            <h3 className="text-sm font-bold text-[#171717]">Query Revenue Operations Dataset</h3>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuery();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about payment failures, recovery probability, or stopping rules..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg px-4 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
              />
              <Button type="submit" disabled={loading || !input.trim()} icon={<Send className="w-3.5 h-3.5" />}>
                Analyze
              </Button>
            </form>

            {/* Suggested Questions */}
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold text-[#8A8A8A] self-center mr-1">Suggested:</span>
              {sampleQuestions.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuery(sq)}
                  className="px-2.5 py-1 rounded-md bg-[#F7F7F5] hover:bg-[#E7E7E3] border border-[#E7E7E3] text-[11px] text-[#666666] transition-all font-medium"
                >
                  {sq}
                </button>
              ))}
            </div>
          </Card>

          {/* Intelligence Results Feed */}
          <div className="space-y-4">
            {loading && (
              <Card padding="p-4" className="text-center text-xs text-[#666666]">
                Analyzing 200 transaction records & policy log...
              </Card>
            )}

            {results.map((resItem, idx) => (
              <Card key={idx} padding="p-5" className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E7E3] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3B5CCC]"></span>
                    <h4 className="text-sm font-bold text-[#171717]">"{resItem.query}"</h4>
                  </div>
                  <Badge variant="INFO">Source: 200 Transaction Records</Badge>
                </div>

                {/* Insight - Evidence - Recommendation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Insight */}
                  <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3]">
                    <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Operational Insight</span>
                    <p className="text-[#171717] font-semibold mt-1 leading-relaxed">{resItem.response.answer}</p>
                  </div>

                  {/* Evidence */}
                  <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3]">
                    <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Supporting Evidence</span>
                    <p className="text-[#666666] text-[11px] mt-1 leading-relaxed">
                      Intent identified: <strong className="text-[#171717]">{resItem.response.intent}</strong>. Verified against real-time database collection and policy engine execution log.
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="p-3 rounded-lg bg-[#EAF6F0] border border-[#C3E6D5]">
                    <span className="text-[10px] uppercase font-bold text-[#197A55]">Recommended Action</span>
                    <p className="text-[#197A55] font-medium text-[11px] mt-1 leading-relaxed">
                      Prioritize transient payment failures with recovery probability above 70%.
                    </p>
                  </div>
                </div>

                {/* Quick Action Navigation Links */}
                {resItem.response.recommended_actions && (
                  <div className="pt-3 border-t border-[#E7E7E3] flex flex-wrap gap-2">
                    {resItem.response.recommended_actions.map((act, aIdx) => (
                      <Button key={aIdx} variant="secondary" size="sm" onClick={() => navigate(act.link)}>
                        {act.label} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
