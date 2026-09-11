import React, { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth || 300;
      canvas.height = window.innerHeight || 300;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const particles = [];
    const count = 40;
    const width = canvas.width || window.innerWidth || 800;
    const height = canvas.height || window.innerHeight || 600;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.max(0.8, Math.random() * 2 + 0.5),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.7 ? "rgba(220, 30, 30," : "rgba(255, 255, 255,",
      });
    }

    let time = 0;

    const animate = () => {
      if (!isRunning || !canvas || !ctx) return;
      time += 0.016;

      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.5 + 0.5;
        const alpha = Math.min(1, Math.max(0, p.opacity * (0.5 + pulse * 0.5)));
        const outerRadius = Math.max(1, p.radius * 6);

        // Glow
        try {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, outerRadius);
          gradient.addColorStop(0, `${p.color}${Math.min(1, Math.max(0, alpha * 0.3))})`);
          gradient.addColorStop(1, `${p.color}0)`);
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, outerRadius, 0, Math.PI * 2);
          ctx.fill();
        } catch {
          // Fallback if gradient fails
        }

        // Core
        ctx.beginPath();
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw subtle connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = Math.min(1, Math.max(0, (1 - dist / 120) * 0.08));
            ctx.beginPath();
            ctx.strokeStyle = `rgba(220, 30, 30, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
