import { useEffect, useRef } from 'react';

/**
 * Sizes a canvas to its box (DPR aware), redraws on resize and only animates
 * while on screen. `render(ctx, w, h, t, state)` — `state` is reset on resize.
 * Pass fps = 0 for a static drawing.
 */
export function useCanvas(render, { fps = 0 } = {}) {
  const ref = useRef(null);
  const renderRef = useRef(render);
  renderRef.current = render;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, visible = false, last = 0, state = {};
    const start = performance.now();

    const draw = (now) => {
      if (!w || !h) return;
      renderRef.current(ctx, w, h, (now - start) / 1000, state);
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (r.width === w && r.height === h) return;
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = {};
      draw(performance.now());
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / fps) return;
      last = now;
      draw(now);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let io;
    if (fps > 0 && !reduce) {
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(loop);
      });
      io.observe(canvas);
    }
    return () => { ro.disconnect(); io?.disconnect(); cancelAnimationFrame(raf); };
  }, [fps]);

  return ref;
}

/* deterministic hash noise in [0,1) */
export const hash = (x, y = 0, z = 0) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

/* value noise 1D/2D */
export const noise2 = (x, y) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
