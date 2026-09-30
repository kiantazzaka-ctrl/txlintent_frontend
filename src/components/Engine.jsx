import Art from './Art';
import { Corner } from './Icons';
import { engineBars } from '../art/art';
import { ENGINE } from '../content';

export default function Engine() {
  return (
    <section className="section engine" id="engine">
      <h2 className="h-display reveal">{ENGINE.title}</h2>
      <p className="t-body reveal d1">{ENGINE.body}</p>
      <div className="engine-banner reveal d2">
        <Art draw={engineBars} fps={24} />
        <Corner className="corner-icon" />
        <div className="engine-stages">
          {ENGINE.stages.map((s, i) => <span key={s}>{s}<em>{i < ENGINE.stages.length - 1 ? '→' : '✓'}</em></span>)}
        </div>
      </div>
    </section>
  );
}
