import { useState } from 'react';
import Art from './Art';
import { scatterChars } from '../art/art';
import { ACCESS } from '../content';

export default function Access() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setNote('Please enter a valid email address.'); return; }
    setNote("Thanks — you're on the list for API access.");
    setEmail('');
  };
  return (
    <section className="section access" id="access">
      <div className="access-box">
        <Art draw={scatterChars} />
        <h2 className="h-display reveal">{ACCESS.title[0]}<br />{ACCESS.title[1]}</h2>
        <p className="t-body reveal d1">{ACCESS.body}</p>
        <form className="access-form reveal d2" onSubmit={submit} noValidate>
          <label htmlFor="access-email" className="sr-only">Email address</label>
          <input id="access-email" type="email" placeholder={ACCESS.placeholder} value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">{ACCESS.cta}</button>
        </form>
        <p className="access-note" aria-live="polite">{note}</p>
      </div>
    </section>
  );
}
