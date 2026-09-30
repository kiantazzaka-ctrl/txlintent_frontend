import { useState } from 'react';
import { Plus } from './Icons';
import { FAQS } from '../content';

export default function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <section className="section faq" id="faqs">
      <div className="faq-grid">
        <div className="faq-left">
          <h2 className="h-display reveal">{FAQS.title}</h2>
          <p className="t-body reveal d1">{FAQS.body}</p>
        </div>
        <div className="faq-list">
          {FAQS.items.map((f, i) => (
            <div key={f.q} className={`faq-item reveal${open === i ? ' open' : ''}`}>
              <button className="faq-q" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{i + 1}. {f.q}</span><Plus />
              </button>
              <div className="faq-a" id={`faq-${i}`} role="region"><div><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
