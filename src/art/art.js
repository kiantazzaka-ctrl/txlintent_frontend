/*
 * Procedural artwork in the reference's visual language (pixel mosaics,
 * dithering, bar fields, halftones, ASCII fields). All original drawings.
 */
import { hash, clamp, smooth, noise2 } from './useCanvas';

/* ---------- shared: woven cell texture like the reference mosaics ---------- */
function weave(ctx, w, h, alpha = 0.14, step = 3) {
  ctx.fillStyle = `rgba(0,0,0,${alpha})`;
  for (let x = 0; x < w; x += step) ctx.fillRect(x, 0, 1, h);
  for (let y = 0; y < h; y += step) ctx.fillRect(0, y, w, 0.6);
}

/* Pixel mosaic renderer: value(x,y) → [0,1], quantised to palette */
function mosaic(ctx, w, h, cell, palette, value, { gap = 1, skip = 0 } = {}) {
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const n = palette.length;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const v = value(i * cell + cell / 2, j * cell + cell / 2, i, j);
      if (v <= skip) continue;
      const idx = Math.min(n - 1, Math.floor(clamp(v) * n));
      ctx.fillStyle = palette[idx];
      ctx.fillRect(i * cell, j * cell, cell - gap, cell - gap);
    }
  }
}

/* ======================================================================
   HERO — pixel eye that watches, blinks and scans (the “see what it does”)
   ====================================================================== */
const EYE_PALETTE = ['#3b3534', '#4d4746', '#686362', '#8a8685', '#b1aeac', '#d9d7d5', '#f0efee'];
export function heroEye(ctx, w, h, t, s) {
  const cell = w < 520 ? 10 : 14;
  ctx.fillStyle = '#322c2b';
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.52, cy = h * 0.42;
  const ew = Math.min(w * 0.40, h * 0.42);
  const period = 5.5, bt = t % period;
  const blink = bt < 0.28 ? 1 - Math.sin((bt / 0.28) * Math.PI) : 1;
  const eh = ew * 0.44;
  const ehB = Math.max(0.02, eh * blink);
  const px = Math.sin(t * 0.45) * ew * 0.16 + Math.sin(t * 1.3) * ew * 0.02;
  const py = Math.cos(t * 0.33) * eh * 0.12;
  const irisR = ew * 0.34;
  const scan = ((t * 0.18) % 1.4 - 0.2) * h;
  const tick = Math.floor(t * 6);

  mosaic(ctx, w, h, cell, EYE_PALETTE, (x, y, i, j) => {
    const nx = (x - cx) / ew;
    const nyB = (y - cy) / ehB;
    const ny = (y - cy) / eh;
    const a = 1 - nx * nx;
    let v;
    const grain = (hash(i, j) - 0.5) * 0.08;
    if (a > 0 && Math.abs(nyB) < a) {
      // inside the eye
      v = 0.8 - 0.35 * nx * nx;
      const dx = x - cx - px, dy = y - cy - py;
      const r = Math.hypot(dx, dy) / irisR;
      if (r < 1) {
        const ang = Math.atan2(dy, dx);
        const streak = 0.5 + 0.5 * Math.sin(ang * 14 + hash(Math.round(ang * 9)) * 4);
        v = 0.36 + 0.2 * streak * (1 - r * 0.5);
        if (r > 0.86) v = 0.16;
        if (r < 0.44) v = 0.02;
        const hl = Math.hypot(dx + irisR * 0.32, dy + irisR * 0.34) / irisR;
        if (hl < 0.17) v = 1;
      }
      if (nyB < -a * 0.62) v *= 0.62; // lid shadow
    } else {
      // skin, lids and brow
      v = 0.1 + noise2(x / 70, y / 70) * 0.14;
      const upper = -ny - a;              // distance above lid line
      if (a > -0.2 && upper > 0 && upper < 0.5) v = 0.44 - upper * 0.3;
      if (a > -0.1 && upper > 0.62 && upper < 0.78) v = 0.3;
      const lower = ny - a;
      if (a > -0.1 && lower > 0 && lower < 0.28) v = 0.36;
      const brow = (y - (cy - eh * 2.25 + nx * nx * eh * 0.55)) / (eh * 0.34);
      if (Math.abs(nx) < 1.12 && Math.abs(brow) < 1) v = 0.5 + hash(i * 3, j * 7) * 0.22 - Math.abs(nx) * 0.12;
      const cheek = Math.exp(-(((x - cx - ew * 0.25) / (ew * 0.9)) ** 2 + ((y - cy - eh * 2.6) / (eh * 1.3)) ** 2));
      v += cheek * 0.16;
      const fall = Math.hypot((x - cx) / (ew * 1.45), (y - cy + eh * 0.5) / (eh * 4.2));
      v *= 1.1 - smooth(0.6, 1.05, fall) * 1.1;
    }
    v += grain;
    if (Math.abs(y - scan) < cell * 1.5) v += 0.14;
    if (hash(i, j, tick) > 0.992) v += hash(j, i) > 0.5 ? 0.18 : -0.18;
    return v;
  }, { skip: 0.13 });
  weave(ctx, w, h, 0.12, 3);
}

