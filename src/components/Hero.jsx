import Art from './Art';
import { Corner } from './Icons';
import { heroEye } from '../art/art';
import { BRAND, PRODUCT, HERO } from '../content';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-left">
        <h1 className="hero-title" aria-label={`${BRAND} — ${PRODUCT}`}>
          {BRAND.split('').map((c, i) => <span key={i} className="ch" style={{ animationDelay: `${0.15 + i * 0.05}s` }} aria-hidden="true">{c}</span>)}
        </h1>
        <p className="t-body hero-sub reveal d2">{HERO.sub}</p>
        <div className="hero-rule reveal d3" />
        <a href="#demo" className="btn-pill hero-cta reveal d4">{HERO.cta}</a>
      </div>
      <div className="hero-right">
        <Corner className="corner-icon" />
        <div className="hero-art"><Art draw={heroEye} fps={15} label="Pixel illustration of an eye scanning a transaction" /></div>
      </div>
    </section>
  );
}
