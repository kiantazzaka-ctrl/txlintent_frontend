import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DoubleCheck, Spinner, Clock, Clip, Alert, Info } from './Icons';
import { SAMPLES, interpret, short, CONTRACTS, FUNCTION_LIST, RULES } from '../lib/intent';
import { DEMO } from '../content';

const STEPS = [
  { name: 'Decode transaction', note: (r) => (r ? `Selector ${r.decoded.selector}` : 'Calldata and contract calls') },
  { name: 'Identify actions', note: (r) => (r ? r.decoded.fn?.sig || 'Unrecognized function' : 'Function and arguments') },
  { name: 'Plain-language intent', note: (r) => (r ? r.intent : 'Human-readable summary') },
  { name: 'Security rules', note: (r) => (r ? `${r.flags.length} risk flag${r.flags.length === 1 ? '' : 's'}` : 'Basic risk flags') },
  { name: 'Approval screen', note: () => 'Intent + warnings' },
];
const STEP_MS = 520;

/* JSON with light syntax colouring */
function JsonView({ value }) {
  const html = JSON.stringify(value, null, 2)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/("[^"]+")(\s*:)/g, '<span class="k">$1</span>$2')
    .replace(/:\s(".*?")/g, ': <span class="s">$1</span>')
    .replace(/(\[\s*|,\s*)(".*?")(?=\s*[\],])/g, '$1<span class="s">$2</span>');
  return <pre className="json" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Raw({ data }) {
  const clean = (data || '').replace(/\s+/g, '').toLowerCase();
  const sel = clean.slice(0, 10);
  const words = clean.slice(10).match(/.{1,64}/g) || [];
  return (
    <div className="raw" aria-label="Raw calldata">
      <span className="sel">{sel}</span>
      {words.map((w, i) => <div key={i}>{w}</div>)}
    </div>
  );
}

export default function Demo() {
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const sample = SAMPLES.find((s) => s.id === sampleId);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | typing | running | done | error
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [decision, setDecision] = useState(null);
  const [view, setView] = useState('screen');
  const timers = useRef([]);
  const boardRef = useRef(null);
  const started = useRef(false);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const run = useCallback((data, to) => {
    clear();
    setDecision(null);
    let r;
    try {
      r = interpret({ to, data });
      setError('');
    } catch (e) {
      setResult(null); setError(e.message); setPhase('error'); setStep(-1);
      return;
    }
    setResult(r); setPhase('running'); setStep(0);
    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => {
        if (i === STEPS.length - 1) { setStep(STEPS.length); setPhase('done'); } else setStep(i + 1);
      }, STEP_MS * (i + 1)));
    });
  }, []);

  const typeIn = useCallback((s) => {
    clear();
    setPhase('typing'); setResult(null); setStep(-1); setDecision(null); setError('');
    const full = s.data;
    const chunk = 4;
    for (let i = 0; i <= full.length; i += chunk) {
      timers.current.push(setTimeout(() => setInput(full.slice(0, i)), (i / chunk) * 14));
    }
    timers.current.push(setTimeout(() => { setInput(full); run(full, s.to); }, (full.length / chunk) * 14 + 200));
  }, [run]);

  // Auto-play the first sample when the board scrolls into view
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; typeIn(SAMPLES[0]); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [typeIn]);

  const pick = (s) => { setSampleId(s.id); typeIn(s); };
  const submit = (e) => { e.preventDefault(); run(input, sample.to); };

  const target = CONTRACTS[sample.to];
  const shown = phase === 'done';
  const pct = phase === 'running' && step >= 0 ? Math.min(99, Math.round(((step + 0.5) / STEPS.length) * 100)) : null;

  const stateOf = (i) => {
    if (phase === 'done') return 'done';
    if (phase !== 'running') return 'wait';
    return i < step ? 'done' : i === step ? 'run' : 'wait';
  };

  const decodedArgs = useMemo(() => {
    if (!result?.decoded.fn) return [];
    return result.decoded.fn.params.map(([name, type]) => {
      const v = result.decoded.args[name];
      const val = type === 'address' ? v : type === 'bool' ? String(v) : (v === (1n << 256n) - 1n ? '2²⁵⁶ − 1 (max)' : v.toString());
      return [name, type, val];
    });
  }, [result]);

  return (
    <section className="section demo" id="demo">
      <div className="demo-bg" aria-hidden="true">
        <div className="demo-lines">
          <i style={{ left: 'calc(50% - 233px)', top: 136, width: 1, height: 386 }} />
          <i style={{ right: 'calc(50% - 232px)', top: 290, width: 1, height: 232 }} />
          <i style={{ left: 60, width: 428, top: 358, height: 1 }} />
          <i style={{ right: 60, width: 428, top: 297, height: 1 }} />
          <i style={{ left: 200, right: 200, top: 582, height: 1 }} />
          <b style={{ left: 'calc(50% - 200px)', top: 168 }} /><b style={{ right: 'calc(50% - 272px)', top: 168 }} />
          <b style={{ left: 56, top: 392 }} /><b style={{ right: 'calc(50% - 272px)', top: 392 }} />
        </div>
        <div className="demo-term" style={{ left: 56, top: 190 }}>{'> intent.decode:\n  selector 0x095ea7b3\n  args[0] spender\n  args[1] amount'}</div>
        <div className="demo-term" style={{ right: 60, top: 120 }}>{'> intent.rules:\n  UNLIMITED_ALLOWANCE\n  permission active until revoked'}</div>
      </div>

      <div className="demo-head">
        <h2 className="h-display light reveal">{DEMO.title}</h2>
        <form className="demo-input reveal d1" onSubmit={submit}>
          <label htmlFor="calldata" className="sr-only">Transaction calldata</label>
          <input
            id="calldata" value={input} spellCheck={false} autoComplete="off"
            placeholder="Paste transaction calldata (0x…)"
            onChange={(e) => { clear(); setInput(e.target.value); if (phase === 'typing') setPhase('idle'); }}
          />
          <button className="run" type="submit">Analyze</button>
        </form>
        <p className="demo-sub reveal d2">{DEMO.sub}</p>
        <div className="demo-samples reveal d3" role="group" aria-label="Sample transactions">
          {SAMPLES.map((s) => (
            <button key={s.id} type="button" className={s.id === sampleId ? 'on' : ''} onClick={() => pick(s)}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="demo-board" ref={boardRef}>
        {/* 01 — Transaction */}
        <div className="board-col reveal">
          <div className="board-num"><span>01</span><span>Transaction</span></div>
          <h3 className="board-title">Raw input</h3>
          <div className="board-body">
            <div className="kv"><span className="k">To</span><span className="v">{target?.name || 'Unlabeled contract'} <small>{short(sample.to)} · {target?.kind || 'Contract'}</small></span></div>
            <div className="kv"><span className="k">From</span><span className="v">{short(sample.from)} <small>· connected wallet</small></span></div>
            <Raw data={input || '0x'} />
            {decodedArgs.length > 0 && step >= 1 && (
              <div className="kv">
                <span className="k">Decoded · {result.decoded.fn.sig}</span>
                {decodedArgs.map(([n, t, v]) => <span key={n} className="v mono">{n} <small>({t})</small> {t === 'address' ? short(v) : v}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* 02 — Pipeline */}
        <div className="board-col reveal d1">
          <div className="board-num"><span>02</span><span>Intent pipeline</span></div>
          <h3 className="board-title">Decoder → Rules</h3>
          <div className="board-body">
            <div className="pipe ui-steps">
              {STEPS.map((s, i) => {
                const st = stateOf(i);
                return (
                  <div key={s.name} className={`ui-step ${st}`}>
                    <span className={`ui-dot ${st}`}>{st === 'done' ? <DoubleCheck size={14} /> : st === 'run' ? <Spinner size={14} /> : <Clock size={14} />}</span>
                    <span className="s-name">{s.name}<small>{s.note(stateOf(i) === 'wait' ? null : result)}</small></span>
                    {st === 'run' && pct !== null && <span className="ui-chip">{pct}%</span>}
                  </div>
                );
              })}
            </div>
            <div className="rules" aria-label="Security rules">
              <div className="hd">Security rules</div>
              {RULES.map((code) => {
                const checked = result && (phase === 'done' || (phase === 'running' && step > 3));
                const hit = checked && result.flags.some((f) => f.code === code);
                return <div key={code} className={`rule${hit ? ' hit' : checked ? ' ok' : ''}`}>{code}<b>{hit ? 'Flagged' : checked ? 'Passed' : 'Pending'}</b></div>;
              })}
            </div>
            <div className="pipe-foot">
              <span className="ui-attach"><Clip /></span>
              <div>
                <div className="t1">{phase === 'running' ? 'Processing' : phase === 'done' ? 'Complete' : phase === 'error' ? 'Could not decode' : phase === 'typing' ? 'Reading input' : 'Waiting'}</div>
                <div className="t2">{phase === 'error' ? 'Check the calldata' : `Supports ${FUNCTION_LIST.length} MVP functions`}</div>
              </div>
              <span className={`live${phase === 'running' || phase === 'typing' ? ' on' : ''}`}>LIVE</span>
            </div>
          </div>
        </div>

        {/* 03 — Approval screen */}
        <div className="board-col reveal d2">
          <div className="board-num">
            <span>03</span>
            <div className="json-toggle" role="tablist" aria-label="Result view">
              <button role="tab" aria-selected={view === 'screen'} className={view === 'screen' ? 'on' : ''} onClick={() => setView('screen')}>Approval</button>
              <button role="tab" aria-selected={view === 'json'} className={view === 'json' ? 'on' : ''} onClick={() => setView('json')}>API output</button>
            </div>
          </div>
          <h3 className="board-title">{view === 'screen' ? 'Before you sign' : 'Structured result'}</h3>
          <div className="board-body">
            {phase === 'error' ? (
              <div className="approve">
                <div className="approve-top"><span className="risk high">Not decoded</span></div>
                <p className="approve-sum">This input can't be explained yet.</p>
                <div className="warns"><div className="warn"><Alert />{error}</div></div>
                <div className="warns"><div className="warn info"><Info />Supported: {FUNCTION_LIST.join(', ')}.</div></div>
              </div>
            ) : view === 'json' ? (
              result && shown ? <JsonView value={result.output} /> : <pre className="json">{'{\n  // waiting for the intent engine…\n}'}</pre>
            ) : (
              <div className={`approve${shown ? '' : ' pending'}`} aria-live="polite">
                <div className="approve-top">
                  <span className="ui-label">Detected intent · {result?.intent || '—'}</span>
                  {result && <span className={`risk ${result.risk}`}>{result.risk} risk</span>}
                </div>
                <p className="approve-sum">{result?.summary || 'Analyzing transaction…'}</p>
                <dl className="approve-rows">
                  {(result?.rows || [['Allowance', '—'], ['Contract', '—'], ['Reversible', '—']]).map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                {result?.warnings.length > 0 && (
                  <div className="warns">
                    {result.warnings.map((w) => (
                      <div key={w.text} className={`warn${w.level === 'info' ? ' info' : ''}`}>{w.level === 'info' ? <Info /> : <Alert />}<span><b>Warning:</b> {w.text}</span></div>
                    ))}
                  </div>
                )}
                {result?.flags.length > 0 && <div className="flags">{result.flags.map((f) => <code key={f.code}>{f.code}</code>)}</div>}
                {decision ? (
                  <div className={`decision ${decision}`}>
                    {decision === 'rejected' ? 'Rejected — nothing was signed.' : 'Approved — passed to the wallet for signature.'}
                    <button type="button" onClick={() => setDecision(null)}>Undo</button>
                  </div>
                ) : (
                  <div className="approve-actions">
                    <button type="button" className="reject" disabled={!shown} onClick={() => setDecision('rejected')}>Reject</button>
                    <button type="button" className="accept" disabled={!shown} onClick={() => setDecision('approved')}>{result?.risk === 'high' ? 'Approve anyway' : 'Approve'}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
