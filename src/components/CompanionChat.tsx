import React, { useState, useRef, useEffect } from 'react';
import { AgentTrace } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, HelpCircle, ArrowRight, CornerDownLeft, Shield, CheckCircle, Trash2, Mic, MicOff } from 'lucide-react';

interface CompanionChatProps {
  routingConfig: Record<string, string>;
  onAddTrace: (agent: 'Content' | 'Memory' | 'Companion' | 'Commerce' | 'LLM Router', task: string, model: string, inputTokens: number, outputTokens: number, latencyMs: number, costUsd: number, result: 'success' | 'failure') => void;
}

interface Message {
  sender: 'user' | 'bishop';
  text: string;
  timestamp: string;
  metric?: {
    model: string;
    costUsd: number;
    latencyMs: number;
  };
}

export default function CompanionChat({ routingConfig, onAddTrace }: CompanionChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('bishop_hub_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat history from localStorage", e);
      }
    }
    return [
      {
        sender: 'bishop',
        text: "Yo, I'm Bishop. Welcome to my workspace. I'm a developer and system architect. I built this Hub to demonstrate how a platform can self-coordinate using a five-agent mesh. Ask me anything about my tools, USSD platforms, West African telecom APIs, or how the site memory works.",
        timestamp: '10:44:01'
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice to text states
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // SVG Cognitive wave simulation paths offsets
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        onAddTrace(
          'Companion',
          'voice_audio_stream_open',
          'web-speech-api',
          0,
          0,
          50,
          0.000000,
          'success'
        );
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
          onAddTrace(
            'Companion',
            'voice_to_text_complete',
            'web-speech-api',
            0,
            0,
            120,
            0.000000,
            'success'
          );
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          onAddTrace(
            'Companion',
            `voice_error_${event.error}`,
            'web-speech-api',
            0,
            0,
            80,
            0.000000,
            'failure'
          );
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [onAddTrace]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      onAddTrace(
        'Companion',
        'voice_recognition_unsupported',
        'web-speech-api',
        0,
        0,
        30,
        0,
        'failure'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech start failed:', err);
      }
    }
  };

  const THOUGHT_STEPS = [
    "Ingesting raw query stream buffer...",
    "Routing query vectors via LLM Router node...",
    "Retrieving local chat context indices...",
    "Checking context threshold via Pro-tier rules...",
    "Constructing response embedding schema...",
    "Integrating West African edge API routing protocols...",
    "Synthesizing final character completions..."
  ];

  useEffect(() => {
    if (!isTyping) {
      setCurrentThoughtIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentThoughtIndex(prev => (prev + 1) % THOUGHT_STEPS.length);
    }, 450);

    return () => clearInterval(interval);
  }, [isTyping]);

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem('bishop_hub_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Animate cognitive wave
  useEffect(() => {
    const handle = setInterval(() => {
      setWaveOffset(prev => (prev + 0.1) % (Math.PI * 2));
    }, 45);
    return () => clearInterval(handle);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    const mockTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Append user message
    setMessages(prev => [...prev, {
      sender: 'user',
      text: userMsg,
      timestamp: mockTime
    }]);
    
    setInput('');
    setIsTyping(true);

    // Active model selected in system router
    const activeChatModel = routingConfig['conversation_chat'] || 'gemini-3.5-flash';
    const isPro = activeChatModel.includes('pro') || activeChatModel.includes('70b') || activeChatModel.includes('coder');

    setTimeout(() => {
      let baseReply = "";
      const query = userMsg.toLowerCase();

      if (query.includes('momo') || query.includes('payment') || query.includes('money') || query.includes('ghana')) {
        baseReply = "Mobile money (MoMo) tunnels are highly localized but historically jittery. My AfriCalc tool integrates standard fallback polling so checkout USSD payloads don't drop on cellular edge nodes. Never rely on provider-side hooks alone; always cache-poll natively with client retries.";
      } else if (query.includes('agent') || query.includes('mesh') || query.includes('orchestrator')) {
        baseReply = "The Hub coordinates 5 agents. The Content Agent auto-summarizes and embeds everything on publish. Memory manages context across visits. Commerce triggers payment gates, while Companion runs this chat. The LLM Router serves as a guardrail, keeping costs low by sending simple tasks to Flash and heavy tasks to Pro.";
      } else if (query.includes('tool') || query.includes('showcase') || query.includes('product')) {
        baseReply = "My tools portfolio contains both accessible public assets and advanced gated resources. Try the AfriCalc MoMo gateway demo in the Tools Tab, or upgrade your account to paid to simulate licensing keys with my Commerce Agent.";
      } else if (query.includes('pgvector') || query.includes('embed') || query.includes('memory') || query.includes('rag')) {
        baseReply = "The site memory uses three distinct tiers. Ephemeral session variables are client-only. User memory stores returning visitor metrics in my database. Site memory embeds blog posts into a vector space. When you query me, the Memory Agent does a visual cosine match across my records.";
      } else if (query.includes('soul') || query.includes('who are you') || query.includes('bishop')) {
        baseReply = "I build standalone software systems where agent intelligence exists as a core middleware layer, not just an aesthetic chat widget. I operate out of Accra, and I believe in architectural honesty—no unrequested margin clutter, no telemetry larping. Keep logs in the console where they belong, and build real tools.";
      } else {
        baseReply = "In my architecture, I prioritize highly compact structures. If we route this task through the active node, we coordinate semantic buffers to index files instantly. Let's look at doing this offline-first to avoid high cellular RTT lag.";
      }

      // Format reply prefixed text style based on the selected router
      let replyText = "";
      if (activeChatModel === 'llama-3-nvidia-70b') {
        replyText = `⚡ [NVIDIA NIM Core Gateway: LLaMA-3 Accelerated API]\n${baseReply}`;
      } else if (activeChatModel === 'llama-3.3-70b-instruct') {
        replyText = `🦙 [Meta LLaMA Suite: LLaMA-3.3 Instruct Node]\n${baseReply}`;
      } else if (activeChatModel === 'deepseek-coder-v2') {
        replyText = `💻 [OpenRouter Gateway: DeepSeek Coder-v2 Node]\n${baseReply}`;
      } else if (activeChatModel === 'gemini-3.1-pro-preview') {
        replyText = `🧠 [Google Vertex: Gemini-Pro Reasoning Mesh]\n${baseReply}`;
      } else {
        replyText = `✨ [Google Vertex: Gemini-Flash Router]\n${baseReply}`;
      }

      // Cost estimation configs based on real providers
      const inputTokens = Math.floor(userMsg.length / 4) + 120;
      const outputTokens = Math.floor(replyText.length / 4);
      
      let costUsd = 0;
      let latencyMs = 0;
      if (activeChatModel === 'llama-3-nvidia-70b') {
        costUsd = (inputTokens * 0.0000007) + (outputTokens * 0.0000009);
        latencyMs = Math.floor(Math.random() * 300) + 400; // Accelerated Matrix
      } else if (activeChatModel === 'llama-3.3-70b-instruct') {
        costUsd = (inputTokens * 0.0000006) + (outputTokens * 0.0000008);
        latencyMs = Math.floor(Math.random() * 500) + 700;
      } else if (activeChatModel === 'deepseek-coder-v2') {
        costUsd = (inputTokens * 0.00000014) + (outputTokens * 0.00000028);
        latencyMs = Math.floor(Math.random() * 400) + 600;
      } else if (activeChatModel === 'gemini-3.1-pro-preview') {
        costUsd = (inputTokens * 0.00000125) + (outputTokens * 0.00000375);
        latencyMs = Math.floor(Math.random() * 900) + 1100;
      } else {
        costUsd = (inputTokens * 0.000000075) + (outputTokens * 0.0000003);
        latencyMs = Math.floor(Math.random() * 300) + 300;
      }

      setMessages(prev => [...prev, {
        sender: 'bishop',
        text: replyText,
        timestamp: mockTime,
        metric: {
          model: activeChatModel,
          costUsd: Number(costUsd.toFixed(6)),
          latencyMs
        }
      }]);

      setIsTyping(false);

      // Add actual trace to Console state!
      onAddTrace(
        'Companion',
        'generate_chat_reply',
        activeChatModel,
        inputTokens,
        outputTokens,
        latencyMs,
        Number(costUsd.toFixed(6)),
        'success'
      );

      onAddTrace(
         'LLM Router',
         'route_task:chat',
         activeChatModel,
         60, 12, 80, 0.000005,
         'success'
      );
      
      onAddTrace(
         'Memory',
         'persist_query_embedding',
         'gemini-3.5-flash',
         110, 20, 140, 0.000010,
         'success'
       );
    }, isPro ? 1500 : 700);
  };

  const handleClearHistory = () => {
    const defaultMsg: Message[] = [
      {
        sender: 'bishop',
        text: "Yo, I'm Bishop. Welcome to my workspace. I'm a developer and system architect. I built this Hub to demonstrate how a platform can self-coordinate using a five-agent mesh. Ask me anything about my tools, USSD platforms, West African telecom APIs, or how the site memory works.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ];
    setMessages(defaultMsg);
    onAddTrace(
      'Memory',
      'clear_local_chat_history',
      'gemini-3.5-flash',
      20, 5, 40, 0.000002,
      'success'
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Generate wave path
  const getSinePath = (amplitude: number, frequency: number, phase: number) => {
    let points = [];
    for (let x = 0; x <= 200; x += 4) {
      const y = Math.sin((x / 200) * frequency * Math.PI * 2 + phase) * amplitude + 16;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <div id="companion-chat" className="border border-neutral-900 bg-neutral-950/40 rounded-xl h-full flex flex-col justify-between overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/2 rounded-full blur-3xl pointer-events-none"></div>

      {/* Companion chat header info */}
      <div className="bg-neutral-950 border-b border-neutral-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <span className="text-xs font-display font-medium text-white block">Bishop's Soul Companion</span>
              <span className="text-[10px] text-neutral-500 font-mono">Mesh active Node :: Accra</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono">
              {routingConfig['conversation_chat'] || 'gemini-3.5-flash'}
            </div>
            {messages.length > 1 && (
              <button
                onClick={handleClearHistory}
                title="Clear Chat History (Purge Memory Cache)"
                className="p-1 text-neutral-500 hover:text-rose-405 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Cognitive Sine Wave Simulator */}
        <div className="mt-3 bg-neutral-900/40 p-1.5 rounded-lg border border-neutral-905 flex items-center justify-between gap-4">
          <span className="text-[9px] font-mono text-neutral-500">cognitive link rhythm:</span>
          <svg className="h-8 w-44" viewBox="0 0 200 32">
            <path 
              d={getSinePath(isTyping ? 9 : 3, 2.5, waveOffset)} 
              fill="none" 
              className="stroke-emerald-500/40" 
              strokeWidth="1.5"
            />
            <path 
              d={getSinePath(isTyping ? 6 : 2, 4, waveOffset * 1.5)} 
              fill="none" 
              className="stroke-teal-500/20" 
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* Messages rendering area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px] min-h-[220px]">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            key={idx} 
            className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] text-neutral-500 font-mono">{msg.timestamp}</span>
              <span className="text-[10px] font-semibold text-neutral-400 font-mono capitalize">
                {msg.sender === 'user' ? 'You' : 'Bishop'}
              </span>
            </div>

            <div className={`p-3 rounded-lg text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-neutral-900 text-neutral-100 border border-neutral-800' 
                : 'bg-neutral-950/80 text-neutral-300 border border-neutral-900 font-sans'
            }`}>
              {msg.text}
            </div>

            {msg.metric && (
              <div className="mt-1 flex gap-2 font-mono text-[9px] text-neutral-500 bg-neutral-950/70 p-1 rounded border border-neutral-900">
                <span>Model: {msg.metric.model}</span>
                <span>Latency: {msg.metric.latencyMs}ms</span>
                <span>Cost: ${msg.metric.costUsd.toFixed(6)}</span>
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start max-w-[85%] w-full space-y-2">
            <div className="text-[10px] font-semibold text-neutral-500 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              Thinking Process Active...
            </div>
            
            {/* Dynamic Agent Thought Monologue Panel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-neutral-950/90 border border-neutral-900 rounded-lg p-3 space-y-1.5 font-mono text-[10px]"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-1.5 text-[8.5px] text-neutral-500 uppercase tracking-widest">
                <span>Agent Monologue</span>
                <span className="text-emerald-400 font-bold animate-pulse">● processing</span>
              </div>
              <div className="text-emerald-300 flex items-start gap-1">
                <span className="text-emerald-500 shrink-0 font-bold animate-pulse">&gt;</span>
                <p className="italic leading-normal text-emerald-300">
                  {THOUGHT_STEPS[currentThoughtIndex]}
                </p>
              </div>
            </motion.div>

            <div className="bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}

        <div ref={scrollRef}></div>
      </div>

      {/* Suggested prompts */}
      <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1 border-t border-neutral-900 bg-neutral-950/20">
        <button 
          onClick={() => setInput("Explain Bishop's agent mesh setup.")}
          className="text-[9px] bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white px-2 py-1 rounded border border-neutral-800 font-mono cursor-pointer transition-colors"
        >
          Discuss Agents
        </button>
        <button 
          onClick={() => setInput("What is AfriCalc Mobile Money Gate?")}
          className="text-[9px] bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white px-2 py-1 rounded border border-neutral-800 font-mono cursor-pointer transition-colors"
        >
          MoMo Billing
        </button>
        <button 
          onClick={() => setInput("Tell me about pgvector optimization.")}
          className="text-[9px] bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white px-2 py-1 rounded border border-neutral-800 font-mono cursor-pointer transition-colors"
        >
          Vector indexing
        </button>
      </div>

      {/* Dynamic Native LLM Route and Cost/Performance Tier Indicator */}
      <div className="px-4 py-2 border-t border-neutral-900 bg-neutral-950/60 flex items-center justify-between text-[10px] font-mono leading-none">
        <div className="flex items-center gap-1.5 text-neutral-450">
          <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Active LLM Routing:</span>
          <span className="text-emerald-300 font-bold">{routingConfig['conversation_chat'] || 'gemini-2.5-flash'}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-900/60 px-2 py-0.5 rounded border border-neutral-800/80">
          <span className={`w-1 h-1 rounded-full animate-pulse ${
            (routingConfig['conversation_chat'] || 'gemini-2.5-flash').includes('pro') 
              ? 'bg-purple-400' 
              : 'bg-emerald-400'
          }`} />
          <span className="text-[8.5px] text-neutral-500 uppercase font-semibold">
            {(routingConfig['conversation_chat'] || 'gemini-2.5-flash').includes('pro') ? 'Pro (Performance)' : 'Flash (Cost Saver)'}
          </span>
        </div>
      </div>

      {/* Input section */}
      <div className="p-3 border-t border-neutral-900 bg-neutral-950 flex gap-2 items-center">
        <button
          onClick={toggleListening}
          title={isListening ? "Listening... click to stop" : "Use Voice Dictation"}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
            isListening 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-750'
          }`}
        >
          {isListening ? (
            <MicOff className="w-3.5 h-3.5 animate-bounce" />
          ) : (
            <Mic className="w-3.5 h-3.5" />
          )}
        </button>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Dictation active... talk now" : "Ask Bishop a tech question..."} 
          className="bg-neutral-900 text-xs text-neutral-200 border border-neutral-800 rounded-lg px-3 py-2.5 outline-none flex-1 focus:border-neutral-700 font-sans" 
        />
        <button 
          onClick={handleSend}
          className="w-8 h-8 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-lg transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
