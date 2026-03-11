"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseOpacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  lit: boolean;
  litTimer: number;
  litDuration: number;
}

interface Jellyfish {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  phase: number;
  speed: number;
  drift: number;
  life: number;
  maxLife: number;
}

const COLORS = {
  orange: "#FF6B35",
  green: "#00A676",
  blue: "#2C7BE5",
  gray: "#A7A9AC",
};

export function AnimatedNodes({
  className = "",
  nodeCount = 40,
  interactive = true,
}: {
  className?: string;
  nodeCount?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const jellyfishRef = useRef<Jellyfish[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    const colorKeys = Object.values(COLORS);
    const rect = canvas.getBoundingClientRect();

    // Spread nodes evenly across canvas using grid + jitter to avoid clumping
    const cols = Math.ceil(Math.sqrt(nodeCount * (rect.width / rect.height)));
    const rows = Math.ceil(nodeCount / cols);
    const cellW = rect.width / cols;
    const cellH = rect.height / rows;

    nodesRef.current = Array.from({ length: nodeCount }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        x: (col + 0.5) * cellW + (Math.random() - 0.5) * cellW * 0.6,
        y: (row + 0.5) * cellH + (Math.random() - 0.5) * cellH * 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2 + 1.5,
        color: colorKeys[Math.floor(Math.random() * colorKeys.length)],
        baseOpacity: Math.random() * 0.3 + 0.3,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        lit: Math.random() > 0.6,
        litTimer: Math.random() * 200 + 50,
        litDuration: Math.random() * 300 + 150,
      };
    });

    function handleMouseMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    let time = 0;

    function animate() {
      const r = canvas!.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      const connDist = Math.max(w, h) * 0.14;
      const repelDist = Math.max(w, h) * 0.12; // Min distance — keeps nodes well spread

      ctx!.clearRect(0, 0, w, h);
      time += 1;

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // REPEL nearby nodes — keep them separated
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = node.x - nodes[j].x;
          const dy = node.y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelDist && dist > 0) {
            const force = (repelDist - dist) / repelDist * 0.02;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }

        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges softly
        const pad = 15;
        if (node.x < pad) { node.vx += 0.02; node.x = pad; }
        if (node.x > w - pad) { node.vx -= 0.02; node.x = w - pad; }
        if (node.y < pad) { node.vy += 0.02; node.y = pad; }
        if (node.y > h - pad) { node.vy -= 0.02; node.y = h - pad; }

        // Subtle random drift
        if (Math.random() < 0.01) {
          node.vx += (Math.random() - 0.5) * 0.06;
          node.vy += (Math.random() - 0.5) * 0.06;
        }

        // Speed limit — keep slow and calm
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 0.3) {
          node.vx *= 0.3 / speed;
          node.vy *= 0.3 / speed;
        }

        // Damping
        node.vx *= 0.995;
        node.vy *= 0.995;

        // Lighting cycle
        node.litTimer -= 1;
        if (node.litTimer <= 0) {
          node.lit = !node.lit;
          node.litTimer = node.lit
            ? node.litDuration
            : Math.random() * 300 + 100;
        }

        // Mouse proximity lights up nodes
        if (interactive && mouse.x > 0) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            node.lit = true;
            node.litTimer = 60;
          }
        }
      }

      // Draw connections — straight lines forming network
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connDist) {
            const proximityAlpha = 1 - dist / connDist;
            const bothLit = a.lit && b.lit;
            const oneLit = a.lit || b.lit;

            let alpha: number;
            let lineWidth: number;
            if (bothLit) {
              alpha = proximityAlpha * 0.45;
              lineWidth = 1;
            } else if (oneLit) {
              alpha = proximityAlpha * 0.15;
              lineWidth = 0.6;
            } else {
              alpha = proximityAlpha * 0.05;
              lineWidth = 0.3;
            }

            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle =
              a.color +
              Math.round(alpha * 255)
                .toString(16)
                .padStart(2, "0");
            ctx!.lineWidth = lineWidth;
            ctx!.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase);

        if (node.lit) {
          // Glow
          const glowR = node.radius * 5;
          const gradient = ctx!.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, glowR
          );
          gradient.addColorStop(0, node.color + "35");
          gradient.addColorStop(1, node.color + "00");
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx!.fillStyle = gradient;
          ctx!.fill();

          // Bright dot
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.radius + pulse * 0.4, 0, Math.PI * 2);
          ctx!.fillStyle = node.color;
          ctx!.fill();
        } else {
          // Dim dot
          const alpha = node.baseOpacity + pulse * 0.1;
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.radius * 0.7, 0, Math.PI * 2);
          ctx!.fillStyle =
            node.color +
            Math.round(alpha * 255)
              .toString(16)
              .padStart(2, "0");
          ctx!.fill();
        }
      }

      // Jellyfish — spawn very rarely
      if (Math.random() < 0.001) {
        const jColors = ["#FF6B35", "#00A676", "#2C7BE5"];
        jellyfishRef.current.push({
          x: Math.random() * w,
          y: h + 30,
          size: Math.random() * 15 + 10,
          color: jColors[Math.floor(Math.random() * jColors.length)],
          opacity: 0,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.15 + 0.08,
          drift: (Math.random() - 0.5) * 0.3,
          life: 0,
          maxLife: Math.random() * 800 + 600,
        });
      }

      // Update and draw jellyfish
      jellyfishRef.current = jellyfishRef.current.filter((j) => {
        j.life += 1;
        j.y -= j.speed;
        j.x += j.drift + Math.sin(time * 0.01 + j.phase) * 0.2;
        j.phase += 0.02;

        // Fade in/out
        const fadeIn = Math.min(j.life / 80, 1);
        const fadeOut = Math.max(1 - (j.life - j.maxLife + 80) / 80, 0);
        j.opacity = Math.min(fadeIn, fadeOut) * 0.12;

        if (j.life > j.maxLife || j.y < -50) return false;

        // Draw jellyfish bell (dome)
        const bellW = j.size;
        const bellH = j.size * 0.6;
        ctx!.beginPath();
        ctx!.ellipse(j.x, j.y, bellW, bellH, 0, Math.PI, 0);
        ctx!.fillStyle = j.color + Math.round(j.opacity * 255).toString(16).padStart(2, "0");
        ctx!.fill();

        // Draw tentacles
        const tentacles = 5;
        for (let t = 0; t < tentacles; t++) {
          const tx = j.x - bellW + (t / (tentacles - 1)) * bellW * 2;
          const tentLen = j.size * (0.8 + Math.sin(time * 0.03 + t + j.phase) * 0.3);
          ctx!.beginPath();
          ctx!.moveTo(tx, j.y);
          const cx1 = tx + Math.sin(time * 0.02 + t * 1.5 + j.phase) * 4;
          const cy1 = j.y + tentLen * 0.5;
          const ex = tx + Math.sin(time * 0.015 + t * 2 + j.phase) * 6;
          const ey = j.y + tentLen;
          ctx!.quadraticCurveTo(cx1, cy1, ex, ey);
          ctx!.strokeStyle = j.color + Math.round(j.opacity * 0.7 * 255).toString(16).padStart(2, "0");
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }

        return true;
      });

      // Mouse glow
      if (interactive && mouse.x > 0) {
        const gradient = ctx!.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 160
        );
        gradient.addColorStop(0, "rgba(255,107,53,0.04)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [nodeCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
