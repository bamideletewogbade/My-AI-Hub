export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'sleeping' | 'processing';
  icon: string;
  description: string;
}

export interface Tool {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  downloads: number;
  repoUrl?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: 'article' | 'howto' | 'guide';
  readTime: string;
  publishedAt: string;
}

export interface AgentTrace {
  id: string;
  agent: 'Content' | 'Memory' | 'Companion' | 'Commerce' | 'LLM Router';
  task: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  costUsd: number;
  result: 'success' | 'failure';
  timestamp: string;
}
