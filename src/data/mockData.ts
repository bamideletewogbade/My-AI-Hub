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
    id: 'router',
    name: 'LLM Router Agent',
    role: 'Selects the optimal model for low-latency & high efficiency',
    status: 'active',
    icon: 'Cpu',
    description: 'Routes simple queries to lightweight open models (LLaMA 3.1 8B local) while escalating code and reasoning to larger models (LLaMA 3.3 70B, DeepSeek Coder).'
  }
];

export const INITIAL_TOOLS: Tool[] = [
  {
    id: '1',
    title: 'AfriCalc Mobile Money Gate',
    slug: 'africalc-momo-gate',
    description: 'Clean, client-side React bindings to streamline mobile money invoice processing and standard USSD checkout scripts across East/West African APIs (MTN, Telecel, AirtelTigo).',
    tags: ['Fintech', 'React', 'USSD'],
    downloads: 1420
  },
  {
    id: '2',
    title: 'pgvector Schema Architect',
    slug: 'pgvector-schema-architect',
    description: 'An AI assistant that maps standard relational database models into high-performance pgvector formats with optimized cosine similarity indices.',
    tags: ['AI', 'SQL', 'Databases'],
    downloads: 840
  },
  {
    id: '3',
    title: 'Prompt-to-USSD Workspace Pro',
    slug: 'ussd-workspace-pro',
    description: 'A developer IDE playground to build, simulate, and visually dry-run interactive multi-step GSM USSD applications. Export directly to Node.js or Kotlin.',
    tags: ['IDE', 'Telecom', 'Node.js'],
    downloads: 310
  },
  {
    id: '4',
    title: 'Gemini Markdown Content Packer',
    slug: 'gemini-markdown-packer',
    description: 'Bundles dense documentation folders into highly structured, context-compressed LLM reading files, avoiding token waste.',
    tags: ['AI', 'CLI', 'Productivity'],
    downloads: 2450
  },
  {
    id: '5',
    title: 'AscendSME Platform Suite',
    slug: 'ascendsme-suite',
    description: 'A comprehensive business management ecosystem for Ghanaian SMEs spanning a React web platform, Flutter mobile app, and cinematic AI launch trailer. Features Supabase backend, Paystack payments, QR code invoicing, and AI-powered diagnostics via Gemini, Groq, and OpenRouter.',
    tags: ['SME', 'Fintech', 'React', 'Flutter', 'Mobile'],
    downloads: 1860,
    repoUrl: 'https://github.com/Collinlar/ascendsme-b'
  },
  {
    id: '6',
    title: 'Hone — AI Career Agent',
    slug: 'hone-ai-career',
    description: 'A persistent AI career agent that ingests your CV, learns your goals, scans for real jobs daily, and drafts tailored applications in the background. Provider-agnostic LLM architecture supporting Anthropic, OpenAI, Google, Groq, Mistral, and Ollama with no lock-in.',
    tags: ['AI', 'Career', 'Next.js', 'Productivity'],
    downloads: 920,
    repoUrl: 'https://github.com/bamideletewogbade/hone'
  },
  {
    id: '7',
    title: 'TradePilot AI',
    slug: 'tradepilot-ai',
    description: 'A reasoning-first crypto trading signal engine that publishes every signal with full AI rationale and tracks outcomes publicly — wins, losses, and timeouts alike. Python engine, Telegram bot, and Next.js public leaderboard with zero cherry-picking.',
    tags: ['Crypto', 'AI', 'Trading', 'Python'],
    downloads: 480,
    repoUrl: 'https://github.com/bamideletewogbade/tradepilot-ai'
  },
  {
    id: '8',
    title: 'Tiffany Events Studio',
    slug: 'tiffany-events',
    description: 'A luxury event styling marketing site with an AI consultation assistant and proposal generator. Built with Next.js 14, Framer Motion, and a locked editorial design system featuring onyx, porcelain, and champagne gold tokens.',
    tags: ['Events', 'Next.js', 'AI', 'Luxury'],
    downloads: 650,
    repoUrl: 'https://github.com/bamideletewogbade/tiffany-events'
  },
  {
    id: '9',
    title: 'AI Client Hunter',
    slug: 'ai-client-hunter',
    description: 'An AI-powered lead generation, sales intelligence, and client acquisition platform for freelancers and agencies. Features Google Maps integration, Firebase backend, Recharts analytics, and Gemini-driven prospecting.',
    tags: ['AI', 'Sales', 'CRM', 'React'],
    downloads: 1340,
    repoUrl: 'https://github.com/bamideletewogbade/AI-Client-Hunter'
  },
  {
    id: '10',
    title: 'Harbour',
    slug: 'harbour-control-plane',
    description: 'A control plane for AI agents doing ongoing work — managing recurring jobs, shared docs, encrypted env vars, and agent-managed databases. Features a polling-based architecture where agents pull work on their own schedule. Built with Next.js, SQLite, and shadcn/ui.',
    tags: ['AI', 'Dev Tools', 'Next.js', 'Productivity'],
    downloads: 780,
    repoUrl: 'https://github.com/geekforbrains/harbour'
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
  },
  {
    id: '5',
    title: 'AscendSME: Building an AI-Augmented Business OS for Ghanaian SMEs',
    slug: 'ascendsme-ai-agent-ecosystem',
    excerpt: 'How the AscendSME ecosystem weaves AI agents — diagnostics, WhatsApp engagement, document intelligence, and credit scoring — across a React web platform, Flutter mobile app, and cinematic launch trailer.',
    category: 'article',
    readTime: '10 min read',
    publishedAt: 'May 22, 2026',
    body: 'AscendSME started as a simple proposition: give Ghanaian small-business owners the same operational tooling that enterprise companies take for granted. But in a market where internet is metered, devices are mixed-generation, and bank integration means mobile money USSD, you cannot just wrap a Stripe dashboard and call it a day. You need agents.

## The Three-Platform Approach

Rather than building one monolithic app, AscendSME spans three surfaces, each serving a different user context:

| Platform | Stack | Primary Use Case |
|---|---|---|
| Web App | React 18 + Supabase + Paystack + Leaflet | Desktop invoicing, analytics, business registration |
| Mobile App | Flutter 3 + Material 3 + Supabase + Gemini SDK | On-the-go inventory, AI diagnostics, QR payments |
| Launch Video | Remotion + React + TypeScript | Investor pitches, grant applications, brand awareness |

All three share a **single Supabase backend** — same auth pool, same Postgres schema, same row-level security policies. This means a business can register on the web, receive invoices on mobile, and export data from either surface without sync conflicts.

## The AI Agent Layer

Here is where the architecture gets interesting. AscendSME runs **four AI agents** that operate across the platform surfaces, coordinated through a shared agent service layer:

### 1. Diagnostic Agent (Onboarding & Health)

When a new SME owner registers, the Diagnostic Agent runs an intake interview through a conversational UI. It asks about revenue bands, employee count, inventory volume, and current bookkeeping method. Based on the responses, it produces:

- A **business health score** (0–100) with breakdowns by liquidity, documentation, and digital maturity
- **Personalized recommendations** — e.g., "You have 14 unpaid invoices averaging GHS 820. Enable automated reminders to reduce your DSO by ~40%."
- A **roadmap** of which AscendSME features to activate first

```typescript
// Simplified diagnostic pipeline (web + mobile share the same logic)
async function runDiagnostic(businessId: string, answers: SurveyAnswers) {
  const prompt = `
    Based on the following SME profile, generate a health score,
    3 actionable recommendations, and a priority feature roadmap.
    Respond as JSON only.

    Revenue: ${answers.revenueBand}
    Employees: ${answers.employeeCount}
    Inventory SKUs: ${answers.inventoryCount}
    Bookkeeping: ${answers.bookkeepingMethod}
    Region: ${answers.region}
  `;

  const result = await aiService.ask(prompt, { model: 'gemini-pro' });
  return JSON.parse(result);
}
```

The agent runs on **Gemini Pro** by default, with automatic fallback to **Groq Llama 3** when the Gemini API is degraded. This fallback chain is defined once in `AIService.ask()` and shared across all agents.

### 2. WhatsApp Engagement Agent (Customer-Facing)

One of the most requested features from our pilot SMEs was WhatsApp-based customer engagement. Most Ghanaian consumers do not check email regularly, but they read WhatsApp. The WhatsApp Agent:

- Sends **automated invoice reminders** via the WhatsApp Business API when an invoice passes its due date
- Answers **customer queries** like "Do you have size 42 in stock?" by querying the Supabase inventory table and generating a natural-language response
- Collects **delivery feedback** after order completion

The mobile app renders a phone mockup showing the agent in action — messages appear character-by-character, simulating the WhatsApp interface. The video trailer also features this scene prominently.

```dart
// Flutter AI service call with Groq fallback (from AGENTS.md)
Future<String> ask(String prompt, {AIModel preferred = AIModel.gemini}) async {
  try {
    return await _askGemini(prompt);
  } on GeminiException {
    log.warning('Gemini degraded, falling back to Groq');
    try {
      return await _askGroq(prompt);
    } on GroqException {
      log.warning('Groq also degraded, falling back to OpenRouter');
      return await _askOpenRouter(prompt);
    }
  }
}
```

### 3. Document Intelligence Agent (Receipts & Records)

Ghanaian SMEs often deal with paper receipts, handwritten ledgers, and WhatsApp-forwarded screenshots of bank transfers. The Document Agent ingests images via the mobile camera or web upload and extracts structured data:

- **Receipt parsing**: Vendor name, date, items, total → auto-logged into the expense ledger
- **Invoice matching**: Matches incoming payments to outstanding invoices using fuzzy date and amount comparison
- **Report generation**: Compiles monthly P&L statements from parsed records, flagging anomalies

The extraction pipeline uses `react-markdown` and `xlsx` on the web side for rendering parsed output as formatted tables and Excel exports.

### 4. Credit Scoring Agent (Risk Assessment)

This is the most ambitious agent. Using the business\'s transaction history, invoice payment patterns, and diagnostic responses, the Credit Agent computes a **credit readiness score** that SMEs can present to microfinance institutions or investors.

The scoring model is a lightweight logistic regression running on aggregated feature vectors extracted from:

```
features = {
  'invoice_payment_rate': paid_invoices / total_invoices,
  'avg_dso_days': average_days_to_payment,
  'revenue_volatility': std_dev_monthly_revenue / mean_monthly_revenue,
  'inventory_turnover': cost_of_goods_sold / average_inventory,
  'documentation_score': parsed_receipts / estimated_transactions,
  'digital_adoption_score': feature_usage_count / total_features
}
```

Scores above 70 qualify for a digital credit report that can be shared via a signed QR code. This QR integrates with the same `qrcode` + `jspdf` pipeline used for regular invoicing.

## The Supabase Backbone

All four agents read from and write to the same Supabase project. The schema is shared between web and mobile:

```sql
-- Core tables shared across platforms
CREATE TABLE businesses (id UUID PRIMARY KEY, name TEXT, region TEXT, ...);
CREATE TABLE invoices (id UUID PRIMARY KEY, business_id UUID REFERENCES businesses, ...);
CREATE TABLE inventory (id UUID PRIMARY KEY, business_id UUID REFERENCES businesses, ...);
CREATE TABLE agent_logs (id UUID PRIMARY KEY, agent TEXT, action TEXT, metadata JSONB, created_at TIMESTAMPTZ);
```

The `agent_logs` table is critical — every agent action is logged so the system can audit recommendations, retry failed operations, and feed into the Credit Agent\'s feature pipeline.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Client Surfaces                       │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────┐    │
│  │ Web App  │  │ Flutter    │  │ Remotion Video   │    │
│  │ (React)  │  │ (Mobile)   │  │ (Launch Trailer) │    │
│  └────┬─────┘  └─────┬──────┘  └──────────────────┘    │
│       │              │                                   │
├───────┴──────────────┴───────────────────────────────────┤
│                   Supabase Backend                        │
│  ┌──────────────┬──────────────┬─────────────────────┐   │
│  │ Auth (RLS)   │ Postgres     │  Storage (receipt   │   │
│  │              │ (with views) │  images, reports)   │   │
│  └──────────────┴──────────────┴─────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│                    AI Agent Layer                          │
│  ┌──────────┬──────────────┬──────────┬──────────────┐   │
│  │Diagnostic│  WhatsApp    │ Document │ Credit       │   │
│  │ Agent    │  Agent       │ Agent    │ Scoring Agent│   │
│  └────┬─────┴──────┬───────┴────┬─────┴──────┬───────┘   │
│       │            │           │             │           │
├───────┴────────────┴───────────┴─────────────┴───────────┤
│              AI Provider Mesh (AIService)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐    │
│  │ Gemini   │  │ Groq     │  │ OpenRouter           │    │
│  │ (Primary)│  │(Fallback)│  │(Secondary Fallback)  │    │
│  └──────────┘  └──────────┘  └──────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

## The Launch Video as Agent Documentation

The AscendSME launch trailer (built with Remotion, 2m30s, 1920×1080) does double duty: it serves as both a pitch tool and a visual walkthrough of the agent system. The nine scenes map directly to the agent architecture:

| Scene | Timing | Agent / Concept Shown |
|---|---|---|
| Opening | 0:00–0:21 | "Across Africa" — context setting |
| Problem | 0:21–0:41 | Bank risk aversion — why agents are needed |
| Product Intro | 0:41–0:56 | AscendSME reveal |
| AI Diagnostic | 0:56–1:16 | **Diagnostic Agent** — onboarding flow |
| WhatsApp Agent | 1:16–1:36 | **WhatsApp Agent** — customer engagement demo |
| Sustainability | 1:36–1:52 | **Credit Scoring Agent** — impact metrics |
| Vision | 1:52–2:07 | Africa map — growth thesis |
| Grant Usage | 2:07–2:19 | How funding enables more agent development |
| Closing | 2:19–2:30 | Call to action |

The video is renderable in 4K, ProRes, WebM, and H.264 formats, with subtitle sync, voiceover support, and an animated film grain overlay for cinematic feel.

## Why Agents, Not Features

We deliberately chose an agent architecture over traditional feature modules for three reasons:

1. **Graceful degradation**: Each agent has a fallback chain. If Gemini is down, Groq serves the diagnostic. If Groq is down, OpenRouter catches it. A feature module would simply break.
2. **Unified logging**: Every agent action writes to `agent_logs`, which feeds both debugging and the Credit Agent\'s feature engineering — creating a virtuous data loop.
3. **Cross-platform reuse**: The diagnostic pipeline logic lives in a shared service layer, not in UI code. The web app and mobile app call the same `runDiagnostic()` function with the same fallback behavior.

## What\'s Next

The agent mesh is far from complete. On the roadmap:

- **Inventory Vision Agent**: Snap a photo of a shelf and get an auto-generated restock list with supplier pricing
- **Multi-agent coordination**: The Diagnostic Agent detects low documentation scores and spawns the Document Agent to proactively request receipts from the business owner via WhatsApp
- **Offline-first agent execution**: Running lightweight agent classification on-device (via TensorFlow Lite / ML Kit) for times when the mobile app has no connectivity

AscendSME is not a dashboard with AI sprinkled on top. It is an agent-native business OS designed for the constraints and opportunities of the Ghanaian market — where intelligence is a layer, not a feature.

---

*The full source code is available on GitHub: [github.com/Collinlar/ascendsme-b](https://github.com/Collinlar/ascendsme-b) (web), [ascendsme_mobile](https://github.com/Collinlar/ascendsme_mobile) (Flutter), and [ascendsme-video](https://github.com/Collinlar/ascendsme-video) (Remotion trailer).*'
  },
  {
    id: '4',
    title: 'Freebuff — 100% Free Agentic CLI with DeepSeek v4-Flash Access',
    slug: 'freebuff-free-agentic-cli',
    excerpt: 'A no-catch, zero-subscription agentic CLI that gives you free access to frontier models like DeepSeek v4-Flash, Claude Opus, and Gemini Pro. The catch? There isn\'t one — text ads in the terminal keep the lights on.',
    category: 'guide',
    readTime: '5 min read',
    publishedAt: 'May 21, 2026',
    body: 'Here is the proposition: top-tier agentic models, zero subscription, zero token metering, zero rate-limiting that matters for daily use.

Ever spun up a product idea, hit the API, and watched your credits evaporate before the MVP compiled? Freebuff flips that. It is a CLI agent that routes your prompts through a multi-model mesh — DeepSeek v4-Flash, Gemini Pro, Claude Opus, and open-weight fallbacks like Qwen 2.5 and LLaMA 3.3 — all accessible through a single `freebuff` command.

## How It Works

Freebuff maintains a lightweight polling daemon that checks an S3-manifest of available model nodes every 60 seconds. When you send a prompt, the router selects the optimal model based on task complexity, expected latency, and current load — exactly like the Hub\'s own LLM Router Agent, but at no cost to you.

The manifest is updated daily with new model endpoints, community-contributed routers, and experimental inference stacks.

## Installation

Install Freebuff globally via npm:

```bash
npm install -g freebuff
```

That is it. No API keys, no account creation, no billing setup. You get a working agentic CLI in under 10 seconds.

## Usage

Once installed, just run:

```bash
freebuff "write a fastapi server that serves a pgvector index over REST"
```

The router selects DeepSeek v4-Flash by default for coding tasks — it hits 85%+ on HumanEval and runs sub-500ms on standard prompts. If you need deeper reasoning, specify a model:

```bash
freebuff --model deepseek-v4 "design a vector-clock synchronization protocol for a 5-agent mesh"
```

Or use the interactive session mode for an ongoing coding loop:

```bash
freebuff --interactive
```

This drops you into a REPL with persistent context across turns, file-system awareness, and automatic tool calling.

## The Business Model (No, Really)

Freebuff is free because the terminal is the last unmonetized attention surface. Every 10th response includes a small, non-blocking sponsored line between the prompt result and the next prompt:

```
[signal] build complete in 3.2s — next prompt ready
---
▲ sponsored: Deploy your agent on Harbour — github.com/geekforbrains/harbour
---
```

These are plain-text, zero-tracking, and never interrupt output. Sponsors pay CPM for the ad slot; you pay nothing. No data is collected, no sessions profiled, no API keys harvested.

## Available Models

| Model | Strength | Best For |
|---|---|---|
| DeepSeek v4-Flash | Reasoning + Code | General dev, debugging, architecture |
| Qwen 2.5 72B | Math + Logic | Complex problem solving |
| LLaMA 3.3 70B | Long context + Reasoning | Deep research, code review |
| Mistral 7B | Lightweight + Fast | Quick answers, edge devices |
| Gemma 3 12B | Multimodal + Vision | Image analysis, PDF extraction |

No tokens are consumed. No limits are enforced. The sponsor model scales with usage — the more people use Freebuff, the more ad inventory exists, which funds more inference capacity on the backend.

## Architecture

Freebuff\'s routing layer is itself a thin agent mesh:

```
client (CLI) → request queue → router agent → model gateway
                                       ↕
                              model manifest (S3)
                                       ↕
                              sponsor index (ad server)
```

The router agent is a lightweight classifier (~20M parameters) that tags the incoming prompt by domain (`code`, `reasoning`, `creative`, `research`), maps it to the manifest, and fans out to the best available backend. The ad server injects sponsor lines into the response stream without ever seeing your prompt content.

## Why This Matters for African Developers

Freebuff was built with the same philosophy as everything in The Hub: infrastructure should be accessible, not extractive. For devs in Accra, Lagos, and Nairobi where $20/mo for an API subscription can be a real decision, Freebuff removes the gate entirely. The only cost is seeing a terminal ad every few prompts — a tradeoff most African devs we surveyed were happy to make.

```bash
npm install -g freebuff
```

No credit card required. No trial window. Just a terminal and a question.'
  }
];

export const INITIAL_TRACES: AgentTrace[] = [
  {
    id: 'tr-001',
    agent: 'Content',
    task: 'tag_post',
    model: 'llama-3.1-8b-instruct',
    inputTokens: 380,
    outputTokens: 52,
    latencyMs: 720,
    costUsd: 0.000000,
    result: 'success',
    timestamp: '10:41:04'
  },
  {
    id: 'tr-002',
    agent: 'LLM Router',
    task: 'model_select',
    model: 'llama-3.1-8b-instruct',
    inputTokens: 120,
    outputTokens: 15,
    latencyMs: 140,
    costUsd: 0.000000,
    result: 'success',
    timestamp: '10:41:04'
  },
  {
    id: 'tr-003',
    agent: 'Memory',
    task: 'retrieve_user',
    model: 'llama-3.1-8b-instruct',
    inputTokens: 512,
    outputTokens: 82,
    latencyMs: 640,
    costUsd: 0.000000,
    result: 'success',
    timestamp: '10:42:15'
  },
  {
    id: 'tr-004',
    agent: 'Companion',
    task: 'generate_chat_reply',
    model: 'llama-3.3-70b-instruct',
    inputTokens: 1420,
    outputTokens: 290,
    latencyMs: 1850,
    costUsd: 0.000000,
    result: 'success',
    timestamp: '10:44:01'
  }
];
