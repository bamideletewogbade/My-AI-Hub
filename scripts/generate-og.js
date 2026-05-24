// Generate OG image as PNG using canvas
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

(async () => {
  const W = 1200, H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0d0d0d');
  bgGrad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Grid pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.015)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Ambient glows
  const glow1 = ctx.createRadialGradient(1100, 200, 0, 1100, 200, 300);
  glow1.addColorStop(0, 'rgba(16,185,129,0.08)');
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(200, 500, 0, 200, 500, 250);
  glow2.addColorStop(0, 'rgba(45,212,191,0.05)');
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Card border
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  roundRect(ctx, 30, 30, 1140, 570, 32);
  ctx.stroke();

  // Zap icon box
  const zapGrad = ctx.createLinearGradient(86, 86, 142, 142);
  zapGrad.addColorStop(0, '#10b981');
  zapGrad.addColorStop(1, '#14b8a6');
  ctx.fillStyle = zapGrad;
  roundRect(ctx, 86, 86, 56, 56, 16);
  ctx.fill();

  // Zap emoji
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0a0a0a';
  ctx.fillText('⚡', 114, 116);

  // Brand name
  ctx.textAlign = 'left';
  ctx.font = '600 40px "Space Grotesk", "Arial", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('The Hub', 162, 110);

  // Brand tagline
  ctx.font = '500 16px "Space Grotesk", "Arial", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText('Agentic Portfolio · Tool Showcase · AI Companion', 162, 140);

  // Version badge
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  roundRect(ctx, 870, 92, 200, 32, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  roundRect(ctx, 870, 92, 200, 32, 16);
  ctx.stroke();
  ctx.font = '13px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#737373';
  ctx.fillText('v1.3 // AGENT MESH', 970, 108);

  // Title line 1
  ctx.textAlign = 'left';
  ctx.font = '700 52px "Space Grotesk", "Arial", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Building hyper-focused systems where', 86, 280);

  // Title line 2 (gradient)
  const titleGrad = ctx.createLinearGradient(86, 0, 600, 0);
  titleGrad.addColorStop(0, '#10b981');
  titleGrad.addColorStop(0.5, '#34d399');
  titleGrad.addColorStop(1, '#14b8a6');
  ctx.fillStyle = titleGrad;
  ctx.fillText('intelligence is a layer, not a feature', 86, 345);

  // Description
  ctx.font = '18px "Inter", "Arial", sans-serif';
  ctx.fillStyle = '#a3a3a3';
  ctx.fillText('A multi-agent workspace by Bishop — featuring Content, Memory, Companion,', 86, 400);
  ctx.fillText('and LLM Router agents coordinating across dev tools, guides, and AI chat.', 86, 430);

  // Agent dots and labels
  const agents = [
    { x: 86, label: 'Content Agent' },
    { x: 230, label: 'Memory Agent' },
    { x: 374, label: 'Companion Agent' },
    { x: 518, label: 'LLM Router' },
  ];

  agents.forEach(agent => {
    ctx.beginPath();
    ctx.arc(agent.x, 530, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();

    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#737373';
    ctx.fillText(agent.label, agent.x + 12, 534);
  });

  // Location
  ctx.font = '13px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#525252';
  ctx.fillText('GH  Accra, Ghana — Glocal Node Online', 1110, 534);

  // Save
  const outDir = path.join(__dirname, 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outDir, 'og-image.png'), buffer);
  console.log('✅ OG image saved to public/og-image.png');
  console.log(`   Size: ${(buffer.length / 1024).toFixed(1)} KB`);
  console.log(`   Dimensions: ${W}x${H}`);
})();
