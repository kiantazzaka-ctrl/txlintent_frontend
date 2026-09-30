import { useEffect, useRef, useState } from 'react';
import { DoubleCheck, Spinner, Clock, Clip, Hex, Doc, Search, Route, Wallet, Window, Code, Dots, Flag, Shield, Key, Bolt } from './Icons';
import { FEATURES } from '../content';

const Row = ({ icon, title, status, state = 'done', soft, end }) => (
  <div className={`fa-row${soft ? ' soft' : ''}`}>
    <span className="ico">{icon}</span>
    <div>
      <div className="tt">{title}</div>
      <div className="st">{state === 'done' ? <DoubleCheck size={10} /> : state === 'run' ? <Spinner size={10} /> : <Clock size={10} />}{status}</div>
    </div>
    {end && <span className="end">{end}</span>}
  </div>
);

const CARDS = [
  {
    title: 'EVM Transaction Decoding',
    body: 'Decodes raw calldata and identifies the contract and function being called.',
    art: 'g1',
    ui: (
      <div className="fa-list">
        <Row icon={<Hex />} title="Parse raw calldata" status="Decoded" />
        <Row icon={<Doc />} title="Identify contract" status="USDC · ERC-20" />
        <Row icon={<Search />} title="Resolve function selector" status="In Progress" state="run" soft end={<Spinner size={16} />} />
        <Row icon={<Route />} title="Trace contract calls" status="Queued" state="wait" soft end={<Clock size={16} />} />
      </div>
    ),
  },
  {
    title: 'Transfer & Recipient Detection',
    body: 'Detects which assets will move and identifies who receives them.',
    art: 'g2',
    ui: (
      <div className="fa-pipe">
        <div className="hd">Transfer Detection</div>
        <div className="ui-steps">
          <div className="ui-step"><span className="ui-dot done"><DoubleCheck /></span><span className="ui-label ui-muted">Decode transfer call</span></div>
          <div className="ui-step"><span className="ui-dot done"><DoubleCheck /></span><span className="ui-label ui-muted">Detect token movement</span></div>
          <div className="ui-step"><span className="ui-dot run"><Spinner /></span><span className="ui-label ui-dark">Identify recipient</span><span className="ui-chip">24%</span></div>
          <div className="ui-step"><span className="ui-dot wait"><Clock /></span><span className="ui-label">Summarize movement</span></div>
        </div>
      </div>
    ),
  },
  {
    title: 'Approval & Permission Changes',
    body: 'Detects approvals, allowances and permission changes — including those that stay active.',
    art: 'g3',
    ui: (
      <div className="fa-doc">
        <div className="top"><span className="ui-attach"><Clip /></span><span className="tt">approve(address, uint256)</span><span className="ext">ERC-20</span></div>
        <div className="body">
          <div className="ui-label">Permission change detected</div>
          <div className="ui-label ui-dark" style={{ marginTop: 2 }}>Allowance: unlimited</div>
          <div className="ui-bars"><i /><i /><i /><i /></div>
          <div className="go">Review</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Basic Risk Flags',
    body: 'Checks every transaction against security rules and flags unusual or high-risk behavior.',
    art: 'g4',
    ui: (
      <div className="fa-risk">
        <div className="box">
          <Row icon={<Flag />} title="UNLIMITED_ALLOWANCE" status="Flagged" />
          <Row icon={<Key />} title="Permission stays active" status="Flagged" />
          <Row icon={<Shield />} title="Reversibility check" status="In Progress…" state="run" />
        </div>
        <div className="meter"><div className="fill"><Bolt /> <span>High</span></div></div>
      </div>
    ),
  },
  {
    title: 'API for Wallets & Apps',
    body: 'An API endpoint returns structured intent so every interface renders its own UI.',
    art: 'g5',
    ui: (
      <div className="fa-grid">
        <div><span className="ico"><Wallet /></span><b>Wallets</b><span>Render approval screens.</span></div>
        <div><span className="ico"><Window /></span><b>Apps</b><span>Explain every request.</span></div>
        <div><span className="ico"><Code /></span><b>Interfaces</b><span>Structured JSON output.</span></div>
        <div><span className="ico"><Dots /></span><b>& More</b><span>One endpoint, any UI.</span></div>
      </div>
    ),
  },
];

export default function Features() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (i) => refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <section className="section features" id="features">
      <h2 className="h-display reveal">{FEATURES.title}</h2>
      <p className="t-body mocha reveal d1">{FEATURES.body}</p>
      <div className="feat-grid">
        <div className="feat-list" role="tablist" aria-label="Feature categories">
          {FEATURES.tabs.map((t, i) => <button key={t} role="tab" aria-selected={active === i} className={active === i ? 'on' : ''} onClick={() => go(i)}>{t}</button>)}
        </div>
        <div className="feat-cards">
          {CARDS.map((c, i) => (
            <article key={c.title} className="feat-card reveal" data-i={i} ref={(el) => (refs.current[i] = el)}>
              <div className="copy"><h3>{c.title}</h3><p className="t-body">{c.body}</p></div>
              <div className={`feat-art ${c.art}`}>{c.ui}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