/* ======================================================================
   ENGINE — bar field over a warm gradient; tops breathe like a waveform
   ====================================================================== */
export function engineBars(ctx, w, h, t) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#eeebe6'); g.addColorStop(0.38, '#cfc5ba');
  g.addColorStop(0.72, '#a28f7e'); g.addColorStop(1, '#6a4526');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const r = ctx.createRadialGradient(w * 0.08, h * 0.1, 0, w * 0.08, h * 0.1, w * 0.35);
  r.addColorStop(0, 'rgba(245,244,240,.8)'); r.addColorStop(1, 'rgba(245,244,240,0)');
  ctx.fillStyle = r; ctx.fillRect(0, 0, w, h);

  const step = w < 600 ? 8 : 16.4, bw = w < 600 ? 5 : 10;
  const cols = Math.ceil(w / step);
  for (let i = 0; i < cols; i++) {
    const f = 0.52 + 0.24 * Math.sin(i * 0.085 + t * 0.35) + 0.12 * Math.sin(i * 0.21 - t * 0.6) + 0.08 * Math.sin(i * 0.033 + 1.3);
    const top = h * (1 - clamp(f, 0.05, 0.98)) * 0.92;
    let y = top, k = 0;
    const x = i * step + 10;
    while (y < h) {
      const len = 14 + hash(i, k) * 70;
      const pick = hash(k, i * 1.7);
      const a = pick < 0.55 ? 0.96 : pick < 0.82 ? 0.55 : pick < 0.93 ? 0.22 : 0;
      if (a) { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(x, y, bw, len - 1.5); }
      y += len; k++;
    }
  }
  ctx.fillStyle = 'rgba(90,70,60,.08)';
  for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
}

/* ======================================================================
   FLOW 01 — dithered padlock on textured taupe (Decode)
   ====================================================================== */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
export function ditherLock(ctx, w, h) {
  const c = 3;
  const pal = ['#3a3230', '#554c48', '#6e6560', '#857c76'];
  const cx = w * 0.46, bodyY = h * 0.55, bw = w * 0.25, bh = h * 0.17;
  const sr = w * 0.15, st = w * 0.05, sy = bodyY - bh;
  for (let y = 0; y < h; y += c) {
    for (let x = 0; x < w; x += c) {
      let v = 0.62 + (noise2(x / 60, y / 60) - 0.5) * 0.25;
      const dx = Math.abs(x - cx) - bw, dy = Math.abs(y - bodyY) - bh;
      const box = Math.max(dx, dy) < 0;
      const d = Math.hypot(x - cx, y - sy);
      const shackle = y < sy + 6 && Math.abs(d - sr) < st;
      const legs = y >= sy && y < bodyY && Math.abs(Math.abs(x - cx) - sr) < st;
      if (box || shackle || legs) {
        v = 0.12 + noise2(x / 18, y / 18) * 0.22;
        const kh = Math.hypot(x - cx, y - bodyY + bh * 0.2) < w * 0.035 || (Math.abs(x - cx) < w * 0.014 && y > bodyY - bh * 0.2 && y < bodyY + bh * 0.45);
        if (kh) v = 0.5;
      }
      const th = BAYER[((y / c) % 4) * 4 + ((x / c) % 4)];
      const idx = clamp(Math.floor(v * 3 + th), 0, 3);
      ctx.fillStyle = pal[idx];
      ctx.fillRect(x, y, c, c);
    }
  }
  ctx.fillStyle = 'rgba(20,16,15,.1)';
  for (let y = 0; y < h; y += 2) ctx.fillRect(0, y, w, 0.7);
  ctx.fillStyle = '#f1ece8';
  ctx.fillRect(w * 0.19, h * 0.34, 7, 7);
  ctx.fillRect(w * 0.57, h * 0.45, 7, 7);
}

/* ======================================================================
   FLOW 02 — green bar field (Identify)
   ====================================================================== */
