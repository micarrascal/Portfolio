import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  homeX: number; homeY: number;
  vx: number; vy: number;
  size: number;
  color: string;
}

interface ParticleTextProps {
  text: string;
  className?: string;
  /** Target font size in CSS px; auto-shrinks to fit the container width. */
  fontSize?: number;
  /** Sampling grid step in CSS px — lower = more particles = denser text. */
  gap?: number;
  colors?: string[];
  particleSize?: number;
  repelRadius?: number;
  repelStrength?: number;
  spring?: number;
  friction?: number;
  /** If true, particles start scattered at random and animate into the text shape once the element scrolls into view. */
  revealOnScroll?: boolean;
}

const DEFAULT_COLORS = ['#ec4899', '#db2777', '#a855f7', '#c084fc', '#f472b6'];

/**
 * Renders `text` as a field of canvas particles sitting at rest in the shape
 * of the text. Particles near the mouse are repelled and spring back to
 * their "home" position once the cursor moves away — a lightweight,
 * dependency-free version of the classic particle-text hover effect.
 */
export function ParticleText({
  text,
  className = '',
  fontSize = 200,
  gap = 4,
  colors = DEFAULT_COLORS,
  particleSize = 1.5,
  repelRadius = 65,
  repelStrength = 900,
  spring = 0.04,
  friction = 0.86,
  revealOnScroll = false,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const rafRef = useRef(0);
  const revealedRef = useRef(!revealOnScroll);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function buildParticles() {
      const rect = container!.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      sizeRef.current = { width, height, dpr };

      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d')!;

      const clampedFontSize = Math.min(fontSize, width / (text.length * 0.62));
      octx.font = `800 ${clampedFontSize}px system-ui, -apple-system, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#000';
      octx.fillText(text, width / 2, height / 2);

      const imageData = octx.getImageData(0, 0, width, height).data;
      const scatter = revealOnScroll && !revealedRef.current;
      const particles: Particle[] = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = imageData[(y * width + x) * 4 + 3];
          if (alpha > 128) {
            particles.push({
              x: scatter ? Math.random() * width : x,
              y: scatter ? Math.random() * height : y,
              homeX: x, homeY: y,
              vx: 0, vy: 0,
              size: particleSize + Math.random() * 0.8,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }
        }
      }
      particlesRef.current = particles;
    }

    buildParticles();

    function frame() {
      const { width, height, dpr } = sizeRef.current;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      for (const p of particlesRef.current) {
        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < repelRadius) {
            const force = (repelRadius - dist) / repelRadius;
            p.vx += (dx / dist) * force * repelStrength * 0.001;
            p.vy += (dy / dist) * force * repelStrength * 0.001;
          }
        }
        if (revealedRef.current) {
          p.vx += (p.homeX - p.x) * spring;
          p.vy += (p.homeY - p.y) * spring;
        }
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;

        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    // Listen globally (not just on the canvas): foreground hero content sits
    // above the canvas in z-index and would otherwise "steal" mousemove
    // over its (largely invisible) block boxes, since CSS hit-testing
    // targets the topmost element under the cursor regardless of visual
    // content. mousemove/mouseleave still bubble to window/document
    // following the DOM tree, independent of stacking order.
    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = sizeRef.current;
      mouseRef.current = (x >= 0 && x <= width && y >= 0 && y <= height) ? { x, y } : null;
    }
    function handleMouseLeave() {
      mouseRef.current = null;
    }
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let resizeTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildParticles, 200);
    }
    window.addEventListener('resize', handleResize);

    let observer: IntersectionObserver | undefined;
    if (revealOnScroll && !revealedRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            revealedRef.current = true;
            observer?.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(container);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer?.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [text, fontSize, gap, colors, particleSize, repelRadius, repelStrength, spring, friction, revealOnScroll]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
}
