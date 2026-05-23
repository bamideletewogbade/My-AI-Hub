/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UserRole, AgentTrace } from './types';
import { INITIAL_AGENTS, INITIAL_TRACES, BISHOP_SOUL } from './data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import ToolsView from './components/ToolsView';
import BlogView from './components/BlogView';
import ConsoleView from './components/ConsoleView';
import CompanionChat from './components/CompanionChat';
import AgentMesh from './components/AgentMesh';
import { 
  Terminal, 
  Cpu, 
  Database, 
  Sparkles, 
  DollarSign, 
  Layers, 
  BookOpen, 
  Wrench, 
  Code,
  Smartphone,
  Info,
  ChevronRight,
  Shield,
  ExternalLink,
  Lock
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tools' | 'blog' | 'console' | 'about'>('tools');
  const [userTier, setUserTier] = useState<UserRole>('public');
  const [traces, setTraces] = useState<AgentTrace[]>(INITIAL_TRACES);
  const [routingConfig, setRoutingConfig] = useState<Record<string, string>>({
    conversation_chat: 'gemini-3.5-flash',
    summarize_post: 'gemini-3.5-flash',
    classify_image: 'gemini-3.1-pro-preview',
    payment_elevation: 'gemini-3.5-flash'
  });

  const handleClearTraces = () => {
    setTraces([]);
  };

  const handleUpdateRoute = (task: string, model: string) => {
    setRoutingConfig(prev => ({
      ...prev,
      [task]: model
    }));
    
    // Log LLM router trace event
    handleAddTrace(
      'LLM Router',
      `reconfigure_route:${task}`,
      'gemini-3.5-flash',
      45, 12, 110, 0.000004,
      'success'
    );
  };

  const handleAddTrace = (
    agent: 'Content' | 'Memory' | 'Companion' | 'Commerce' | 'LLM Router',
    task: string,
    model: string,
    inputTokens: number,
    outputTokens: number,
    latencyMs: number,
    costUsd: number,
    result: 'success' | 'failure'
  ) => {
    const mockTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newTrace: AgentTrace = {
      id: `tr-${Date.now()}`,
      agent,
      task,
      model,
      inputTokens,
      outputTokens,
      latencyMs,
      costUsd,
      result,
      timestamp: mockTime
    };

    setTraces(prev => [newTrace, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 font-sans flex flex-col justify-between selection:bg-emerald-500/30 selection:text-white">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-900 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Brand/Owner Indicator */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-neutral-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white font-display tracking-tight">The Hub</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  v1.2 // Agent Mesh Enabled
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono">
                Platform node of builder <span className="text-emerald-400">{BISHOP_SOUL.name}</span> in Accra, GH.
              </p>
            </div>
          </div>

          {/* Living system agents telemetry indicators */}
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono border-l border-neutral-800 pl-4">
            <span className="text-neutral-500">Node Statuses:</span>
            {INITIAL_AGENTS.map((agent) => {
              // Read active from current trace array to show flickering load or sleep
              const isProcessing = traces[0]?.agent === agent.name;
              return (
                <div key={agent.id} className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isProcessing 
                      ? 'bg-amber-400 animate-ping' 
                      : agent.status === 'active' 
                      ? 'bg-emerald-500' 
                      : 'bg-neutral-600'
                  }`} />
                  <span className="text-neutral-400 font-mono capitalize text-[9px]">
                    {agent.id}: {isProcessing ? 'executing' : agent.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* User account state mock controller */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 block font-mono">Identity Context:</span>
              <span className="text-xs text-neutral-300 font-medium font-mono uppercase">
                {userTier} tier
              </span>
            </div>
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
              <button 
                onClick={() => setUserTier('public')}
                className={`px-2 py-1 text-[9px] rounded font-mono font-bold uppercase transition-colors ${
                  userTier === 'public' 
                    ? 'bg-neutral-800 text-emerald-400 font-extrabold shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Pub
              </button>
              <button 
                onClick={() => setUserTier('free')}
                className={`px-2 py-1 text-[9px] rounded font-mono font-bold uppercase transition-colors ${
                  userTier === 'free' 
                    ? 'bg-neutral-800 text-emerald-400 font-extrabold shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Free
              </button>
              <button 
                onClick={() => setUserTier('paid')}
                className={`px-2 py-1 text-[9px] rounded font-mono font-bold uppercase transition-colors ${
                  userTier === 'paid' 
                    ? 'bg-neutral-800 text-emerald-400 font-extrabold shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Paid
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER WORKSPACE */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: ACTIVE VIEW ACTIONS CONTAINER */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* NAV TABS SYSTEM BAR */}
          <div className="flex border-b border-neutral-900 p-0.5 bg-neutral-950/45 rounded-lg border">
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 py-2.5 px-3 rounded text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'tools'
                  ? 'bg-neutral-900 text-emerald-400 border border-neutral-800 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Developer Tools
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex-1 py-2.5 px-3 rounded text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'blog'
                  ? 'bg-neutral-900 text-emerald-400 border border-neutral-800 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Technical Guides
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`flex-1 py-2.5 px-3 rounded text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'console'
                  ? 'bg-neutral-900 text-emerald-400 border border-neutral-800 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Diagnostics Workspace
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-2.5 px-3 rounded text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-neutral-900 text-emerald-400 border border-neutral-800 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              The Soul File
            </button>
          </div>

          {/* DYNAMIC SCREEN VIEWS */}
          <div className="bg-[#0b0b0b] border border-neutral-900 rounded-2xl p-6 shadow-xl flex-1 justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'tools' && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <ToolsView 
                    userTier={userTier} 
                    onChangeUserTier={setUserTier} 
                    onAddTrace={handleAddTrace} 
                  />
                </motion.div>
              )}

              {activeTab === 'blog' && (
                <motion.div
                  key="blog"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <BlogView 
                    onAddTrace={handleAddTrace} 
                  />
                </motion.div>
              )}

              {activeTab === 'console' && (
                <motion.div
                  key="console"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <ConsoleView 
                    traces={traces} 
                    onClearTraces={handleClearTraces} 
                    routingConfig={routingConfig}
                    onUpdateRoute={handleUpdateRoute}
                  />
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-neutral-800 pb-5 text-left">
                    <h2 className="text-xl font-display font-medium text-white tracking-tight">
                      The Soul File &mdash; bishop_soul.md
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono mt-1">
                      Bishop's persistent system prompt values, opinions, and build thesis.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2 text-left">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider">// PERSISTENT IDENTITY VALUES</span>
                      <p className="text-sm font-semibold text-neutral-200 font-display">{BISHOP_SOUL.tagline}</p>
                      <p className="text-xs text-neutral-400 font-sans mt-2">
                        <strong>Node Location:</strong> {BISHOP_SOUL.origin}
                      </p>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="text-xs uppercase font-mono text-neutral-500 font-bold">Looming Opinions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-neutral-300">
                        {BISHOP_SOUL.voiceNotes.map((note, index) => (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            key={index} 
                            className="p-4 bg-neutral-905 border border-neutral-850 rounded-xl flex items-start gap-2.5 hover:border-emerald-500/20 transition-colors"
                          >
                            <span className="text-emerald-500 font-mono text-sm leading-none">&lsquo;</span>
                            <span className="leading-relaxed italic">"{note}"</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-left">
                      <h4 className="text-xs uppercase font-mono text-neutral-500 mb-2 font-bold">Research Segments</h4>
                      <div className="flex flex-wrap gap-2">
                        {BISHOP_SOUL.interests.map((interest, index) => (
                          <span key={index} className="px-3 py-1 bg-neutral-950 text-neutral-300 border border-neutral-900 rounded-full text-xs font-mono">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* INTERACTIVE AGENT MESH MAP */}
                    <div className="pt-4 border-t border-neutral-900 text-left space-y-3">
                      <h4 className="text-xs uppercase font-mono text-neutral-500 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Interactive Cognitive Agent Mesh Map
                      </h4>
                      <AgentMesh />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </section>

        {/* RIGHT COLUMN: PERSISTENT SITE COMPANION */}
        <section className="lg:col-span-4 h-full flex flex-col justify-stretch">
          <CompanionChat 
            routingConfig={routingConfig}
            onAddTrace={handleAddTrace}
          />
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-neutral-900 bg-[#0a0a0a] px-4 py-5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          
          {/* Metadata context log */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Accra-Glocal Central Gateway (Online)</span>
            <span className="text-neutral-700">|</span>
            <span>Zulu May 2026 // UTC Node</span>
          </div>

          {/* Micro documentation references */}
          <div className="flex items-center gap-4">
            <span className="text-neutral-600">No telemetry larping. Real tools workspace.</span>
            <span className="text-neutral-700">|</span>
            <a 
              href="#companion-chat" 
              className="text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              Contact Node
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}

