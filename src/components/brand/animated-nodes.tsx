"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface Connection {
  from: number;
  to: number;
  color: string;
  width: number;
}

const COLORS = {
  orange: "#FF6B35",
  green: "#00A676",
  blue: "#2C7BE5",
  gray: "#A7A9AC",
};

export function AnimatedNodes({
  className = "",
  nodeCount = 18,
  interactive = true,
}: {
  className?: string;
  nodeCount?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
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

    // Create nodes with more clustering for organic feel
    nodesRef.current = Array.from({ length: nodeCount }, (_, i) => {
      // Create some clusters
      const cluster = Math.floor(Math.random() * 3);
      const cx = cluster === 0 ? rect.width * 0.25 : cluster === 1 ? rect.width * 0.5 : rect.width * 0.75;
      const cy = cluster === 0 ? rect.height * 0.4 : cluster === 1 ? rect.height * 0.6 : rect.height * 0.35;
      const spread = Math.min(rect.width, rect.height) * 0.35;

      return {
        x: cx + (Math.random() - 0.5) * spread,
        y: cy + (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 5 + 2.5,
        color: colorKeys[Math.floor(Math.random() * colorKeys.length)],
        opacity: Math.random() * 0.4 + 0.6,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });

    // Create MANY more static connections (40% chance instead of 15%)
    connectionsRef.current = [];
    for (let i = 0; i < nodesRef.current.length; i++) {
      for (let j = i + 1; j < nodesRef.current.length; j++) {
        const dx = nodesRef.current[i].x - nodesRef.current[j].x;
        const dy = nodesRef.current[i].y - nodesRef.current[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Connect nodes that start close, with higher probability
        const prob = dist < 200 ? 0.6 : dist < 350 ? 0.3 : 0.08;
        if (Math.random() < prob) {
          connectionsRef.current.push({
            from: i,
            to: j,
            color: Math.random() > 0.5 ? nodesRef.current[i].color : nodesRef.current[j].color,
            width: Math.random() * 2 + 0.5,
          });
        }
      }
    }

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

      ctx!.clearRect(0, 0, w, h);
      time += 1;

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const mouse = mouseRef.current;

      // Update nodes — gentle attraction toward neighbors
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with padding
        if (node.x < 20 || node.x > w - 20) node.vx *= -1;
        if (node.y < 20 || node.y > h - 20) node.vy *= -1;
        node.x = Math.max(20, Math.min(w - 20, node.x));
        node.y = Math.max(20, Math.min(h - 20, node.y));

        // Gentle attraction toward nearby nodes (creates clustering/joining)
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 30) {
            // Attract gently
            node.vx += dx * 0.00008;
            node.vy += dy * 0.00008;
          } else if (dist < 30) {
            // Repel if too close
            node.vx -= dx * 0.0003;
            node.vy -= dy * 0.0003;
          }
        }

        // Mouse interaction — attract nodes to cursor
        if (interactive && mouse.x > 0) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            node.vx += dx * 0.0005;
            node.vy += dy * 0.0005;
          }
        }

        // Speed limit
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 0.6) {
          node.vx *= 0.6 / speed;
          node.vy *= 0.6 / speed;
        }

        // Damping
        node.vx *= 0.998;
        node.vy *= 0.998;
      }

      // Draw static connections with beautiful curves
      for (const conn of connections) {
        const a = nodes[conn.from];
        const b = nodes[conn.to];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 350) {
          const alpha = (1 - dist / 350) * 0.5;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);

          // Flowing curved lines
          const wave = Math.sin(time * 0.008 + conn.from * 0.5) * 20;
          const mx = (a.x + b.x) / 2 + wave;
          const my = (a.y + b.y) / 2 + Math.cos(time * 0.008 + conn.to * 0.5) * 20;
          ctx!.quadraticCurveTo(mx, my, b.x, b.y);

          ctx!.strokeStyle = conn.color + Math.round(alpha * 255).toString(16).padStart(2, "0");
          ctx!.lineWidth = conn.width;
          ctx!.lineCap = "round";
          ctx!.stroke();
        }
      }

      // Dynamic proximity connections — even MORE connections when nodes are close
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180 && dist > 15) {
            const alpha = (1 - dist / 180) * 0.25;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            // Slight curve for organic feel
            const mx = (a.x + b.x) / 2 + Math.sin(time * 0.005 + i) * 8;
            const my = (a.y + b.y) / 2 + Math.cos(time * 0.005 + j) * 8;
            ctx!.quadraticCurveTo(mx, my, b.x, b.y);
            ctx!.strokeStyle = a.color + Math.round(alpha * 255).toString(16).padStart(2, "0");
            ctx!.lineWidth = 0.8;
            ctx!.lineCap = "round";
            ctx!.stroke();
          }
        }
      }

      // Draw nodes with ring style (like the brand logo circles)
      for (const node of nodes) {
        const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase);
        const r = node.radius + pulse * 1.5;
        const alpha = node.opacity + pulse * 0.1;

        // Outer glow
        const gradient = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
        gradient.addColorStop(0, node.color + Math.round(alpha * 0.25 * 255).toString(16).padStart(2, "0"));
        gradient.addColorStop(1, node.color + "00");
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();

        // Ring (stroke circle — like the brand circles)
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx!.strokeStyle = node.color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx!.lineWidth = r > 4 ? 2 : 1.5;
        ctx!.stroke();

        // Filled core (slightly smaller, semi-transparent)
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, r * 0.5, 0, Math.PI * 2);
        ctx!.fillStyle = node.color + Math.round(alpha * 0.8 * 255).toString(16).padStart(2, "0");
        ctx!.fill();
      }

      // Mouse cursor glow
      if (interactive && mouse.x > 0) {
        const gradient = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        gradient.addColorStop(0, "rgba(255,107,53,0.06)");
        gradient.addColorStop(0.5, "rgba(0,166,118,0.03)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
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