export function greenField(ctx, w, h, t) {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
  const step = 5, bw = 3, seg = 6;
  const tk = Math.floor(t * 3);
  for (let i = 0; i < w / step; i++) {
    const x = i * step;
    const edge = h * (0.18 + 0.22 * Math.sin(i * 0.045 + 0.6) + 0.1 * noise2(i * 0.08, 3)) - (x / w) * h * 0.15;
    for (let y = 0; y < h; y += seg) {
      const p = smooth(edge - 90, edge + 30, y) ;
      const r = hash(i, y, tk * (p > 0.1 && p < 0.9 ? 1 : 0));
      if (r < p) {
        ctx.fillStyle = r < p * 0.2 ? '#3d9a5c' : '#1f7a40';
        ctx.fillRect(x, y, bw, seg - (p > 0.95 ? 0 : 2));
      }
    }
  }
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.fillRect(w * 0.14, h * 0.13, 12, 12);
}

/* ======================================================================
   FLOW 04 — plain-language words growing into a plant (Check / Explain)
   ====================================================================== */
const WORDS = ['unlimited', 'allowance', 'USDC', 'spender', 'revocable', 'recipient', 'owner', 'operator', 'transfer', 'approve', 'permission', 'contract', 'warning', 'reversible', 'risk', 'intent', 'final', 'active', 'until', 'revoked', 'assets', 'move', 'safe', 'flag'];
export function wordPlant(ctx, w, h, t) {
  const blobs = [
    [0.1, 0.85, 0.55, '#0e140c'], [0.2, 0.25, 0.5, '#6c776f'], [0.85, 0.15, 0.5, '#44502d'],
    [0.9, 0.9, 0.55, '#d8c77c'], [0.6, 0.6, 0.45, '#3f4a25'], [0.35, 0.5, 0.35, '#8a9270'],
  ];
  ctx.fillStyle = '#2d3620'; ctx.fillRect(0, 0, w, h);
  for (const [bx, by, br, col] of blobs) {
    const g = ctx.createRadialGradient(bx * w, by * h, 0, bx * w, by * h, br * Math.max(w, h));
    g.addColorStop(0, col); g.addColorStop(1, col + '00');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  ctx.textBaseline = 'middle';
  let k = 0;
  const place = (x, y, size, a) => {
    const word = WORDS[k++ % WORDS.length];
    const tw = 0.6 + 0.4 * Math.sin(t * 1.4 + k);
    ctx.font = `${size}px Georgia, 'Times New Roman', serif`;
    ctx.fillStyle = `rgba(230,240,150,${a * tw})`;
    ctx.fillText(word, x, y);
  };
  // stem
  for (let i = 0; i < 60; i++) {
    const p = i / 60;
    const x = w * (0.44 + 0.08 * Math.sin(p * 3)) + (hash(i, 2) - 0.5) * 14;
    const y = h * (1 - p * 0.72);
    place(x, y, 6 + hash(i) * 3, 0.55);
  }
  // leaf
  for (let i = 0; i < 40; i++) {
    const p = i / 40;
    place(w * (0.5 + p * 0.28) + (hash(i, 5) - 0.5) * 10, h * (0.78 - p * 0.3) + (hash(i, 9) - 0.5) * 10, 6 + hash(i, 1) * 2, 0.45);
  }
  // bloom cluster
  for (let i = 0; i < 150; i++) {
    const a = hash(i, 7) * Math.PI * 2, r = Math.sqrt(hash(i, 8)) * w * 0.16;
    place(w * 0.58 + Math.cos(a) * r * 1.3, h * 0.22 + Math.sin(a) * r, 6 + hash(i, 3) * 4, 0.8);
  }
  ctx.fillStyle = '#f1ece8';
  ctx.fillRect(w * 0.19, h * 0.22, 7, 7);
  ctx.fillRect(w * 0.19, h * 0.56, 7, 7);
}

/* ======================================================================
   BENTO — halftone wallet
   ====================================================================== */
export function halftoneWallet(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h);
  const step = 9;
  const cx = w * 0.56, cy = h * 0.8, ang = -0.14;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  for (let y = h * 0.35; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const lx = (x - cx) * ca - (y - cy) * sa, ly = (x - cx) * sa + (y - cy) * ca;
      const bx = Math.abs(lx) - w * 0.36, by = Math.abs(ly) - h * 0.14;
      const body = Math.max(bx, by) < 0;
      const flap = Math.abs(lx - w * 0.2) < w * 0.16 && Math.abs(ly + h * 0.02) < h * 0.05;
      let v = body ? 0.78 + noise2(x / 50, y / 50) * 0.2 : 0;
      if (flap) v = 0.35;
      const fall = smooth(h * 0.6, h, y) * (0.35 + noise2(x / 40, y / 40 + t * 0.1) * 0.6);
      v = Math.max(v, fall * (1 - smooth(0.2, 0.9, x / w) * 0.4));
      const pulse = 0.9 + 0.1 * Math.sin(t * 1.2 + x * 0.02 + y * 0.015);
      const s = step * 0.86 * clamp(v * pulse);
      if (s < 1) continue;
      ctx.fillStyle = 'rgba(176,162,151,.95)';
      ctx.fillRect(x + (step - s) / 2, y + (step - s) / 2, s, s);
    }
  }
}

