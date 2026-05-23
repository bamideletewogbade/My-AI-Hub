import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Database, Layers, Sparkles, DollarSign, Cpu, Tag, HelpCircle, RefreshCw, ZoomIn, ZoomOut, Filter, Shield, Award, Info } from 'lucide-react';
import { INITIAL_AGENTS, INITIAL_TOOLS, INITIAL_POSTS } from '../data/mockData';

// Types for D3 node and link entities
export interface MeshNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'agent' | 'tool' | 'blog' | 'tag';
  details: string;
  status?: string;
  tagGroup?: string;
  metric?: string;
}

export interface MeshLink extends d3.SimulationLinkDatum<MeshNode> {
  source: string | MeshNode;
  target: string | MeshNode;
  value: number;
}

export default function AgentMesh() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  
  // Interactive UI states
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MeshNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'agents' | 'plugins' | 'tags'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [highlightedType, setHighlightedType] = useState<'agent' | 'tool' | 'blog' | 'tag' | null>(null);
  const zoomBehaviorRef = useRef<any>(null);

  const selectedNodeRef = useRef<MeshNode | null>(null);
  const hoveredNodeRef = useRef<MeshNode | null>(null);

  // Synchronise state with refs to prevent stale closure reads in the animation frame loop
  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    hoveredNodeRef.current = hoveredNode;
  }, [hoveredNode]);

  const toggleSpotlight = (type: 'agent' | 'tool' | 'blog' | 'tag') => {
    setHighlightedType(prev => prev === type ? null : type);
  };

  // Compile nodes and links from actual project structures
  // Generate distinct colors and groupings
  const [nodes, setNodes] = useState<MeshNode[]>([]);
  const [links, setLinks] = useState<MeshLink[]>([]);

  // Construct initial structures on mount
  useEffect(() => {
    const tempNodes: MeshNode[] = [];
    const tempLinks: MeshLink[] = [];

    // 1. Add Agent nodes
    INITIAL_AGENTS.forEach((agent) => {
      tempNodes.push({
        id: `agent-${agent.id}`,
        name: agent.name,
        type: 'agent',
        details: agent.role,
        status: agent.status,
        metric: agent.id === 'router' ? 'Multi-model distribution' : 'Autonomous active listening'
      });
    });

    // 2. Add Tool nodes
    INITIAL_TOOLS.forEach((tool) => {
      tempNodes.push({
        id: `tool-${tool.id}`,
        name: tool.title,
        type: 'tool',
        details: tool.description,
        status: tool.tier === 'paid' ? 'Licensed tier' : 'Open ecosystem',
        metric: `${tool.downloads} global installs`
      });
    });

    // 3. Add Blog/Concept Articles nodes
    INITIAL_POSTS.forEach((post) => {
      tempNodes.push({
        id: `blog-${post.id}`,
        name: post.title,
        type: 'blog',
        details: post.excerpt,
        status: 'published note',
        metric: post.readTime
      });
    });

    // 4. Extract unique tags/concepts from tools and posts
    const uniqueTags = new Set<string>();
    INITIAL_TOOLS.forEach(t => t.tags.forEach(tag => uniqueTags.add(tag)));
    INITIAL_POSTS.forEach(p => uniqueTags.add(p.category)); // article, howto, guide
    
    uniqueTags.forEach((tag) => {
      tempNodes.push({
        id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
        name: tag,
        type: 'tag',
        details: `Cognitive metadata routing tag matching index clusters for #${tag}`
      });
    });

    // Define beautiful, meaningful links
    // Connect Content Agent to Blog Posts
    INITIAL_POSTS.forEach((post) => {
      tempLinks.push({ source: 'agent-content', target: `blog-${post.id}`, value: 3 });
    });

    // Connect Memory Agent to Database tags/SQL tags and AI
    tempLinks.push({ source: 'agent-memory', target: 'tag-databases', value: 2 });
    tempLinks.push({ source: 'agent-memory', target: 'tag-sql', value: 2 });
    tempLinks.push({ source: 'agent-memory', target: 'tag-ai', value: 2 });

    // Connect Companion Agent to conversational concepts and AI
    tempLinks.push({ source: 'agent-companion', target: 'tag-ai', value: 3 });
    tempLinks.push({ source: 'agent-companion', target: 'tag-productivity', value: 1.5 });

    // Connect Commerce Agent to Fintech & Telecom & USSD tags
    tempLinks.push({ source: 'agent-commerce', target: 'tag-fintech', value: 3 });
    tempLinks.push({ source: 'agent-commerce', target: 'tag-telecom', value: 2 });
    tempLinks.push({ source: 'agent-commerce', target: 'tag-ussd', value: 2 });

    // Connect Router to AI and IDE tags
    tempLinks.push({ source: 'agent-router', target: 'tag-ai', value: 3.5 });
    tempLinks.push({ source: 'agent-router', target: 'tag-node.js', value: 1.5 });

    // Connect Tool nodes to their tags
    INITIAL_TOOLS.forEach((tool) => {
      tool.tags.forEach((tag) => {
        const tagId = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
        tempLinks.push({ source: `tool-${tool.id}`, target: tagId, value: 2.5 });
      });
    });

    // Connect Blog posts to their category tags
    INITIAL_POSTS.forEach((post) => {
      const catId = `tag-${post.category.toLowerCase()}`;
      tempLinks.push({ source: `blog-${post.id}`, target: catId, value: 2 });
    });

    // Self-Healing Core link: Content Packer to AI tag
    tempLinks.push({ source: 'tool-4', target: 'tag-ai', value: 1.5 });

    setNodes(tempNodes);
    setLinks(tempLinks);

    // Initial chosen preview node
    setSelectedNode(tempNodes.find(n => n.id === 'agent-router') || tempNodes[0]);
  }, []);

  // Set up container size listener using ResizeObserver to confirm responsive behavior
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      
      // Keep boundaries elegant
      const dynamicWidth = Math.max(width, 350);
      const dynamicHeight = Math.max(height || 360, 360);
      setDimensions({ width: dynamicWidth, height: dynamicHeight });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Main interactive render & update D3 physics loop
  useEffect(() => {
    if (nodes.length === 0 || !svgRef.current) return;

    const width = dimensions.width;
    const height = dimensions.height;

    // Filter nodes and links based on active tab selection to keep screen sparse/organized
    let filteredNodes = nodes;
    if (activeFilter === 'agents') {
      filteredNodes = nodes.filter(n => n.type === 'agent' || n.type === 'tag');
    } else if (activeFilter === 'plugins') {
      filteredNodes = nodes.filter(n => n.type === 'tool' || n.type === 'blog');
    } else if (activeFilter === 'tags') {
      filteredNodes = nodes.filter(n => n.type === 'tag');
    }

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links.filter(l => {
      const sId = typeof l.source === 'string' ? l.source : (l.source as MeshNode).id;
      const tId = typeof l.target === 'string' ? l.target : (l.target as MeshNode).id;
      return filteredNodeIds.has(sId) && filteredNodeIds.has(tId);
    });

    // Deep clones to prevent simulation mutations from overriding state arrays directly
    const simNodes: MeshNode[] = filteredNodes.map(n => ({ ...n }));
    const simLinks: MeshLink[] = filteredLinks.map(l => ({
      ...l,
      source: typeof l.source === 'string' ? l.source : (l.source as MeshNode).id,
      target: typeof l.target === 'string' ? l.target : (l.target as MeshNode).id
    }));

    const svg = d3.select(svgRef.current);
    // Clear previous elements to rebuild canvas safely
    svg.selectAll('*').remove();

    // Create central zoomable viewport group
    const g = svg.append('g').attr('id', 'zoomable-container');

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Center initial zoom nicely
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85).translate(-width / 2, -height / 2));

    // Force simulation configurations
    const simulation = d3.forceSimulation<MeshNode>(simNodes)
      .force('link', d3.forceLink<MeshNode, MeshLink>(simLinks)
        .id(d => d.id)
        .distance((d) => {
          if (d.value > 3) return 50;
          return 90;
        })
      )
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(28));

    // Drag helper callbacks
    function dragstarted(event: any, d: MeshNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: MeshNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: MeshNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Render Web of Links
    const link = g.append('g')
      .selectAll<SVGLineElement, MeshLink>('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke', '#1f1f1f')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => d.value)
      .attr('stroke-dasharray', d => d.value > 3 ? 'none' : '2,2');

    // Generate flowing data packet particles. Staggered offsets for high density.
    // Particle speed is proportional to the link value weight (d.link.value).
    const particlesData = simLinks.flatMap((l) => {
      const scaleSpeed = Math.max(1.5, l.value || 2) * 0.0028 + 0.0015;
      return [
        { link: l, progress: 0.0, speed: scaleSpeed },
        { link: l, progress: 0.5, speed: scaleSpeed }
      ];
    });

    const flowParticles = g.append('g')
      .attr('class', 'flow-particles')
      .selectAll<SVGCircleElement, any>('circle')
      .data(particlesData)
      .enter()
      .append('circle')
      .attr('r', d => Math.max(1.5, Math.min(2.8, (d.link.value || 2) * 0.7)))
      .attr('fill', d => {
        // Match particle color to destination node category
        const destType = (d.link.target as any).type || 'tag';
        if (destType === 'agent') return '#10b981'; // Emerald glow
        if (destType === 'tool') return '#06b6d4'; // Cyan glow
        if (destType === 'blog') return '#a855f7'; // Purple glow
        return '#737373';
      })
      .style('pointer-events', 'none')
      .style('filter', 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.45))');

    // Outward-pulsing data-packet layer for thinking states behind the node visual indicators
    const pulseGroup = g.append('g').attr('class', 'thinking-pulses');
    let activePulses: Array<{
      id: number;
      node: any;
      type: 'ring' | 'dot';
      angle: number;
      distance: number;
      maxDistance: number;
      speed: number;
      life: number;
      color: string;
      size: number;
    }> = [];
    let pulseIdCounter = 0;

    // Render Nodes Groups
    const node = g.append('g')
      .selectAll<SVGGElement, MeshNode>('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .style('cursor', 'grab')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        // Highlight active connections
        link.style('stroke', (l: any) => {
          if (l.source.id === d.id || l.target.id === d.id) {
            return l.value > 3 ? '#34d399' : '#06b6d4';
          }
          return '#1f1f1f';
        })
        .style('stroke-opacity', (l: any) => {
          if (l.source.id === d.id || l.target.id === d.id) return 1.0;
          return 0.15;
        });
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        // Restore standard strokes
        link.style('stroke', '#1f1f1f')
          .style('stroke-opacity', 0.6);
      })
      .call(d3.drag<SVGGElement, MeshNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Decorative background logic for nodes
    node.append('circle')
      .attr('r', d => {
        if (d.type === 'agent') return 16;
        if (d.type === 'tool') return 13;
        if (d.type === 'blog') return 11;
        return 7; // tags
      })
      .attr('fill', d => {
        if (d.type === 'agent') return '#052e16'; // dark emerald
        if (d.type === 'tool') return '#083344'; // dark cyan
        if (d.type === 'blog') return '#3b0764'; // dark purple
        return '#171717'; // dark grey
      })
      .attr('stroke', d => {
        if (d.type === 'agent') return '#10b981'; // emerald
        if (d.type === 'tool') return '#06b6d4'; // cyan
        if (d.type === 'blog') return '#a855f7'; // purple
        return '#525252'; // slate
      })
      .attr('stroke-width', d => d.type === 'agent' ? 2 : 1.5)
      .style('filter', d => d.type === 'agent' ? 'drop-shadow(0 0 4px rgba(16,185,129,0.3))' : 'none');

    // Add glyph representations
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '8px')
      .attr('fill', d => {
        if (d.type === 'agent') return '#34d399';
        if (d.type === 'tool') return '#22d3ee';
        if (d.type === 'blog') return '#c084fc';
        return '#a3a3a3';
      })
      .text(d => {
        if (d.type === 'agent') return '⚡';
        if (d.type === 'tool') return '⚙️';
        if (d.type === 'blog') return '✍️';
        return '#';
      });

    // Node labels
    node.append('text')
      .attr('dx', d => {
        if (d.type === 'agent') return 20;
        if (d.type === 'tool') return 16;
        if (d.type === 'blog') return 14;
        return 10;
      })
      .attr('dy', '.35em')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-size', '9px')
      .attr('fill', '#d4d4d4')
      .text(d => d.name);

    // Define animation frame loop for the streaming particles
    let animFrameId: number;
    const animateParticles = () => {
      // 1. Move the link flowing particles
      flowParticles.each(function(d: any) {
        // Increment progress along link path
        d.progress = (d.progress + d.speed) % 1.0;

        const sourceNode = d.link.source as any;
        const targetNode = d.link.target as any;

        if (sourceNode && typeof sourceNode === 'object' && typeof sourceNode.x === 'number' &&
            targetNode && typeof targetNode === 'object' && typeof targetNode.x === 'number') {
          const cx = sourceNode.x + (targetNode.x - sourceNode.x) * d.progress;
          const cy = sourceNode.y + (targetNode.y - sourceNode.y) * d.progress;
          
          d3.select(this)
            .attr('cx', cx)
            .attr('cy', cy);
        }
      });

      // 2. Node Thinking State Outward Particles Emission Check
      simNodes.forEach((n: any) => {
        // Baseline thinking pulse frequency per frame based on node types
        let emitChance = 0.003;
        if (n.type === 'agent') emitChance = 0.024;
        if (n.type === 'tool') emitChance = 0.014;

        // Elevate probability significantly if hovered or selected for active interaction
        const isSelected = selectedNodeRef.current && selectedNodeRef.current.id === n.id;
        const isHovered = hoveredNodeRef.current && hoveredNodeRef.current.id === n.id;
        if (isSelected) emitChance += 0.045;
        if (isHovered) emitChance += 0.065;

        if (Math.random() < emitChance) {
          // Color coordination
          let color = '#737373';
          if (n.type === 'agent') color = '#10b981'; // emerald
          if (n.type === 'tool') color = '#06b6d4';  // cyan
          if (n.type === 'blog') color = '#a855f7';  // purple

          const startRadius = n.type === 'agent' ? 16 : (n.type === 'tool' ? 13 : (n.type === 'blog' ? 11 : 7));

          // A: Emit a concentric ripple ring that expands and fades
          pulseIdCounter++;
          activePulses.push({
            id: pulseIdCounter,
            node: n,
            type: 'ring',
            angle: 0,
            distance: startRadius,
            maxDistance: startRadius + 40,
            speed: 0.65 + Math.random() * 0.5,
            life: 1.0,
            color: color,
            size: 1.0
          });

          // B: Emit 1 to 3 tiny outward-traveling 'data packet' particle dots
          const particleCount = n.type === 'agent' ? (Math.floor(Math.random() * 3) + 2) : 1;
          for (let i = 0; i < particleCount; i++) {
            pulseIdCounter++;
            activePulses.push({
              id: pulseIdCounter,
              node: n,
              type: 'dot',
              angle: Math.random() * Math.PI * 2,
              distance: startRadius * 0.6,
              maxDistance: startRadius + 20 + Math.random() * 25,
              speed: 1.1 + Math.random() * 1.5,
              life: 1.0,
              color: color,
              size: 1.2 + Math.random() * 1.5
            });
          }
        }
      });

      // 3. Update Existing Pulses Distance & Life Decay
      activePulses.forEach(p => {
        p.distance += p.speed;
        p.life = Math.max(0, 1.0 - ((p.distance) / p.maxDistance));
      });

      // Limit particle count strictly to avoid DOM bloat or memory lag
      if (activePulses.length > 180) {
        activePulses = activePulses.slice(activePulses.length - 180);
      }

      // Filter dead pulses or those without a layout position
      activePulses = activePulses.filter(p => p.life > 0 && p.node && typeof p.node.x === 'number');

      // 4. Update the Concentric Ripple Waves
      const rings = pulseGroup.selectAll<SVGCircleElement, any>('circle.pulse-ring')
        .data(activePulses.filter(p => p.type === 'ring'), d => d.id);

      rings.enter()
        .append('circle')
        .attr('class', 'pulse-ring')
        .attr('fill', 'none')
        .attr('stroke-width', 0.8)
        .merge(rings)
        .attr('cx', d => d.node.x)
        .attr('cy', d => d.node.y)
        .attr('r', d => d.distance)
        .attr('stroke', d => d.color)
        .attr('stroke-opacity', d => d.life * 0.45)
        .style('pointer-events', 'none');

      rings.exit().remove();

      // 5. Update the Outward-Propagating 'Data Packet' Dots
      const dots = pulseGroup.selectAll<SVGCircleElement, any>('circle.pulse-dot')
        .data(activePulses.filter(p => p.type === 'dot'), d => d.id);

      dots.enter()
        .append('circle')
        .attr('class', 'pulse-dot')
        .merge(dots)
        .attr('cx', d => d.node.x + Math.cos(d.angle) * d.distance)
        .attr('cy', d => d.node.y + Math.sin(d.angle) * d.distance)
        .attr('r', d => d.size)
        .attr('fill', d => d.color)
        .attr('fill-opacity', d => d.life * 0.95)
        .style('pointer-events', 'none')
        .style('filter', 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.35))');

      dots.exit().remove();

      animFrameId = requestAnimationFrame(animateParticles);
    };

    // Begin streaming data flows
    animateParticles();

    // Pin core network nodes to center automatically for cleaner initial layouts
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, [nodes, links, dimensions, activeFilter]);

  // Synchronize Legend hover/highlight spotlight on the SVG elements
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (svg.empty()) return;

    if (highlightedType === null) {
      // Re-enable everything with standard styling
      svg.selectAll('.node-group').transition().duration(200).style('opacity', 1);
      svg.selectAll('line').transition().duration(200)
        .style('stroke', '#1f1f1f')
        .style('stroke-opacity', 0.6);
      svg.selectAll('.flow-particles circle').transition().duration(200)
        .style('opacity', 1);
    } else {
      // Highlighting spotlight effect
      svg.selectAll('.node-group').transition().duration(200).style('opacity', (d: any) => {
        return d && d.type === highlightedType ? 1 : 0.15;
      });
      // Dim all lines
      svg.selectAll('line').transition().duration(200)
        .style('stroke-opacity', 0.05);
      // Spotlight flow particles matching the targeted type
      svg.selectAll('.flow-particles circle').transition().duration(200).style('opacity', (d: any) => {
        const srcType = d && d.link && d.link.source ? (d.link.source as any).type : null;
        const destType = d && d.link && d.link.target ? (d.link.target as any).type : null;
        return srcType === highlightedType || destType === highlightedType ? 1 : 0.05;
      });
    }
  }, [highlightedType]);

  // Adjust zoom controls manually
  const triggerZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(250).call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(250).call(
      zoomBehaviorRef.current.transform, 
      d3.zoomIdentity.translate(dimensions.width / 2, dimensions.height / 2).scale(0.85).translate(-dimensions.width / 2, -dimensions.height / 2)
    );
  };

  return (
    <div className="bg-neutral-950/25 border border-neutral-900 rounded-2xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl">
      
      {/* GRAPH CANVAS WRAPPER - 8 columns desk */}
      <div className="lg:col-span-8 p-4 flex flex-col justify-between relative min-h-[380px] border-b lg:border-b-0 lg:border-r border-neutral-900">
        
        {/* Interactive Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 z-10">
          <div className="flex items-center gap-1.5 bg-neutral-900/60 p-0.5 rounded border border-neutral-850">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeFilter === 'all' 
                  ? 'bg-neutral-8ba bg-neutral-800 text-emerald-400 font-extrabold' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              All Mesh
            </button>
            <button
              onClick={() => setActiveFilter('agents')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeFilter === 'agents' 
                  ? 'bg-neutral-800 text-emerald-400 font-extrabold' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setActiveFilter('plugins')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeFilter === 'plugins' 
                  ? 'bg-neutral-800 text-cyan-400 font-extrabold' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Code Tools
            </button>
            <button
              onClick={() => setActiveFilter('tags')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeFilter === 'tags' 
                  ? 'bg-neutral-800 text-purple-400 font-extrabold' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Indices
            </button>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900/60 p-1 rounded border border-neutral-850">
            <button 
              onClick={() => triggerZoom(1.2)} 
              title="Zoom In" 
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => triggerZoom(0.8)} 
              title="Zoom Out" 
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleResetZoom} 
              title="Reset Viewport" 
              className="px-1.5 py-0.5 text-[9px] font-mono text-neutral-400 hover:text-white cursor-pointer border border-neutral-800 rounded bg-neutral-950/40"
            >
              RESET
            </button>
          </div>
        </div>

        {/* The Live Interactive SVG Graph Board */}
        <div id="agent-mesh-canvas" ref={containerRef} className="flex-1 w-full relative select-none">
          <svg
            id="agent-mesh-svg"
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full block text-neutral-400"
          />
          
          {/* Subtle Live Graph Hover Overlay status */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute bottom-2 left-2 px-3 py-1.5 bg-neutral-950/90 backdrop-blur border border-neutral-900 rounded font-mono text-[9px] text-neutral-400 flex items-center gap-2"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  hoveredNode.type === 'agent' ? 'bg-emerald-450 bg-emerald-400 animate-pulse' :
                  hoveredNode.type === 'tool' ? 'bg-cyan-400' :
                  hoveredNode.type === 'blog' ? 'bg-purple-450 bg-purple-400' : 'bg-neutral-500'
                }`} />
                <span className="text-neutral-300 font-bold">{hoveredNode.name}</span>
                <span className="text-neutral-600 block">type: {hoveredNode.type}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Legend explanation section */}
        <div id="mesh-legend" className="border-t border-neutral-900/60 pt-3 pb-2.5 mt-2 space-y-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-400">
            <span>Graph Legend & Spotlight controls:</span>
            <span className="text-[9px] text-neutral-500 font-normal italic">Hover or click to isolate families</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { type: 'agent', label: 'Agents', stroke: '#10b981', bg: 'bg-emerald-500/5 hover:bg-emerald-500/10', text: 'text-emerald-400 border-emerald-500/20', glyph: '⚡', desc: 'Core Models' },
              { type: 'tool', label: 'Code Tools', stroke: '#06b6d4', bg: 'bg-cyan-500/5 hover:bg-cyan-500/10', text: 'text-cyan-400 border-cyan-500/20', glyph: '⚙️', desc: 'API Plugins' },
              { type: 'blog', label: 'Blog Notes', stroke: '#a855f7', bg: 'bg-purple-500/5 hover:bg-purple-500/10', text: 'text-purple-400 border-purple-500/20', glyph: '✍️', desc: 'Static Docs' },
              { type: 'tag', label: 'Indices', stroke: '#525252', bg: 'bg-neutral-900/40 hover:bg-neutral-900/60', text: 'text-neutral-450 border-neutral-800', glyph: '#', desc: 'Taxonomies' }
            ].map((lg) => {
              const isActive = highlightedType === lg.type;
              return (
                <div
                  key={lg.type}
                  id={`legend-${lg.type}`}
                  onMouseEnter={() => setHighlightedType(lg.type as any)}
                  onMouseLeave={() => setHighlightedType(null)}
                  onClick={() => toggleSpotlight(lg.type as any)}
                  className={`p-1.5 rounded-lg border flex flex-col items-start gap-1 cursor-pointer transition-all select-none ${lg.bg} ${lg.text} ${
                    isActive ? 'ring-1 ring-offset-1 ring-offset-neutral-950 ring-emerald-500/50 scale-[1.02] border-emerald-505 border-emerald-500/40' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <span 
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 shadow-inner"
                      style={{ border: `1px solid ${lg.stroke}`, backgroundColor: `${lg.stroke}12` }}
                    >
                      {lg.glyph}
                    </span>
                    <span className="text-[10.5px] font-bold tracking-tight truncate flex-1">{lg.label}</span>
                  </div>
                  <span className="text-[8.5px] opacity-70 font-mono pl-5.5 pl-5 leading-none">{lg.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Line styles representation */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[9px] font-mono text-neutral-500 border-t border-neutral-900 pt-2 pb-0.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center shrink-0 w-8 h-1">
                <span className="w-full h-0.5 bg-neutral-800 rounded animate-pulse" />
              </span>
              <span><strong className="text-neutral-400">Direct Route:</strong> Primary mapping (&gt; 3.0 weight)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="flex items-center shrink-0 w-8 h-1 pt-0.5">
                <span className="w-full h-0 border-t border-dashed border-neutral-800" />
              </span>
              <span><strong className="text-neutral-400">Association Route:</strong> Secondary category association link</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-600 leading-none pb-0.5 bg-neutral-950/20 px-2 py-1 rounded">
          <Info className="w-3 h-3 text-neutral-600" />
          <span>Interactive D3 Simulation Board: Click to inspect data nodes, or drag vertices with mouse physics/gravitations.</span>
        </div>
      </div>

      {/* DETAIL META EXPORTER PANEL - 4 columns desk */}
      <div className="lg:col-span-4 p-5 bg-neutral-950/50 flex flex-col justify-between space-y-5 text-left">
        
        {/* Node Inspections Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
            <Network className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-white">
              Inspecting Agent Node
            </span>
          </div>

          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Node visual title and metadata type card */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border uppercase inline-block ${
                      selectedNode.type === 'agent' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450 text-emerald-400' :
                      selectedNode.type === 'tool' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                      selectedNode.type === 'blog' ? 'bg-purple-500/10 border-purple-500/30 text-purple-450 text-purple-400' :
                      'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}>
                      {selectedNode.type} node // active
                    </span>
                    
                    {selectedNode.status && (
                      <span className="text-[9.5px] text-neutral-500 font-mono italic">
                        {selectedNode.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-display font-bold text-white tracking-tight">{selectedNode.name}</h3>
                </div>

                {/* Substantive description details */}
                <div className="p-3 bg-neutral-900/30 border border-neutral-900 rounded-lg text-xs text-neutral-400 font-sans leading-relaxed">
                  {selectedNode.details}
                </div>

                {/* Dynamic numerical or telemetry trace metric */}
                {selectedNode.metric && (
                  <div className="p-2.5 bg-neutral-950 border border-neutral-900 rounded font-mono text-[10px] space-y-1">
                    <span className="text-neutral-500 uppercase font-semibold">Mesh Core Metrics:</span>
                    <p className="text-emerald-405 text-emerald-300 font-bold">{selectedNode.metric}</p>
                  </div>
                )}

                {/* Conceptual static telemetry layout inside panel */}
                <div className="border-t border-neutral-900 pt-3.5 space-y-2 text-[10px] font-mono text-neutral-500">
                  <div className="flex justify-between">
                    <span>Routing Node ID:</span>
                    <span className="text-neutral-300">{selectedNode.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Local Accr. Mesh Pin:</span>
                    <span className="text-emerald-400 font-semibold">Synchronized</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handoff Failures:</span>
                    <span className="text-neutral-400">0% Core Fault Ratio</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-500 italic">
                Select a vertex node in the graph viewport to inspect individual mesh metadata configurations and connections.
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Overview Section */}
        <div className="pt-4 border-t border-neutral-900 text-xs font-mono space-y-2.5 text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-405 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold text-neutral-400">Accra Mesh Configuration</span>
          </div>
          <p className="text-[10.5px] leading-relaxed">
            The Hub aligns modular components into standard key-value index loops. By decoupling client logic from model layers, our services remain resilient to RTT dropouts.
          </p>
        </div>

      </div>

    </div>
  );
}
