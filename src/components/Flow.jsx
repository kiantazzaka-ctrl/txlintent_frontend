import Art from './Art';
import { DoubleCheck, Spinner, Clock, Clip } from './Icons';
import { ditherLock, greenField, wordPlant } from '../art/art';
import { FLOW } from '../content';

function Step({ state, children, chip }) {
  const icon = state === 'done' ? <DoubleCheck /> : state === 'run' ? <Spinner /> : <Clock />;
  const cls = state === 'done' ? 'ui-muted' : state === 'run' ? 'ui-dark' : '';
  return (
    <div className="ui-step">
      <span className={`ui-dot ${state}`}>{icon}</span>
      <span className={`ui-label ${cls}`}>{children}</span>
      {chip && <span className="ui-chip">{chip}</span>}
    </div>
  );
}

const arts = [
  () => <Art draw={ditherLock} />,
  () => (
    <>
      <Art draw={greenField} fps={6} />
      <div className="panel">
        <div className="ui-card panel-top">
          <div className="ui-label">Intent Analysis</div>
          <div className="ui-steps">
            <Step state="done">Decode calldata</Step>
            <Step state="done">Identify contract</Step>
            <Step state="run" chip="18%">Resolve actions</Step>
            <Step state="wait">Map to intent</Step>
          </div>
        </div>
        <div className="ui-card panel-bot">
          <span className="ui-attach"><Clip /></span>
          <div><div className="t1">Identifying</div><div className="ui-label ui-muted">approve(address, uint256)</div></div>
          <span className="live">LIVE</span>
        </div>
      </div>
    </>
  ),
  () => (
    <>
      <div className="ui-card file">
        <span className="ui-attach"><Clip /></span>
        <span className="mono">0x095ea7b3…ffff</span>
      </div>
      <div className="proc">
        <div className="ui-label">Translating intent…</div>
        <div className="ui-bars"><i style={{ width: '64%' }} /><i style={{ width: '37%' }} /><i style={{ width: '50%' }} /></div>
        <div className="go"><Spinner size={14} /></div>
      </div>
    </>
  ),
  () => <Art draw={wordPlant} fps={4} />,
];

export default function Flow() {
  return (
    <section className="section flow" id="flow">
      <div className="head-row">
        <h2 className="h-display reveal">{FLOW.title}</h2>
        <p className="t-body reveal d1">{FLOW.body}</p>
      </div>
      <div className="flow-grid">
        {FLOW.cards.map((c, i) => {
          const A = arts[i];
          return (
            <article key={c.num} className={`flow-card reveal d${i + 1}`}>
              <div className={`art fc${i + 1}`}><A /></div>
              <div className="flow-meta">
                <div className="flow-num">{c.num}</div>
                <h3 className="flow-title">{c.title}</h3>
                <p className="t-body flow-desc">{c.desc}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
