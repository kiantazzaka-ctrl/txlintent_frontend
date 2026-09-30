import { useState } from 'react';
import { Logo } from './Icons';
import { NAV } from '../content';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="nav-wrap">
      <header className={`nav${open ? ' open' : ''}`}>
        <a href="#top" className="nav-logo" aria-label="Transaction Intent Security Layer — home" onClick={close}><Logo /></a>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map((n) => <a key={n.href} href={n.href} className={n.active ? 'active' : ''}>{n.label}</a>)}
        </nav>
        <a href="#access" className="btn-pill nav-cta">Get Access</a>
        <button className="nav-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}><span /><span /></button>
        <div className="nav-sheet"><div>
          <nav aria-label="Mobile">
            {NAV.map((n) => <a key={n.href} href={n.href} onClick={close}>{n.label}</a>)}
            <a href="#access" className="btn-pill" onClick={close}>Get Access</a>
          </nav>
        </div></div>
      </header>
    </div>
  );
}
