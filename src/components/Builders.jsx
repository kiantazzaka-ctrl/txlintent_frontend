import { useEffect, useRef, useState } from 'react';
import Art from './Art';
import { ChevronL, ChevronR } from './Icons';
import { emblem } from '../art/art';
import { BUILDERS } from '../content';

const draws = BUILDERS.cards.map((c) => emblem(c.kind, c.bg, c.pal));

export default function Builders() {
  const [idx, setIdx] = useState(0);
  const [max, setMax] = useState(0);
  const [step, setStep] = useState(704);
  const viewport = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const measure = () => {
      const card = track.current?.firstElementChild;
      if (!card) return;
      const s = card.getBoundingClientRect().width + 16;
      const over = track.current.scrollWidth - viewport.current.clientWidth;
      setStep(s);
      setMax(Math.max(0, Math.ceil(over / s - 0.01)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const clampIdx = Math.min(idx, max);
  const offset = Math.min(clampIdx * step, Math.max(0, (track.current?.scrollWidth || 0) - (viewport.current?.clientWidth || 0)));

  return (
    <section className="section dark builders" id="builders">
      <div className="head-row">
        <h2 className="h-display light reveal">{BUILDERS.title[0]}<br />{BUILDERS.title[1]}</h2>
        <p className="t-body light reveal d1">{BUILDERS.body}</p>
      </div>
      <div className="car reveal d2" ref={viewport}>
        <div className="car-track" ref={track} style={{ transform: `translateX(${-offset}px)` }}>
          {BUILDERS.cards.map((c, i) => (
            <article key={c.kind} className="car-card">
              <div className="pic"><Art draw={draws[i]} fps={5} /></div>
              <div className="txt">
                <p className="q">{c.q}</p>
                <p className="who">— {c.who}</p>
                <div className="big">{c.big}</div>
                <div className="lbl">{c.lbl}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="car-nav">
        <button aria-label="Previous" disabled={clampIdx === 0} onClick={() => setIdx(Math.max(0, clampIdx - 1))}><ChevronL /></button>
        <button aria-label="Next" disabled={clampIdx >= max} onClick={() => setIdx(Math.min(max, clampIdx + 1))}><ChevronR /></button>
      </div>
    </section>
  );
}
