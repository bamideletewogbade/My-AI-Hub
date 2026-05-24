<div align="center">
<br />
<img width="48" height="48" alt="⚡" src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
<br />

# The Hub

**An agentic personal portfolio, blog, and tool showcase built with a multi-agent backend and persistent AI companion.**

<br />

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

<br />
</div>

---

## Overview

**The Hub** is the digital headquarters of [Bishop](https://ai.studio/apps/9bcbf5db-dac6-4807-825e-af65ce975836), a builder and systems architect based in **Accra, Ghana**. It's not a generic portfolio — it's an **agentic workspace** where:

- **Developer tools** are showcased with live, interactive demos (MoMo USSD simulators, QR invoice generators, AI career agents, and more)
- **Technical guides** cover building for African markets — high-latency networks, mobile money APIs, pgvector, and multi-agent architectures
- **A persistent AI companion** ("Bishop's Soul Companion") answers architectural and tech queries in Bishop's native voice, grounded in the `bishop_soul.md` system prompt
- **A diagnostics console** visualizes the multi-agent mesh — Content, Memory, Companion, Commerce, and LLM Router agents — with live traces, model routing, token usage, and latency metrics

Built with React 19, Vite, Tailwind CSS v4, and deployed on Google AI Studio's Cloud Run infrastructure.

---

## Architecture

The Hub runs on a **4-agent mesh** architecture:

| Agent | Role |
|---|---|
| **Content Agent** | Publishes, tags, and auto-links system insights. Watches workspace drafts, runs semantic chunking, and indexes into the vector store. |
| **Memory Agent** | Manages user identities and persistent context. Saves multi-session feedback and maintains interest matrices. |
| **Companion Agent** | The Hub's live interactive conversation soul. Binds to `bishop_soul.md` to answer queries in Bishop's native voice. |
| **LLM Router Agent** | Selects the optimal model for each task — routes simple queries to lightweight models (LLaMA 3.1 8B) and escalates reasoning/code to larger models (LLaMA 3.3 70B, DeepSeek Coder). |

The **Diagnostics Console** provides a real-time view of all agent activity: traces, model selection, token consumption, latency, and cost tracking.

---

## Features

### 🛠 Developer Tools Showcase
10+ interactive tool demos including:
- **AfriCalc Mobile Money Gate** — Simulate MTN MoMo USSD billing callbacks
- **AscendSME Platform** — QR invoice generator with real-time business metrics
- **Hone AI Career Agent** — Live job scanning and match scoring
- **TradePilot AI** — Reasoning-first crypto signal engine
- **AI Client Hunter** — Lead prospecting with enrichment
- **Harbour Control Plane** — Agent run dashboard with polling

### 📝 Technical Blog & Guides
Articles covering glocal (global + local) engineering challenges:
- Building for high-RTT African cellular networks
- Multi-agent synchronization with vector clocks
- Deploying pgvector on Cloud Run
- Deep dives into AscendSME, Freebuff, and more

### 🤖 Soul Companion
A persistent AI chat interface that answers questions about Bishop's architecture, opinions, and build thesis — powered by the `bishop_soul.md` system prompt and routed through the LLM Router Agent.

### 📊 Diagnostics Console
Real-time visibility into the agent mesh:
- Live agent traces with model, latency, and cost details
- LLM Router configuration panel for task-to-model assignment
- Token usage and billing simulation

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion)
- **Build:** Vite 6
- **Icons:** Lucide React
- **Visualization:** D3.js (Agent Mesh)
- **Deployment:** Google AI Studio / Cloud Run
- **AI Models:** Gemini Pro, Gemini Flash, LLaMA 3.1 8B, LLaMA 3.3 70B, DeepSeek Coder v2, Qwen 2.5 72B

---

## Getting Started

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd My-AI-Hub

# 2. Install dependencies
npm install

# 3. Set your Gemini API key
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Project Structure

```
My-AI-Hub/
├── index.html              # Entry HTML with meta tags & favicon
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Root layout with tabbed navigation
│   ├── index.css           # Tailwind v4 imports & theme config
│   ├── types.ts            # TypeScript interfaces
│   ├── data/
│   │   └── mockData.ts     # Agent definitions, tools, posts, traces, soul
│   └── components/
│       ├── ToolsView.tsx    # Developer tools showcase with live demos
│       ├── BlogView.tsx     # Technical blog with reading progress
│       ├── ConsoleView.tsx  # Diagnostics & agent traces
│       ├── CompanionChat.tsx# AI soul companion chat interface
│       └── AgentMesh.tsx    # Interactive D3 agent network graph
├── metadata.json           # AI Studio app metadata
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |

---

<div align="center">
<br />
<p><strong>The Hub</strong> — Platform node of builder <strong>Bishop</strong> in Accra, GH.</p>
<p><em>Building hyper-focused systems where intelligence is a layer, not a feature.</em></p>
<br />
</div>
