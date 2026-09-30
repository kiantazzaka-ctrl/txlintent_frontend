import { useEffect, useState } from 'react';
import Art from './Art';
import { halftoneWallet } from '../art/art';
import { BENTO } from '../content';

/* Block glyphs drawn in the reference's bar-mark style (332 × 336 box) */
const GLYPHS = [
  [[0, 0, 16, 336], [48, 0, 47, 112], [48, 224, 47, 112], [126, 0, 16, 336], [158, 112, 63, 112], [252, 0, 47, 112], [252, 224, 47, 112], [316, 0, 16, 336]],
  [[0, 0, 332, 24], [0, 312, 332, 24], [0, 0, 24, 336], [308, 0, 24, 336], [118, 120, 96, 96], [118, 24, 16, 64], [198, 248, 16, 64]],
  [[0, 0, 47, 224], [63, 0, 47, 280], [126, 0, 80, 336], [222, 0, 47, 280], [285, 0, 47, 224]],
  [[0, 112, 47, 112], [63, 112, 16, 112], [95, 224, 80, 112], [158, 112, 63, 112], [237, 0, 47, 112], [300, 0, 32, 112], [0, 0, 16, 112], [316, 224, 16, 112]],
];

export default function Bento() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setIdx((i) => (i + 1) % BENTO.slides.length), 3600);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="section dark bento" id="why-layer">
      <div className="head-row">
        <h2 className="h-display light reveal">{BENTO.title[0]}<br />{BENTO.title[1]}</h2>
        <p className="t-body light reveal d1" style={{ paddingTop: 38 }}>{BENTO.body}</p>
      </div>
      <div className="bento-grid">
        <div className="bento-left reveal" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="num">{String(idx + 1).padStart(2, '0')}</div>
          <div className="slides">
            {BENTO.slides.map((s, i) => (
              <div key={s.title} className={`slide${i === idx ? ' on' : ''}`} aria-hidden={i !== idx}>
                <svg className="glyph" width="332" height="336" viewBox="0 0 332 336">
                  {GLYPHS[i].map(([x, y, w, h], k) => <rect key={k} x={x} y={y} width={w} height={h} style={{ animationDelay: `${k * 0.05}s` }} />)}
                </svg>
                <div className="slide-text">
                  <div className="slide-title">{s.title}</div>
                  <div className="slide-sub">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="dots" role="tablist" aria-label="Core flow slides">
            {BENTO.slides.map((s, i) => <button key={s.title} role="tab" aria-selected={i === idx} aria-label={s.title} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} />)}
          </div>
        </div>
        <div className="bento-right reveal d1">
          <Art draw={halftoneWallet} fps={12} />
          <h3>{BENTO.right.lines.map((l) => <span key={l}>{l}<br /></span>)}</h3>
          <p>{BENTO.right.body}</p>
          <a href="#access" className="btn-pill">{BENTO.right.cta}</a>
        </div>
      </div>
    </section>
  );
}
