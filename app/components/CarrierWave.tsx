'use client';

import { useEffect, useRef } from 'react';
import { onVesper, type VesperMode } from '@/lib/bus';

// The signature element: an oscilloscope baseline that lives at the bottom of
// every page. Calm when VESPER is idle, agitated when it speaks, a clean
// traveling pulse on a correct answer, a flatline convulsion on a wrong one.
export default function CarrierWave() {
  const ref = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<VesperMode>('idle');
  const pulseRef = useRef(0);

  useEffect(() => {
    return onVesper((m) => {
      modeRef.current = m;
      if (m === 'success' || m === 'error' || m === 'climax') pulseRef.current = 1;
    });
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const H = 150;
    const COLORS: Record<VesperMode, string> = {
      idle: '#2f7a82',
      speak: '#e8e4d8',
      success: '#6fd0dc',
      error: '#c8503c',
      climax: '#d7b36b',
    };
    const TARGET: Record<VesperMode, number> = {
      idle: 6, speak: 17, success: 24, error: 2, climax: 36,
    };
    const noise = (x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1;

    let raf = 0;
    let t = 0;
    let amp = 6;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = () => {
      const w = window.innerWidth;
      const mid = H * 0.6;
      const mode = modeRef.current;
      const color = COLORS[mode];
      const isError = mode === 'error';

      amp += (TARGET[mode] - amp) * 0.06;
      pulseRef.current *= 0.965;
      const pulse = pulseRef.current;

      ctx.clearRect(0, 0, w, H);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const p = x / w;
        let y =
          Math.sin(p * 22 + t * 1.6) * amp +
          Math.sin(p * 53 - t * 2.3) * amp * 0.32 * (mode === 'climax' ? 1.5 : 1);
        if (mode === 'speak' || mode === 'climax') {
          y += (noise(x + t * 30) - 0.5) * amp * 0.9;
        }
        if (pulse > 0.02 && !isError) {
          const center = (t * 0.16) % 1;
          const d = p - center;
          y += Math.exp(-(d * d) / 0.0007) * 32 * pulse;
        }
        if (isError) {
          const spike = Math.exp(-Math.pow(p - 0.5, 2) / 0.0016);
          y = (noise(x * 3 + t) - 0.5) * 3 + spike * 28 * pulse * (noise(x + t) > 0 ? 1 : -1);
        }
        const yy = mid - y;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 4.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (!reduce) {
        t += 0.025;
        raf = requestAnimationFrame(frame);
      }
    };

    frame();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="carrier" aria-hidden="true" />;
}
