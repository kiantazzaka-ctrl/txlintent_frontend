import Art from './Art';
import { asciiField } from '../art/art';
import { BRAND, FOOTER } from '../content';

export default function Footer() {
  return (
    <footer className="footer">
      <Art draw={asciiField} />
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-word">{BRAND}</div>
          <p className="t-body">{FOOTER.body}</p>
        </div>
        <div className="footer-cols">
          {FOOTER.cols.map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
              <ul>{c.links.map(([l, h]) => <li key={l}><a href={h}>{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bar">
        <span className="copy">©{BRAND} {new Date().getFullYear()}</span>
        <a href="#top">Privacy Policy</a>
        <a href="#top">Terms &amp; Conditions</a>
      </div>
    </footer>
  );
}
