import Art from './Art';
import { roseGlow, mosaicTree, streaks } from '../art/art';
import { ROADMAP } from '../content';

const ART = { rose: roseGlow, mosaic: mosaicTree, streaks };

export default function Roadmap() {
  return (
    <section className="section roadmap" id="roadmap">
      <div className="head-row">
        <h2 className="h-display reveal">{ROADMAP.title}</h2>
        <p className="t-body reveal d1" style={{ paddingTop: 16 }}>{ROADMAP.body}</p>
      </div>
      <div className="road-grid">
        {ROADMAP.cards.map((c, i) => (
          <article key={c.title} className={`road-card reveal d${i + 1}`}>
            <div className="pic"><Art draw={ART[c.art]} /></div>
            <h3>{c.title}</h3>
            <div className="road-meta"><span className="tag">{c.tag}</span><span className="when">{c.when}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}
