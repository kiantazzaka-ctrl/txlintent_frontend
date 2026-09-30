import * as I from './Icons';
import { SEE } from '../content';

export default function See() {
  return (
    <section className="section see" id="see">
      <h2 className="h-display reveal">{SEE.title}</h2>
      <p className="t-body reveal d1">{SEE.body}</p>
      <div className="see-grid">
        {SEE.items.map((it, i) => {
          const Icon = I[it.icon];
          return (
            <div key={it.title} className={`see-item reveal d${(i % 3) + 1}`}>
              <span className="see-ico"><Icon /></span>
              <div><h3>{it.title}</h3><p>{it.desc}</p></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
