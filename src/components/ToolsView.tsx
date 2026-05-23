import React, { useState } from 'react';
import { Tool, UserRole } from '../types';
import { INITIAL_TOOLS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  ArrowRight, 
  Download, 
  CreditCard, 
  Sparkles, 
  CheckCircle, 
  Search, 
  HelpCircle,
  Smartphone,
  PhoneCall,
  X,
  AlertCircle
} from 'lucide-react';

interface ToolsViewProps {
  userTier: UserRole;
  onChangeUserTier: (tier: UserRole) => void;
  onAddTrace: (agent: 'Content' | 'Memory' | 'Companion' | 'Commerce' | 'LLM Router', task: string, model: string, inputTokens: number, outputTokens: number, latencyMs: number, costUsd: number, result: 'success' | 'failure') => void;
}

interface CustomNotification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
}

const getTagBadgeStyle = (tag: string) => {
  const normalized = tag.toLowerCase();
  
  const schemes: Record<string, { bg: string; text: string; border: string }> = {
    fintech: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-300',
      border: 'border-emerald-500/20'
    },
    react: {
      bg: 'bg-sky-500/10',
      text: 'text-sky-300',
      border: 'border-sky-500/20'
    },
    ussd: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      border: 'border-amber-500/20'
    },
    ai: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-300',
      border: 'border-purple-500/30'
    },
    sql: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      border: 'border-blue-500/20'
    },
    databases: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-300',
      border: 'border-indigo-500/20'
    },
    ide: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-300',
      border: 'border-pink-500/20'
    },
    telecom: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-300',
      border: 'border-rose-500/25'
    },
    'node.js': {
      bg: 'bg-green-500/10',
      text: 'text-green-300',
      border: 'border-green-500/20'
    },
    cli: {
      bg: 'bg-neutral-500/15',
      text: 'text-neutral-300',
      border: 'border-neutral-550/30'
    },
    productivity: {
      bg: 'bg-teal-500/10',
      text: 'text-teal-300',
      border: 'border-teal-500/20'
    }
  };

  if (schemes[normalized]) {
    return schemes[normalized];
  }

  // Deterministic color fallback
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 6;
  const fallbacks = [
    { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/20' },
    { bg: 'bg-sky-500/10', text: 'text-sky-300', border: 'border-sky-500/20' },
    { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20' },
    { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20' },
    { bg: 'bg-pink-500/10', text: 'text-pink-300', border: 'border-pink-500/20' },
    { bg: 'bg-teal-500/10', text: 'text-teal-300', border: 'border-teal-500/20' }
  ];
  return fallbacks[index];
};

export default function ToolsView({ userTier, onChangeUserTier, onAddTrace }: ToolsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedDemoTool, setSelectedDemoTool] = useState<Tool | null>(null);
  const [checkoutModalTool, setCheckoutModalTool] = useState<Tool | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [momoNumber, setMomoNumber] = useState('0244123456');
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);
  
  // Interactive Mobile money GSM/USSD handset modal simulator state
  const [showUssdHandset, setShowUssdHandset] = useState(false);
  const [ussdStep, setUssdStep] = useState<'idle' | 'prompt' | 'processing' | 'success'>('idle');
  const [ussdInput, setUssdInput] = useState('');

  // Gather unique tags
  const allTags = Array.from(new Set(INITIAL_TOOLS.flatMap(tool => tool.tags)));

  // Filter tools
  const filteredTools = INITIAL_TOOLS.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = activeTag ? tool.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  const showToast = (type: 'info' | 'success' | 'warning', title: string, message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleDownload = (tool: Tool) => {
    // Access controls
    if (tool.tier === 'free' && userTier === 'public') {
      setCheckoutModalTool(tool);
      return;
    }
    if (tool.tier === 'paid' && userTier !== 'paid') {
      setCheckoutModalTool(tool);
      return;
    }

    // Trigger commerce trace
    onAddTrace(
      'Commerce',
      `authorize_download:${tool.slug}`,
      'gemini-3.5-flash',
      120, 24, 280, 0.000018,
      'success'
    );

    showToast(
      'success',
      'Download Authorized',
      `Commerce Agent signed authorized headers. ${tool.slug}.zip downloaded successfully.`
    );
  };

  const handleSimulatePayment = () => {
    if (!checkoutModalTool) return;
    
    setCheckoutSuccess(true);
    setTimeout(() => {
      if (checkoutModalTool.tier === 'free') {
        onChangeUserTier('free');
        showToast('success', 'Tier Elevation Confirmed', 'Account moved to Free tier under Memory sync.');
      } else {
        onChangeUserTier('paid');
        showToast('success', 'Tier Elevation Confirmed', 'Premium endpoint authorized. Bishop database updated.');
      }
      
      onAddTrace(
        'Commerce',
        `payment_received:${checkoutModalTool.tier}_tier_elevation`,
        'gemini-3.5-flash',
        220, 68, 540, 0.000045,
        'success'
      );

      // Memory Agent trace
      onAddTrace(
        'Memory',
        `update_user_metadata:tier_${checkoutModalTool.tier}`,
        'gemini-3.5-flash',
        110, 30, 160, 0.000012,
        'success'
      );

      setCheckoutModalTool(null);
      setCheckoutSuccess(false);
    }, 1500);
  };

  const triggerUssdSimulation = () => {
    // Start USSD handshake
    setShowUssdHandset(true);
    setUssdStep('prompt');
    
    onAddTrace(
      'Commerce',
      'momo_handshake_ussd_init',
      'gemini-3.5-flash',
      150, 40, 310, 0.000021,
      'success'
    );
  };

  const handleUssdSubmit = () => {
    if (ussdInput.trim() === '1') {
      setUssdStep('processing');
      
      // Simulate cellular network latency
      setTimeout(() => {
        setUssdStep('success');
        onAddTrace(
          'Commerce',
          'momo_ussd_billing_callback_success',
          'gemini-3.5-flash',
          210, 52, 620, 0.000038,
          'success'
        );
        showToast('success', 'USSD Momo Bill Processed', `Callback resolved for MTN Subscriber number ${momoNumber}!`);
      }, 1600);
    } else {
      setUssdStep('idle');
      setShowUssdHandset(false);
      showToast('warning', 'USSD Cancelled', 'GSM Subscriber canceled Momo billing authorization.');
    }
    setUssdInput('');
  };

  return (
    <div id="tools-showcase" className="space-y-6 relative">
      
      {/* Dynamic Floating Toast Alerts */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 pointer-events-auto ${
                n.type === 'success' 
                  ? 'bg-neutral-950 border-emerald-500/30 text-emerald-300' 
                  : n.type === 'warning'
                  ? 'bg-neutral-950 border-amber-500/30 text-amber-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-200'
              }`}
            >
              <div className="p-1 rounded bg-neutral-900">
                {n.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <b className="text-xs font-display font-medium text-white block">{n.title}</b>
                <span className="text-[11px] leading-relaxed text-neutral-400 block mt-0.5">{n.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-805 pb-5">
        <div>
          <h2 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            Product &amp; Developer Tool Showcase
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Gated endpoints, custom clients &amp; standalone scripts. Access tier: 
            <span className="ml-1.5 px-2 py-0.5 rounded bg-neutral-900 text-emerald-300 border border-neutral-850 uppercase font-bold text-[10px]">
              {userTier} Account (Bishop's DB)
            </span>
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-900 rounded-lg px-3 py-1.5 max-w-sm w-full">
          <Search className="w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search tools with indices..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm text-neutral-200 outline-none w-full"
          />
        </div>
      </div>

      {/* Tags Filters */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-mono text-neutral-500 mr-2">Filters:</span>
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            activeTag === null 
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold' 
              : 'bg-neutral-950 text-neutral-400 border border-neutral-900 hover:border-neutral-800'
          }`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              activeTag === tag
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold' 
                : 'bg-neutral-950 text-neutral-400 border border-neutral-900 hover:border-neutral-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Tools Grid Container with stagger motion animations */}
      <motion.div 
        layout 
        id="tools-grid" 
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <AnimatePresence>
          {filteredTools.map((tool, idx) => {
            const hasAccess = 
              tool.tier === 'public' || 
              (tool.tier === 'free' && userTier !== 'public') ||
              (tool.tier === 'paid' && userTier === 'paid');

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                key={tool.id} 
                className="bg-neutral-950/40 border border-neutral-900 rounded-xl p-5 hover:border-neutral-800 hover:bg-neutral-950/80 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/1 to-emerald-500/0 rounded-bl-full pointer-events-none group-hover:from-emerald-500/3 transition-all duration-300"></div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                    tool.tier === 'public' 
                      ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' 
                      : tool.tier === 'free'
                      ? 'bg-blue-500/5 text-blue-400 border-blue-500/20'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}>
                    {tool.tier}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-display font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {tool.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tool.tags.map(tag => {
                      const style = getTagBadgeStyle(tag);
                      return (
                        <span 
                          key={tag} 
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono border font-medium transition-all ${style.bg} ${style.text} ${style.border}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs text-neutral-400 mt-3 line-clamp-3 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-900 mt-5 pt-4 z-10">
                  <div className="text-left">
                    <span className="text-[10px] text-neutral-500 block font-mono">Pricing:</span>
                    <span className="text-xs text-emerald-400/90 font-medium font-mono">
                      {tool.price}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {tool.tier === 'public' && (
                      <button
                        onClick={() => setSelectedDemoTool(tool)}
                        className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-855 text-neutral-300 rounded-lg text-xs font-medium border border-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer hover:border-emerald-500/25"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        Try Demo
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(tool)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        hasAccess 
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-sm shadow-emerald-500/10' 
                          : 'bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      {hasAccess ? (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5 text-neutral-400 animate-pulse" />
                          Unlock Endpoint
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTools.length === 0 && (
          <div className="col-span-2 text-center py-10 border border-dashed border-neutral-900 rounded-xl">
            <HelpCircle className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">No tools found matching search criteria.</p>
          </div>
        )}
      </motion.div>

      {/* Interactive Live Tool Demo Area */}
      <AnimatePresence>
        {selectedDemoTool && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-neutral-950 border border-emerald-950/40 rounded-xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-display font-medium text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                Live Interactive Workspace Demo: <span className="text-emerald-400 font-mono">{selectedDemoTool.title}</span>
              </h4>
              <button 
                onClick={() => setSelectedDemoTool(null)} 
                className="text-neutral-500 hover:text-neutral-300 text-xs font-mono cursor-pointer"
              >
                [close]
              </button>
            </div>

            <div className="mt-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4 font-mono text-xs text-neutral-300">
              {selectedDemoTool.id === '1' ? (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-[11px] font-mono">// Simulate a Mobile Money (MoMo) request flow on Accra central cellular nodes</p>
                  
                  <div className="flex flex-wrap gap-4 items-center bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Subscriber Phone (GHS Node)</label>
                      <input 
                        type="text" 
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-emerald-400 outline-none w-44 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Momo Value</span>
                      <span className="text-emerald-300 text-sm font-bold">50.00 GHS (Fixed subscription demo)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">USSD Carrier Channel</span>
                      <span className="text-neutral-400 text-xs font-mono">MTN Ghana (*170#)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={triggerUssdSimulation}
                      className="bg-emerald-500 text-neutral-900 font-bold font-sans rounded px-4 py-2 hover:bg-emerald-400 cursor-pointer text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/10"
                    >
                      <Smartphone className="w-4 h-4" />
                      Simulate MTN MoMo USSD Callback
                    </button>
                  </div>
                </div>
              ) : selectedDemoTool.id === '4' ? (
                <div className="space-y-2">
                  <p className="text-neutral-400 text-[11px] font-mono">// Compress custom markdown files sequence down for context prompt efficiency</p>
                  <textarea 
                    rows={2} 
                    placeholder="# Target markdown node, files contents structure..." 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-300 outline-none text-xs font-mono focus:border-emerald-500/40"
                  />
                  <button 
                    onClick={() => {
                      onAddTrace('Content', 'compress_md_doc_tree', 'gemini-3.5-flash', 140, 45, 320, 0.000022, 'success');
                      showToast('success', 'Token Packing Complete', 'Markdown compressed successfully. 34% token redundancy removed.');
                    }}
                    className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 font-sans rounded px-3 py-1 text-xs cursor-pointer"
                  >
                    Compact Target Context
                  </button>
                </div>
              ) : (
                <p>Demo script parsed successfully. No secondary hooks config.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STUNNING VIRTUAL GSM CELL PHONE TERMINAL SIMULATOR MODAL */}
      <AnimatePresence>
        {showUssdHandset && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-950 border border-neutral-800 rounded-[35px] max-w-sm w-full p-6 relative shadow-2xl flex flex-col items-center"
            >
              
              {/* Phone ear speaker notch */}
              <div className="w-20 h-4 bg-neutral-800 rounded-full mb-6 relative">
                <div className="absolute inset-y-1 left-2 right-2 bg-neutral-950 rounded-full"></div>
              </div>

              {/* LCD Display Screen Screen Wrapper */}
              <div className="w-full bg-[#1b2b1b] border-4 border-neutral-800 rounded-xl p-4 font-mono text-[12px] text-emerald-400 aspect-[4/3] flex flex-col justify-between shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/30 pointer-events-none"></div>
                
                {/* Network signal icons */}
                <div className="flex justify-between items-center text-[10px] text-emerald-500 border-b border-emerald-500/20 pb-1">
                  <span>MTN-GH 4G</span>
                  <span>[📶 📶 📶]</span>
                </div>

                {/* Simulated USSD Steps interface */}
                <div className="my-3 space-y-1">
                  {ussdStep === 'prompt' && (
                    <>
                      <p className="font-bold text-center border border-dashed border-emerald-500/30 p-1 bg-black/20">MoMo Pay Merchant Request</p>
                      <p className="text-[11px] mt-1.5 text-neutral-300">Authorize payment of GHS 50.00 to BISHOP_HUB_DEMO?</p>
                      <p className="text-emerald-300 mt-2 font-bold">1) Yes, Confirm Pin Authorization</p>
                      <p className="text-emerald-500/80">2) Cancel &amp; Decline Request</p>
                    </>
                  )}

                  {ussdStep === 'processing' && (
                    <div className="py-4 text-center space-y-2">
                      <div className="inline-block w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-emerald-300">Authorizing GSM Carrier Token Callback...</p>
                    </div>
                  )}

                  {ussdStep === 'success' && (
                    <div className="text-center py-2 space-y-1.5">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                      <p className="text-xs text-emerald-300 font-bold">Payment Authorized!</p>
                      <p className="text-[10px] text-neutral-400">Transaction ID: GHS-37841A</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-emerald-500/20 pt-1 text-[9px] flex justify-between text-emerald-500/70">
                  <span>Enter Option:</span>
                  <span>{ussdStep === 'success' ? 'Finished' : 'Waiting...'}</span>
                </div>
              </div>

              {/* Handset input area inside phone screen simulation */}
              {ussdStep === 'prompt' && (
                <div className="mt-4 w-full px-2">
                  <input 
                    type="text" 
                    value={ussdInput}
                    onChange={(e) => setUssdInput(e.target.value)}
                    placeholder="Type '1' to confirm..." 
                    className="w-full bg-[#1b2b1b] border-2 border-neutral-800 text-emerald-400 font-mono rounded px-3 py-2 text-center text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Styled Keypad Buttons */}
              <div className="grid grid-cols-3 gap-3.5 mt-6 w-full max-w-[280px]">
                {/* Yes action block input button */}
                <button 
                  onClick={handleUssdSubmit}
                  disabled={ussdStep !== 'prompt'}
                  className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-bold font-mono py-2 rounded-lg text-emerald-400 cursor-pointer active:scale-95"
                >
                  Send
                </button>
                <button 
                  onClick={() => setUssdInput('1')} 
                  disabled={ussdStep !== 'prompt'}
                  className="bg-neutral-900 text-xs py-2 rounded-lg active:scale-95 text-neutral-400 hover:bg-neutral-800 cursor-pointer"
                >
                  [1]
                </button>
                <button 
                  onClick={() => {
                    setShowUssdHandset(false);
                    setUssdStep('idle');
                    showToast('warning', 'USSD Terminated', 'Simulation exited by customer.');
                  }}
                  className="bg-rose-950/40 border border-rose-900/40 text-rose-300 text-xs py-2 rounded-lg cursor-pointer active:scale-95"
                >
                  End
                </button>
              </div>

              <p className="text-[10px] text-neutral-500 font-mono mt-5 uppercase tracking-widest text-center">GSM Cell Receiver Node</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout / Upgrade Modal Context */}
      <AnimatePresence>
        {checkoutModalTool && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950 border border-neutral-805 rounded-xl p-6 max-w-md w-full relative"
            >
              <h4 className="text-lg font-display font-medium text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Elevate Account Gating Authorization
              </h4>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                The tool <span className="text-emerald-400 font-semibold">"{checkoutModalTool.title}"</span> resides in the gated <span className="uppercase text-emerald-300 font-bold">{checkoutModalTool.tier}</span> tier. Upgrading simulates database schema changes evaluated by our agent grid.
              </p>

              <div className="border border-neutral-900 rounded-lg p-3 my-4 bg-neutral-900/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Target Level:</span>
                  <span className="text-white font-mono uppercase font-bold">{checkoutModalTool.tier} Account</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-neutral-400">Pricing Node:</span>
                  <span className="text-emerald-400 font-mono font-bold">{checkoutModalTool.price}</span>
                </div>
              </div>

              {checkoutModalTool.tier === 'paid' && (
                <div className="space-y-2 mb-4">
                  <label className="text-[10px] text-neutral-500 block uppercase font-mono font-bold">Simulate Payment Integration (Ghana / Global Context)</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-lg flex items-center justify-center gap-1.5 focus:ring-1 focus:ring-emerald-400">
                      Mobile Money
                    </button>
                    <button className="bg-neutral-900 border border-neutral-800 text-neutral-400 p-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:border-neutral-700">
                      International Card
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end mt-6">
                <button 
                  onClick={() => setCheckoutModalTool(null)}
                  className="px-4 py-2 hover:bg-neutral-900 border border-transparent text-xs text-neutral-400 rounded-lg transition-colors cursor-pointer"
                  disabled={checkoutSuccess}
                >
                  Go Back
                </button>
                <button 
                  onClick={handleSimulatePayment}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  disabled={checkoutSuccess}
                >
                  {checkoutSuccess ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                      Connecting Mobile Networks...
                    </>
                  ) : (
                    <>
                      Elevate Access Tier
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