/* ======================================================================
   BUILDERS — pixel emblems (wallet / app / interface)
   ====================================================================== */
const SHAPES = {
  wallet: (nx, ny) => { const b = Math.max(Math.abs(nx) - 0.62, Math.abs(ny) - 0.42) < 0; const f = Math.abs(nx - 0.42) < 0.24 && Math.abs(ny) < 0.12; return f ? 0.55 : b ? 0.9 : 0; },
  app: (nx, ny) => { const b = Math.max(Math.abs(nx) - 0.6, Math.abs(ny) - 0.5) < 0; if (!b) return 0; if (ny < -0.3) return 0.55; if (Math.abs(nx + 0.3) < 0.2 && ny > -0.2 && ny < 0.35) return 0.35; return 0.92; },
  code: (nx, ny) => { const l = Math.abs(Math.abs(ny) * 0.9 - (nx + 0.35)) < 0.1 && nx < -0.05 && nx > -0.72; const r = Math.abs(Math.abs(ny) * 0.9 + (nx - 0.35)) < 0.1 && nx > 0.05 && nx < 0.72; const s = Math.abs(nx + ny * 0.3) < 0.07 && Math.abs(ny) < 0.55; return l || r ? 0.95 : s ? 0.7 : 0; },
};
export function emblem(kind, bg, pal) {
  return (ctx, w, h, t) => {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    const cell = 9, scale = Math.min(w, h) * 0.42;
    const tick = Math.floor(t * 5);
    mosaic(ctx, w, h, cell, pal, (x, y, i, j) => {
      const nx = (x - w * 0.5) / scale, ny = (y - h * 0.5) / scale;
      let v = SHAPES[kind](nx, ny);
      const light = 1 - clamp(Math.hypot(nx + 0.6, ny + 0.8) / 2.6);
      if (v) v = v * (0.55 + light * 0.5) + (hash(i, j) - 0.5) * 0.1;
      else v = noise2(x / 40, y / 40) * 0.28 * smooth(0.5, 1.4, Math.hypot(nx, ny));
      if (hash(i, j, tick) > 0.994) v += 0.3;
      return v;
    }, { skip: 0.1 });
    weave(ctx, w, h, 0.08, 3);
  };
}

/* ======================================================================
   ROADMAP — mosaic tree / streaks
   ====================================================================== */
