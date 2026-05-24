import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { INITIAL_POSTS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, Clock, ChevronRight, User, AlertCircle, Sparkles, Wand2, Terminal } from 'lucide-react';

interface BlogViewProps {
  onAddTrace: (agent: 'Content' | 'Memory' | 'Companion' | 'Commerce' | 'LLM Router', task: string, model: string, inputTokens: number, outputTokens: number, latencyMs: number, costUsd: number, result: 'success' | 'failure') => void;
}

// Lightweight body renderer: code blocks, inline code, headers, paragraphs
function renderBody(body: string): React.ReactNode[] {
  const blocks: React.ReactNode[] = [];
  let key = 0;

  // Split on triple backtick blocks (with optional language hint)
  const parts = body.split(/(```\w*\n[\s\S]*?```)/g);

  for (const part of parts) {
    if (part.startsWith('```')) {
      // Code block
      const inner = part
        .replace(/```\w*\n?/, '')
        .replace(/```$/, '')
        .trimEnd();
      blocks.push(
        <div key={key++} className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden my-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[10px] text-neutral-500 font-mono">
            <Terminal className="w-3 h-3" />
            <span>terminal</span>
          </div>
          <pre className="p-3 text-[12px] leading-relaxed font-mono text-emerald-300 overflow-x-auto"><code>{inner}</code></pre>
        </div>
      );
    } else if (part.trim()) {
      // Regular text — split on double newlines for paragraphs
      const paragraphs = part.split(/\n\n+/);
      for (const para of paragraphs) {
        if (!para.trim()) continue;
        // Detect markdown headers
        const headerMatch = para.match(/^(#{1,3})\s+(.+)$/m);
        if (headerMatch) {
          const level = headerMatch[1].length;
          const text = headerMatch[2];
          const sizeClass = level === 1 ? 'text-base font-bold' : level === 2 ? 'text-sm font-semibold' : 'text-xs font-semibold';
          blocks.push(
            <h3 key={key++} className={`${sizeClass} text-emerald-400 font-display mt-4 mb-2 tracking-tight`}>
              {text}
            </h3>
          );
          continue;
        }
        // Detect horizontal rules (---, ***, ___ with 3+ chars)
        if (/^[-*_]{3,}$/.test(para.trim())) {
          blocks.push(<hr key={key++} className="border-t border-neutral-800 my-4" />);
          continue;
        }
        // Detect pipe tables (simple line-by-line)
        if (para.trim().startsWith('|') && para.trim().endsWith('|')) {
          const rows = para.trim().split('\n').filter(r => r.trim());
          if (rows.length >= 2) {
            const headerCells = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
            const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));
            blocks.push(
              <div key={key++} className="overflow-x-auto my-3">
                <table className="w-full text-[11px] font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-500/20">
                      {headerCells.map((h, i) => (
                        <th key={i} className="text-left px-2 py-1.5 text-emerald-400 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, ri) => (
                      <tr key={ri} className="border-b border-neutral-900/60">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-2 py-1.5 text-neutral-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            continue;
          }
        }
        // Inline code: backtick-wrapped
        const segments = para.split(/(`[^`]+`)/g);
        const children: React.ReactNode[] = [];
        let idx = 0;
        for (const seg of segments) {
          if (seg.startsWith('`') && seg.endsWith('`')) {
            children.push(
              <code key={idx++} className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[11px] font-mono text-emerald-400">
                {seg.slice(1, -1)}
              </code>
            );
          } else if (seg.trim()) {
            // Split segments with single newlines (line breaks within a paragraph)
            const lines = seg.split(/\n(?!\n)/);
            lines.forEach((line, li) => {
              if (li > 0) children.push(<br key={`br-${idx}`} />);
              children.push(<span key={idx++}>{line}</span>);
            });
          }
        }
        blocks.push(
          <p key={key++} className="text-xs text-neutral-300 leading-relaxed font-sans mb-3 last:mb-0">
            {children}
          </p>
        );
      }
    }
  }

  return blocks;
}

export default function BlogView({ onAddTrace }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [summarizedText, setSummarizedText] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedPost) {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const element = articleRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const headerOffset = 140; // navbar + spacing offset
      const elementHeight = rect.height;

      if (rect.top > headerOffset) {
        setScrollProgress(0);
        return;
      }

      const visibleHeight = window.innerHeight - headerOffset;
      const scrolledPast = headerOffset - rect.top;
      const maxScroll = elementHeight - visibleHeight;

      if (maxScroll <= 0) {
        setScrollProgress(100);
        return;
      }

      const progress = (scrolledPast / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Set initial progress with minor layout-rendering timeout delay
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, [selectedPost]);

  const handleReadPost = (post: Post) => {
    setSelectedPost(post);
    setSummarizedText(null);
    setIsSummarizing(false);

    // Add Memory read trace tracker
    onAddTrace(
      'Memory',
      `log_user_interaction:read_post:${post.slug}`,
      'gemini-3.5-flash',
      150, 24, 180, 0.000018,
      'success'
    );
  };

  const handleSimulateSummary = (post: Post) => {
    setIsSummarizing(true);
    
    // Simulate LLM Call details specifically routed by standard rules
    setTimeout(() => {
      let mockSummary = '';
      if (post.id === '1') {
        mockSummary = "Content summarized by AI Agent: African telecommunication environments are contextually constrained by standard network jitter and high latency. Systems should prioritize light optimistic local writes coupled with exponential status-polling strategies to ensure seamless, crash-free Momo purchases.";
      } else if (post.id === '2') {
        mockSummary = "Content summarized by AI Agent: Ditch monolithic lock architectures. Instead, build decentralized node meshes where coordinate nodes carry independent storage buffers. Lightweight log synchronization resolves state issues with zero race hazards.";
      } else if (post.id === '3') {
        mockSummary = "Content summarized by AI Agent: Standalone serverless microcontainers are cost-effective but run restricted heap pools. By fine-tuning pgvector parameters with small chunk margins, we can keep index similarity operations fast and economical.";
      } else if (post.id === '4') {
        mockSummary = "Content summarized by AI Agent: Freebuff is a free agentic CLI that routes prompts through a multi-model mesh — DeepSeek v4-Flash, Gemini Pro, Claude Opus. No API key needed, no subscription. The business model is lightweight terminal ads every 10th response, with zero tracking or data collection. Install with `npm i -g freebuff`.";
      } else if (post.id === '5') {
        mockSummary = "Content summarized by AI Agent: AscendSME is a three-platform business OS for Ghanaian SMEs — React web app, Flutter mobile app, and Remotion launch trailer — all sharing a single Supabase backend. Four AI agents (Diagnostic, WhatsApp Engagement, Document Intelligence, Credit Scoring) operate across surfaces with automatic fallback chains through Gemini, Groq, and OpenRouter. The agent architecture provides graceful degradation, unified logging, and cross-platform reuse.";
      } else {
        mockSummary = "Content summarized by AI Agent: Node processed and indexed into the Hub's knowledge graph.";
      }

      setSummarizedText(mockSummary);
      setIsSummarizing(false);

      // Trigger Content summary agent traces!
      onAddTrace(
        'Content',
        `generate_post_summary:${post.slug}`,
        'gemini-3.5-flash',
        520, 110, 890, 0.000078,
        'success'
      );
      onAddTrace(
        'LLM Router',
        'route_task:summarize',
        'gemini-3.5-flash',
        80, 10, 110, 0.000006,
        'success'
      );
    }, 1200);
  };

  return (
    <div id="blog-section" className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          // List View
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="border-b border-neutral-800 pb-5">
              <h2 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Technical Blog &amp; Glocal Guides
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Refined lessons from building decentralized apps out of West Africa.
              </p>
            </div>

            <div className="space-y-4">
              {INITIAL_POSTS.map((post, idx) => (
                <motion.div 
                  key={post.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => handleReadPost(post)}
                  className="bg-neutral-950/40 border border-neutral-900 rounded-xl p-5 hover:border-neutral-800 hover:bg-neutral-950/80 transition-all cursor-pointer flex justify-between items-start group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/1 to-transparent rounded-bl-full pointer-events-none transition-all group-hover:from-emerald-500/3"></div>
                  
                  <div className="space-y-2.5 max-w-2xl relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-900 text-emerald-405 border border-neutral-850 font-mono">
                        {post.category}
                      </span>
                      <div className="flex items-center text-neutral-500 text-xs font-mono gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt}
                      </div>
                    </div>

                    <h3 className="text-base font-display font-semibold text-neutral-200 group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="h-full flex items-center self-center pl-4 z-10">
                    <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          // Detailed Article View
          <motion.div 
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
            ref={articleRef}
          >
            {/* Global Fixed Subtle Reading Line just beneath sticky top-bar */}
            <div className="fixed top-[57px] left-0 right-0 h-[2.5px] bg-transparent z-50 pointer-events-none overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-100 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Inline Subtle Reading Progress Header widget */}
            <div className="w-full flex flex-col gap-2 pb-5 border-b border-neutral-900/40">
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5 truncate max-w-[80%]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Glocal Article Node Progress: <span className="text-neutral-300 font-semibold">{selectedPost.title}</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold text-xs">{Math.round(scrollProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/40">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-450 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              {/* Dynamic Estimated Read Time VS Time Remaining */}
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-0.5">
                <div className="flex items-center gap-1 text-neutral-400">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Est. Read Time: <strong className="text-neutral-200">{selectedPost.readTime}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Time Remaining:</span>
                  <span className="text-emerald-300 font-bold bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded">
                    {(() => {
                      const totalMin = parseInt(selectedPost.readTime) || 5;
                      const totalSec = totalMin * 60;
                      const remSec = Math.max(0, Math.ceil(totalSec - (totalSec * (scrollProgress / 100))));
                      const remMin = Math.floor(remSec / 60);
                      const partSec = remSec % 60;
                      if (remSec === 0) return 'Complete';
                      return remMin > 0 ? `${remMin}m ${partSec}s` : `${partSec}s`;
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1 font-mono cursor-pointer"
              >
                &larr; Back to Article List
              </button>
              <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <User className="w-3.5 h-3.5" />
                  By Bishop
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedPost.readTime}
                </span>
              </div>
            </div>

            {/* Article Header */}
            <div className="space-y-3">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 font-mono">
                {selectedPost.category}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-semibold text-white tracking-tight leading-tight">
                {selectedPost.title}
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-400 italic font-sans leading-relaxed border-l-2 border-emerald-500 pl-2.5 sm:pl-3.5 py-0.5">
                "{selectedPost.excerpt}"
              </p>
            </div>

            {/* Core Post Article Content */}
            <div className="bg-neutral-950/20 border border-neutral-900 rounded-xl p-4 sm:p-6 font-sans text-neutral-300 leading-relaxed space-y-4 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/1 rounded-full blur-2xl pointer-events-none"></div>
              {renderBody(selectedPost.body)}
              <p className="text-neutral-400 text-xs">
                In any standard web deployment, we default to relying exclusively on rich fiber links. But mobile-first applications deployed in local transport hubs demand an extremely pragmatic protocol. We must minimize JSON response payload boundaries, utilize tiny compression buffers (exactly 8-bit integers where feasible), and implement standard offline replication engines directly in the client context.
              </p>
              <p className="text-neutral-400 text-xs">
                Over the upcoming weeks, the Content Agent will automatically link these concepts dynamically into our central Knowledge Graph, letting the Bishop Soul Companion draw directly on real-time references during active sessions.
              </p>
            </div>

            {/* Interactive Agent Summarizer Section */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 sm:p-5 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs text-neutral-300 uppercase font-mono font-bold tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    Content Agent - Semantic Summarizer
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Click below to trigger a live model-routed agent summary trace.
                  </p>
                </div>

                {!summarizedText && (
                  <button
                    onClick={() => handleSimulateSummary(selectedPost)}
                    disabled={isSummarizing}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs font-semibold text-emerald-400 hover:text-emerald-300 border border-neutral-800 rounded-lg transition-all cursor-pointer"
                  >
                    {isSummarizing ? 'Summarizing...' : 'Summarize with LLM'}
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isSummarizing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 py-4 justify-center"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
                    <span className="text-xs text-neutral-500 font-mono">Orchestrator invoking Content Agent via LLM Router...</span>
                  </motion.div>
                )}

                {summarizedText && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-neutral-900/60 border border-emerald-950/30 rounded-lg text-xs leading-relaxed text-emerald-300 font-mono shadow-inner"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                      <Wand2 className="w-3.5 h-3.5" />
                      Extracted Summary:
                    </div>
                    {summarizedText}
                    
                    <div className="mt-3 flex justify-end gap-3 text-[10px] text-neutral-500 border-t border-neutral-800/80 pt-2.5">
                      <span>Model: <strong>Gemini-3.5-Flash</strong></span>
                      <span>Cost: <strong>$0.000078</strong></span>
                      <span>Latency: <strong>890ms</strong></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
