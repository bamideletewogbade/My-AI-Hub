import React, { useState } from 'react';
import { Tool } from '../types';
import { INITIAL_TOOLS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  ArrowRight, 
  Download, 
  Sparkles, 
  CheckCircle, 
  Search, 
  HelpCircle,
  Smartphone,
  PhoneCall,
  X,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface ToolsViewProps {
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
    },
    sme: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-300',
      border: 'border-orange-500/20'
    },
    flutter: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      border: 'border-blue-500/20'
    },
    mobile: {
      bg: 'bg-teal-500/10',
      text: 'text-teal-300',
      border: 'border-teal-500/20'
    },
    career: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-300',
      border: 'border-rose-500/25'
    },
    crypto: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-300',
      border: 'border-orange-500/20'
    },
    trading: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-300',
      border: 'border-yellow-500/20'
    },
    python: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      border: 'border-blue-500/20'
    },
    events: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-300',
      border: 'border-pink-500/20'
    },
    luxury: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      border: 'border-amber-500/20'
    },
    sales: {
      bg: 'bg-green-500/10',
      text: 'text-green-300',
      border: 'border-green-500/20'
    },
    crm: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-300',
      border: 'border-indigo-500/20'
    },
    'dev tools': {
      bg: 'bg-neutral-500/15',
      text: 'text-neutral-300',
      border: 'border-neutral-550/30'
    },
    'next.js': {
      bg: 'bg-neutral-500/15',
      text: 'text-neutral-300',
      border: 'border-neutral-550/30'
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

export default function ToolsView({ onAddTrace }: ToolsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedDemoTool, setSelectedDemoTool] = useState<Tool | null>(null);
  const [momoNumber, setMomoNumber] = useState('0244123456');
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);
  
  // Interactive Mobile money GSM/USSD handset modal simulator state
  const [showUssdHandset, setShowUssdHandset] = useState(false);
  const [ussdStep, setUssdStep] = useState<'idle' | 'prompt' | 'processing' | 'success'>('idle');
  const [ussdInput, setUssdInput] = useState('');

  // New demo states
  const [ascendInvoiceCount, setAscendInvoiceCount] = useState(12400);
  const [ascendInvoicing, setAscendInvoicing] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null);

  const [honeScanning, setHoneScanning] = useState(false);
  const [honeMatches, setHoneMatches] = useState<string[]>([]);

  const [tradeGenerating, setTradeGenerating] = useState(false);
  const [tradeSignals, setTradeSignals] = useState<Array<{pair: string; direction: string; entry: string; rationale: string}>>([]);

  const [tiffanyProposal, setTiffanyProposal] = useState<string | null>(null);
  const [tiffanyEventType, setTiffanyEventType] = useState('wedding');

  const [hunterScanning, setHunterScanning] = useState(false);
  const [hunterLeads, setHunterLeads] = useState<Array<{company: string; score: number; industry: string; location: string}>>([]);

  const [harbourPolling, setHarbourPolling] = useState(false);
  const [harbourRuns, setHarbourRuns] = useState<Array<{agent: string; job: string; status: 'running' | 'done' | 'failed' | 'waiting'; duration: string}>>([]);

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
      `${tool.slug}.zip downloaded successfully.`
    );
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
      <div className="fixed top-16 sm:top-20 right-2 sm:right-4 left-2 sm:left-auto z-50 flex flex-col gap-2.5 max-w-sm w-auto sm:w-full pointer-events-none">
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
          <h2 className="text-lg sm:text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            <span>Product &amp; Developer Tool Showcase</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Custom clients, standalone scripts &amp; developer tools.
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
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
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

                <div className="border-t border-neutral-900 mt-5 pt-4 z-10">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {tool.repoUrl && (
                      <a
                        href={tool.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 sm:px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-[10px] sm:text-xs font-medium border border-neutral-800 transition-all flex items-center gap-1 sm:gap-1.5 hover:border-emerald-500/25"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Repo
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedDemoTool(tool)}
                      className="px-2.5 sm:px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-[10px] sm:text-xs font-medium border border-neutral-800 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer hover:border-emerald-500/25"
                    >
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 animate-pulse" />
                      Try Demo
                    </button>
                    <button
                      onClick={() => handleDownload(tool)}
                      className="px-2.5 sm:px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-[10px] sm:text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/10"
                    >
                      <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Download
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
              <h4 className="text-[11px] sm:text-sm font-display font-medium text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse shrink-0" />
                <span className="hidden xs:inline">Live Interactive Workspace Demo:</span><span className="xs:hidden">Demo:</span> <span className="text-emerald-400 font-mono truncate">{selectedDemoTool.title}</span>
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
                  
                  <div className="flex flex-wrap gap-3 sm:gap-4 items-center bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
                    <div className="space-y-1 w-full sm:w-auto">
                      <label className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Subscriber Phone (GHS Node)</label>
                      <input 
                        type="text" 
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-emerald-400 outline-none w-full sm:w-44 font-mono"
                      />
                    </div>
                    <div className="w-full sm:w-auto">
                      <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Momo Value</span>
                      <span className="text-emerald-300 text-sm font-bold block break-words">50.00 GHS</span>
                      <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">(Fixed subscription demo)</span>
                    </div>
                    <div className="w-full sm:w-auto">
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
              ) : selectedDemoTool.id === '5' ? (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-[11px] font-mono">// AscendSME Platform — business metrics &amp; QR invoice gateway</p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-neutral-950/60 p-2 sm:p-3 rounded-lg border border-neutral-800 text-center">
                      <span className="text-[9px] sm:text-[10px] text-neutral-500 block font-mono">Businesses</span>
                      <span className="text-emerald-400 text-base sm:text-lg font-bold font-mono">1,860</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2 sm:p-3 rounded-lg border border-neutral-800 text-center">
                      <span className="text-[9px] sm:text-[10px] text-neutral-500 block font-mono">Invoices</span>
                      <span className="text-cyan-400 text-base sm:text-lg font-bold font-mono truncate block">{ascendInvoiceCount.toLocaleString()}</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2 sm:p-3 rounded-lg border border-neutral-800 text-center">
                      <span className="text-[9px] sm:text-[10px] text-neutral-500 block font-mono">Payments (GHS)</span>
                      <span className="text-amber-400 text-base sm:text-lg font-bold font-mono">₵340K+</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => {
                        setAscendInvoicing(true);
                        const id = 'INV-' + Date.now().toString(36).toUpperCase();
                        setTimeout(() => {
                          setLastInvoiceId(id);
                          setAscendInvoiceCount(prev => prev + 1);
                          setAscendInvoicing(false);
                          onAddTrace('Content', 'generate_qr_invoice', 'gemini-3.5-flash', 95, 28, 210, 0.000014, 'success');
                          showToast('success', 'QR Invoice Generated', `Paystack checkout link created: ${id}`);
                        }, 1200);
                      }}
                      disabled={ascendInvoicing}
                      className="bg-emerald-500 text-neutral-900 font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {ascendInvoicing ? (
                        <><div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div> Generating...</>
                      ) : (
                        <>Generate QR Invoice</>
                      )}
                    </button>
                    {lastInvoiceId && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        {lastInvoiceId} ✓
                      </span>
                    )}
                  </div>
                </div>
              ) : selectedDemoTool.id === '6' ? (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-[11px] font-mono">// Hone — AI career agent scanning live job boards</p>
                  <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-neutral-500 font-mono">Matched Jobs Today</span>
                      <span className="text-[10px] text-emerald-400 font-mono">{honeMatches.length} found</span>
                    </div>
                    {honeMatches.length > 0 ? (
                      <ul className="space-y-1.5">
                        {honeMatches.map((job, i) => (
                          <li key={i} className="text-[11px] text-neutral-300 font-mono flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70"></span>
                            {job}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-neutral-500 italic font-mono">{honeScanning ? 'Scanning Adzuna + JSearch...' : 'No matches yet. Run a scan.'}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setHoneScanning(true);
                      setTimeout(() => {
                        setHoneMatches([
                          'Senior Fullstack Dev @ Paystack (Lagos) — 85% match',
                          'Product Engineer @ Flutterwave (Accra) — 82% match',
                          'ML Infrastructure Lead @ Instadeep (Remote) — 78% match'
                        ]);
                        setHoneScanning(false);
                        onAddTrace('Companion', 'scan_jobs_daily', 'gemini-3.5-flash', 280, 92, 1850, 0.000062, 'success');
                        showToast('success', 'Job Scan Complete', '3 new matches found. Cover letters drafted.');
                      }, 2000);
                    }}
                    disabled={honeScanning}
                    className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 rounded px-4 py-2 text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {honeScanning ? (
                      <><div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div> Scanning...</>
                    ) : (
                      <>🔍 Scan for Matches</>
                    )}
                  </button>
                </div>
              ) : selectedDemoTool.id === '7' ? (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-[11px] font-mono">// TradePilot AI — reasoning-first signal engine</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {tradeSignals.length === 0 && !tradeGenerating && (
                      <p className="text-[11px] text-neutral-500 italic font-mono">No signals yet. Generate one to see the AI's reasoning.</p>
                    )}
                    {tradeGenerating && (
                      <div className="bg-neutral-950/60 p-3 rounded-lg border border-amber-500/20 animate-pulse">
                        <p className="text-[11px] text-amber-300 font-mono">LLM agent analyzing BTC/USD on 6h timeframe...</p>
                      </div>
                    )}
                    {tradeSignals.map((sig, i) => (
                      <div key={i} className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold font-mono text-amber-300">{sig.pair}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${sig.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {sig.direction}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono">Entry: {sig.entry}</p>
                        <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">{sig.rationale}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setTradeGenerating(true);
                      setTimeout(() => {
                        setTradeSignals(prev => [...prev, {
                          pair: 'BTC/USD',
                          direction: Math.random() > 0.5 ? 'LONG' : 'SHORT',
                          entry: `${(45000 + Math.random() * 5000).toFixed(2)} USDT`,
                          rationale: 'On-chain flow shows accumulation across top-10 exchange wallets. SVF ratio contracting; structural bid support at $44.8K. Low time-frame compression suggests breakout within 6-12h.'
                        }]);
                        setTradeGenerating(false);
                        onAddTrace('LLM Router', 'evaluate_signal', 'gemini-3.1-pro-preview', 520, 180, 2200, 0.0032, 'success');
                        showToast('success', 'Signal Published', 'BTC/USD evaluation posted to Telegram + leaderboard.');
                      }, 2500);
                    }}
                    disabled={tradeGenerating}
                    className="bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded px-4 py-2 text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {tradeGenerating ? (
                      <><div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div> LLM Reasoning...</>
                    ) : (
                      <>Generate Signal</>
                    )}
                  </button>
                </div>
              ) : selectedDemoTool.id === '8' ? (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-[11px] font-mono">// Tiffany Events — luxury consultation &amp; proposal studio</p>
                  <div className="flex flex-wrap gap-3 items-center bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 block font-mono uppercase tracking-wider">Event Type</label>
                      <select
                        value={tiffanyEventType}
                        onChange={(e) => setTiffanyEventType(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-neutral-200 outline-none text-xs font-mono"
                      >
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Gala</option>
                        <option value="social">Social Soirée</option>
                        <option value="intimate">Intimate Dinner</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 block font-mono uppercase tracking-wider">Estimated Budget</span>
                      <span className="text-champagne text-amber-300 text-sm font-bold font-mono">$12,000 — $28,000</span>
                    </div>
                  </div>
                  {tiffanyProposal && (
                    <div className="bg-neutral-950/60 p-3 rounded-lg border border-amber-500/20">
                      <p className="text-[10px] text-amber-400 font-bold font-mono mb-1">✦ AI-Generated Proposal ✦</p>
                      <p className="text-[11px] text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap">{tiffanyProposal}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      const proposals: Record<string, string> = {
                        wedding: 'A three-act editorial narrative: ceremony in porcelain-draped garden, cocktail hour with champagne cascade, and a candlelit reception with live quartet. Mood board, floral architecture, and vendor timeline included.',
                        corporate: 'A sleek brand-aligned evening: signature cocktails, keynote stage with atmospheric projection mapping, and a seated dinner with gold-rimmed service. Full AV + PR coordination package.',
                        social: 'An intimate soirée with curated guest experience: private chef tasting menu, bespoke cocktail station, and ambient lighting design. Every detail photographed.',
                        intimate: 'A quiet luxury dinner for 8: single long table under a century olive tree, family-style service, sommelier-selected pairings. The art of unhurried hospitality.'
                      };
                      setTiffanyProposal(proposals[tiffanyEventType] || proposals.wedding);
                      onAddTrace('Companion', 'generate_event_proposal', 'gemini-3.1-pro-preview', 340, 120, 1600, 0.0018, 'success');
                      showToast('success', 'Proposal Drafted', 'Tiffany Events consultation proposal is ready for review.');
                    }}
                    className="bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded px-4 py-2 text-xs flex items-center gap-2 cursor-pointer transition-all"
                  >
                    ✦ Generate Proposal
                  </button>
                </div>
              ) : selectedDemoTool.id === '9' ? (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-[11px] font-mono">// AI Client Hunter — lead prospecting engine</p>
                  <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800 max-h-36 overflow-y-auto">
                    {hunterLeads.length === 0 && !hunterScanning && (
                      <p className="text-[11px] text-neutral-500 italic font-mono">No leads in pipeline. Scan your target market.</p>
                    )}
                    {hunterScanning && (
                      <div className="space-y-2">
                        {['Tech', 'Finance', 'Health', 'E-commerce'].map((sector, i) => (
                          <div key={sector} className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                            <div className="w-3 h-3 rounded-full border-2 border-emerald-500/30 border-t-transparent animate-spin"></div>
                            Scanning {sector} sector...
                          </div>
                        ))}
                      </div>
                    )}
                    {hunterLeads.map((lead, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-neutral-900 last:border-0">
                        <div>
                          <span className="text-[11px] text-white font-mono">{lead.company}</span>
                          <span className="text-[9px] text-neutral-500 ml-2 font-mono">{lead.industry} · {lead.location}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${lead.score >= 85 ? 'bg-emerald-500/10 text-emerald-400' : lead.score >= 70 ? 'bg-amber-500/10 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                          {lead.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setHunterScanning(true);
                      setTimeout(() => {
                        setHunterLeads([
                          { company: 'M-KOPA Ghana', score: 92, industry: 'Fintech', location: 'Accra' },
                          { company: 'Andela Talent', score: 88, industry: 'Tech', location: 'Lagos' },
                          { company: 'Kuda Bank', score: 85, industry: 'Fintech', location: 'Remote' },
                          { company: 'Twiga Foods', score: 76, industry: 'Logistics', location: 'Nairobi' }
                        ]);
                        setHunterScanning(false);
                        onAddTrace('Memory', 'discover_leads', 'gemini-3.5-flash', 190, 55, 420, 0.000032, 'success');
                        showToast('success', 'Lead Scan Complete', '4 high-intent prospects identified. Gemini enriched profiles ready.');
                      }, 2500);
                    }}
                    disabled={hunterScanning}
                    className="bg-green-500/10 border border-green-500/30 text-green-300 hover:bg-green-500/20 rounded px-4 py-2 text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {hunterScanning ? (
                      <><div className="w-3.5 h-3.5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div> Scanning...</>
                    ) : (
                      <>🎯 Scan for Leads</>
                    )}
                  </button>
                </div>
              ) : selectedDemoTool.id === '10' ? (
                <div className="space-y-4">
                  <p className="text-neutral-400 text-[11px] font-mono">// Harbour — agent control plane run dashboard</p>
                  <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800 max-h-36 overflow-y-auto">
                    {harbourRuns.length === 0 && !harbourPolling && (
                      <p className="text-[11px] text-neutral-500 italic font-mono">No active runs. Poll agents to check for scheduled work.</p>
                    )}
                    {harbourRuns.map((run, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-neutral-900 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            run.status === 'running' ? 'bg-cyan-400 animate-pulse' :
                            run.status === 'done' ? 'bg-emerald-400' :
                            run.status === 'failed' ? 'bg-rose-400' : 'bg-amber-400'
                          }`}></span>
                          <span className="text-[11px] text-white font-mono">{run.agent}</span>
                          <span className="text-[9px] text-neutral-500 font-mono">{run.job}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono uppercase ${
                            run.status === 'running' ? 'text-cyan-400' :
                            run.status === 'done' ? 'text-emerald-400' :
                            run.status === 'failed' ? 'text-rose-400' : 'text-amber-400'
                          }`}>{run.status}</span>
                          <span className="text-[9px] text-neutral-600 font-mono">{run.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setHarbourPolling(true);
                      setTimeout(() => {
                        setHarbourRuns([
                          { agent: 'Content Agent', job: 'auto-tag: building-glocal-high-rtt', status: 'done', duration: '1.2s' },
                          { agent: 'Memory Agent', job: 'sync_user_ctx: bishop-accra', status: 'running', duration: '0.4s' },
                          { agent: 'LLM Router', job: 'model_select: gemini-3.5-flash', status: 'done', duration: '140ms' },
                          { agent: 'Commerce Agent', job: 'momo_ledger_reconcile', status: 'waiting', duration: '--' }
                        ]);
                        setHarbourPolling(false);
                        onAddTrace('LLM Router', 'poll_agents_next', 'gemini-3.5-flash', 85, 22, 180, 0.000011, 'success');
                        showToast('success', 'Agents Polled', '4 runs fetched from /api/agents/next. 3 active, 1 waiting.');
                      }, 1500);
                    }}
                    disabled={harbourPolling}
                    className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 rounded px-4 py-2 text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {harbourPolling ? (
                      <><div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div> Polling /api/agents/next...</>
                    ) : (
                      <>Poll Agents</>
                    )}
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
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-950 border border-neutral-800 rounded-[25px] sm:rounded-[35px] max-w-sm w-full p-4 sm:p-6 relative shadow-2xl flex flex-col items-center"
            >
              
              {/* Phone ear speaker notch */}
              <div className="w-16 sm:w-20 h-3 sm:h-4 bg-neutral-800 rounded-full mb-4 sm:mb-6 relative">
                <div className="absolute inset-y-1 left-2 right-2 bg-neutral-950 rounded-full"></div>
              </div>

              {/* LCD Display Screen Screen Wrapper */}
              <div className="w-full bg-[#1b2b1b] border-2 sm:border-4 border-neutral-800 rounded-lg sm:rounded-xl p-3 sm:p-4 font-mono text-[11px] sm:text-[12px] text-emerald-400 aspect-[4/3] flex flex-col justify-between shadow-inner relative overflow-hidden">
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
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5 mt-4 sm:mt-6 w-full max-w-[220px] sm:max-w-[280px]">
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

              <p className="text-[8px] sm:text-[10px] text-neutral-500 font-mono mt-3 sm:mt-5 uppercase tracking-widest text-center">GSM Cell Receiver Node</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