export function mosaicTree(ctx, w, h) {
  ctx.fillStyle = '#07080c'; ctx.fillRect(0, 0, w, h);
  const c = 9;
  for (let y = 0; y < h; y += c) {
    for (let x = 0; x < w; x += c) {
      const ny = y / h;
      const n = noise2(x / 38, y / 38), m = noise2(x / 13 + 9, y / 13);
      const warm = ny < 0.48 + (n - 0.5) * 0.3;
      const r = hash(x, y);
      if (warm) {
        if (r < 0.28) ctx.fillStyle = '#e1b12c'; else if (r < 0.4) ctx.fillStyle = '#d12a1f'; else if (r < 0.46) ctx.fillStyle = '#f4f1ea'; else if (r < 0.6) ctx.fillStyle = '#2a58a8'; else if (m > 0.55) ctx.fillStyle = '#8c6b1c'; else continue;
      } else {
        const branch = Math.abs(noise2(x / 60, y / 20) - 0.5) < 0.12;
        if (branch && r < 0.75) ctx.fillStyle = r < 0.5 ? '#2553a0' : '#173a78';
        else { if (r < 0.5) { ctx.fillStyle = '#b2211a'; ctx.fillRect(x + 3, y + 3, 2, 2); } continue; }
      }
      ctx.fillRect(x + 1, y + 1, c - 2, c - 2);
      if (hash(y, x) > 0.7) { ctx.fillStyle = '#07080c'; ctx.fillRect(x + 3, y + 3, c - 6, c - 6); }
    }
  }
}
export function streaks(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#e8e3ef'); g.addColorStop(0.45, '#8e98a8'); g.addColorStop(1, '#1d2a1c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const r = ctx.createRadialGradient(w * 0.85, h * 0.85, 0, w * 0.85, h * 0.85, w * 0.6);
  r.addColorStop(0, '#4e5226'); r.addColorStop(1, 'rgba(78,82,38,0)');
  ctx.fillStyle = r; ctx.fillRect(0, 0, w, h);
  const cols = ['#e2893b', '#f4e6d0', '#1b3d2a', '#3b64b2', '#e9eef8', '#0f1a14', '#caa37c'];
  ctx.filter = 'blur(7px)';
  for (let i = 0; i < 26; i++) {
    const x = w * (0.2 + hash(i) * 0.65), top = h * (0.12 + hash(i, 1) * 0.35), len = h * (0.25 + hash(i, 2) * 0.4);
    const gg = ctx.createLinearGradient(0, top, 0, top + len);
    const col = cols[i % cols.length];
    gg.addColorStop(0, col + '00'); gg.addColorStop(0.3, col); gg.addColorStop(1, col + '00');
    ctx.fillStyle = gg; ctx.fillRect(x, top, 6 + hash(i, 3) * 16, len);
  }
  ctx.filter = 'none';
}
export function roseGlow(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#e6cfb0'); g.addColorStop(0.22, '#cf7e8a'); g.addColorStop(0.48, '#6e2338'); g.addColorStop(0.75, '#1c080d'); g.addColorStop(1, '#050203');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) { ctx.fillStyle = `rgba(255,255,255,${hash(i) * 0.05})`; ctx.fillRect(hash(i, 1) * w, hash(i, 2) * h, 1, 1); }
}

/* ======================================================================
   ACCESS — scattered monospace characters from the example output
   ====================================================================== */
const OUTPUT_TEXT = '{ "intent": "TOKEN_APPROVAL", "asset": "USDC", "spender": "0x...", "amount": "UNLIMITED", "risk_flags": [ "UNLIMITED_ALLOWANCE" ], "summary": "Approve this contract to spend your USDC." } Transaction → Decoder → Intent Engine → Security Rules → Human-readable Result ';
export function scatterChars(ctx, w, h) {
  ctx.fillStyle = '#d1c5bc'; ctx.fillRect(0, 0, w, h);
  ctx.font = "12px 'Chivo Mono', monospace";
  ctx.fillStyle = 'rgba(130,115,103,.9)';
  let k = 0;
  for (let y = 12; y < h; y += 21.6) {
    for (let x = 8; x < w; x += 7.6) {
      const ch = OUTPUT_TEXT[k++ % OUTPUT_TEXT.length];
      if (hash(x, y) < 0.3) ctx.fillText(ch, x, y);
    }
  }
}

/* ======================================================================
   FOOTER — ASCII field forming a large bracket mark
   ====================================================================== */
export function asciiField(ctx, w, h) {
  ctx.fillStyle = '#322c2b'; ctx.fillRect(0, 0, w, h);
  const cw = 8.2, lh = 12.2, chars = 'TXINTENT';
  ctx.font = "11px 'Chivo Mono', monospace";
  ctx.textBaseline = 'top';
  const cx = w * 0.46, cy = h * 0.5, s = h * 0.62;
  for (let y = 0, r = 0; y < h; y += lh, r++) {
    for (let x = 0, c = 0; x < w; x += cw, c++) {
      const nx = (x - cx) / s, ny = (y - cy) / s;
      const bracket = (Math.abs(ny) < 0.8 && Math.abs(Math.abs(nx) - 0.7) < 0.1) || (Math.abs(Math.abs(ny) - 0.74) < 0.06 && Math.abs(nx) > 0.45 && Math.abs(nx) < 0.8);
      const dot = Math.abs(nx) < 0.13 && Math.abs(ny) < 0.13;
      const band = Math.abs(ny) > 0.95 || Math.abs(nx) > 1.25;
      let a = 0.04 + noise2(x / 70, y / 70) * 0.05;
      if (bracket || dot) a = 0.16 + hash(c, r) * 0.08;
      else if (band) a = 0.08;
      else if (hash(c, r) < 0.55) continue;
      ctx.fillStyle = `rgba(209,197,188,${a})`;
      ctx.fillText(chars[(c + r * 3) % chars.length], x, y);
    }
  }
}
