import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { queryAgentConsole } from '../services/api';
import { AgentQueryResponse } from '../types';
import { Bot, Send, Zap, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  response?: AgentQueryResponse;
}

export const AgentConsolePage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: 'Hello! I am your RecoverAI Revenue Agent. Ask me anything about revenue at risk, root cause diagnosis, policy stopping rules, or recovery outcomes.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "How much revenue is currently at risk?",
    "How much money did we recover so far?",
    "What caused most payment failures?",
    "Why did you stop recovery for customers?"
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const userMsg: Message = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await queryAgentConsole(q);
      const agentMsg: Message = {
        sender: 'agent',
        text: res.answer,
        response: res
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: 'Apologies, I encountered an error querying the recovery engine.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="AI Agent Console" subtitle="Ask natural language questions about your revenue recovery operations" />

        <main className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full overflow-hidden">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'agent' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-blue-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  m.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                    : 'bg-slate-900 border border-gray-800 text-gray-100 rounded-bl-none shadow-xl'
                }`}>
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Render Quick Action Buttons if provided by AI Response */}
                  {m.response?.recommended_actions && m.response.recommended_actions.length > 0 && (
                    <div className="pt-2 border-t border-gray-800 flex flex-wrap gap-2">
                      {m.response.recommended_actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => navigate(act.link)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all"
                        >
                          {act.label} <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 font-bold text-xs shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-blue-400 font-semibold animate-pulse">
                <Bot className="w-4 h-4" /> RecoverAI is parsing intent & querying policy database...
              </div>
            )}
          </div>

          {/* Sample Prompts */}
          <div className="py-2 flex flex-wrap gap-2">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sp)}
                className="px-3 py-1.5 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] text-gray-300 font-medium transition-all"
              >
                "{sp}"
              </button>
            ))}
          </div>

          {/* Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="pt-2 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask RecoverAI about payment failures, risk, or policy limits..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
