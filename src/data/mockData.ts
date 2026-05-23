import { Tool, Post, Agent, AgentTrace } from '../types';

export const BISHOP_SOUL = {
  name: "Bishop",
  origin: "Accra, Ghana 🇬🇭",
  tagline: "Building hyper-focused systems where intelligence is a layer, not a feature.",
  voiceNotes: [
    "I believe code should declare less and do more. No larping.",
    "African developer tools need globally competitive reliability with localized value flows.",
    "If it underperforms, it gets pruned. The models will scale; the soul stays stable."
  ],
  interests: ["Agent mesh networks", "Local African fintech APIs", "pgvector indexing", "Micro-SaaS models"]
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'content',
    name: 'Content Agent',
    role: 'Publishes, tags, and autolinks system insights',
    status: 'active',
    icon: 'Layers',
    description: 'Watches workspace drafts, runs semantic chunking, and indexes them directly into the vector store.'
  },
  {
    id: 'memory',
    name: 'Memory Agent',
    role: 'Manages user identities & persistent context',
    status: 'active',
    icon: 'Database',
    description: 'Saves multi-session feedback, updates returning visitor interest matrices, and handles client local vectors.'
  },
  {
    id: 'companion',
    name: 'Companion Agent',
    role: "The Hub's live interactive conversation soul",
    status: 'active',
    icon: 'Sparkles',
    description: 'Binds to bishop_soul.md to answer architectural and tech queries in Bishop\'s native voice.'
  },
  {
    id: 'commerce',
    name: 'Commerce Agent',
    role: 'Coordinates purchases, downloads, and gatekeeper tokens',
    status: 'sleeping',
    icon: 'DollarSign',
    description: 'Interfaces with mobile money networks and international processors to authorize tier elevations.'
  },
  {
    id: 'router',
    name: 'LLM Router Agent',
    role: 'Selects the optimal model for low-latency & high efficiency',
    status: 'active',
    icon: 'Cpu',
    description: 'Redirects trivial tasking to cheaper models (Gemini Flash) while escalating code evals to Gemini Pro.'
  }
];

export const INITIAL_TOOLS: Tool[] = [
  {
    id: '1',
    title: 'AfriCalc Mobile Money Gate',
    slug: 'africalc-momo-gate',
    description: 'Clean, client-side React bindings to streamline mobile money invoice processing and standard USSD checkout scripts across East/West African APIs (MTN, Telecel, AirtelTigo).',
    tier: 'public',
    price: 'Free',
    tags: ['Fintech', 'React', 'USSD'],
    downloads: 1420
  },
  {
    id: '2',
    title: 'pgvector Schema Architect',
    slug: 'pgvector-schema-architect',
    description: 'An AI assistant that maps standard relational database models into high-performance pgvector formats with optimized cosine similarity indices.',
    tier: 'free',
    price: 'Requires account',
    tags: ['AI', 'SQL', 'Databases'],
    downloads: 840
  },
  {
    id: '3',
    title: 'Prompt-to-USSD Workspace Pro',
    slug: 'ussd-workspace-pro',
    description: 'A developer IDE playground to build, simulate, and visually dry-run interactive multi-step GSM USSD applications. Export directly to Node.js or Kotlin.',
    tier: 'paid',
    price: '$29 one-time',
    tags: ['IDE', 'Telecom', 'Node.js'],
    downloads: 310
  },
  {
    id: '4',
    title: 'Gemini Markdown Content Packer',
    slug: 'gemini-markdown-packer',
    description: 'Bundles dense documentation folders into highly structured, context-compressed LLM reading files, avoiding token waste.',
    tier: 'public',
    price: 'Free',
    tags: ['AI', 'CLI', 'Productivity'],
    downloads: 2450
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'Building Glocal: Software Architecture for High RTT Environments',
    slug: 'building-glocal-high-rtt',
    excerpt: 'How to structure modern full-stack systems that handle cellular dropouts, intermittent mobile money callbacks, and offline-first queue caches in Accra and Lagos.',
    category: 'article',
    readTime: '6 min read',
    publishedAt: 'May 18, 2026',
    body: 'Developing for African cellular networks means expecting 1200ms round trips, occasional packet drops, and sudden provider dropouts. To survive, your layout shouldn\'t lock up. This guide covers optimistic state structures, atomic Momo polling caches, and elegant fallback offline states.'
  },
  {
    id: '2',
    title: 'Deep Dive: Multi-Agent Synchronization and Vector Clocks',
    slug: 'multi-agent-sync-vector',
    excerpt: 'Ditching heavy state machines for markdown-driven agent instructions. How the Hub\'s internal agents resolve resource contention through light JSON logs.',
    category: 'howto',
    readTime: '8 min read',
    publishedAt: 'May 12, 2026',
    body: 'Traditionally, coordination means database locks. In agent-native environments, each agent carries a unique scoped memory. Here is a modular system to construct an elegant central orchestrator that guides specialized roles (Memory, Content, Commerce) with zero server-side race conditions.'
  },
  {
    id: '3',
    title: 'Guide to Deploying pgvector on Standalone Cloud Run Instances',
    slug: 'deploying-pgvector-cloud-run',
    excerpt: 'Step-by-step tutorial on containers with small memory footprint running serverless PostgreSQL embeddings with low cost models.',
    category: 'guide',
    readTime: '12 min read',
    publishedAt: 'May 04, 2026',
    body: 'Cloud Run provides outstanding scaling. Combined with modern PostgreSQL, you have a solid, highly cost-effective vector index engine. We will write Docker configurations, define small memory thresholds, and explain search optimization metrics using cosine similarity.'
  }
];

export const INITIAL_TRACES: AgentTrace[] = [
  {
    id: 'tr-001',
    agent: 'Content',
    task: 'tag_post',
    model: 'gemini-3.5-flash',
    inputTokens: 380,
    outputTokens: 52,
    latencyMs: 720,
    costUsd: 0.000030,
    result: 'success',
    timestamp: '10:41:04'
  },
  {
    id: 'tr-002',
    agent: 'LLM Router',
    task: 'model_select',
    model: 'gemini-3.5-flash',
    inputTokens: 120,
    outputTokens: 15,
    latencyMs: 140,
    costUsd: 0.000008,
    result: 'success',
    timestamp: '10:41:04'
  },
  {
    id: 'tr-003',
    agent: 'Memory',
    task: 'retrieve_user',
    model: 'gemini-3.5-flash',
    inputTokens: 512,
    outputTokens: 82,
    latencyMs: 640,
    costUsd: 0.000045,
    result: 'success',
    timestamp: '10:42:15'
  },
  {
    id: 'tr-004',
    agent: 'Companion',
    task: 'generate_chat_reply',
    model: 'gemini-3.1-pro-preview',
    inputTokens: 1420,
    outputTokens: 290,
    latencyMs: 1850,
    costUsd: 0.002200,
    result: 'success',
    timestamp: '10:44:01'
  }
];
