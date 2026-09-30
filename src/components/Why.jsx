import { useEffect, useRef, useState } from 'react';
import { WHY } from '../content';

export default function Why() {
  const words = WHY.copy.split(' ');
  const ref = useRef(null);
  const [lit, setLit] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55)));
      setLit(Math.round(p * words.length));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [words.length]);

  return (
    <section className="section why" id="why">
      <div className="why-bg" aria-hidden="true">{WHY.bg.repeat(40)}</div>
      <h2 className="h-display light reveal">{WHY.title}</h2>
      <p className="why-copy" ref={ref}>
        {words.map((w, i) => <span key={i} className={i < lit ? 'lit' : ''}>{w}{' '}</span>)}
      </p>
    </section>
  );
}
