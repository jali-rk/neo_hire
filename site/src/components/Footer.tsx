import { COMPANY, CONFIG } from '../content';
import { mailto } from '../lib/mailto';
import { NAV_LINKS } from './Header';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-row">
          <div>
            <a className="brand" href="#top">
              <span className="brand-name">APHRODITE</span>
              <span className="brand-sub">(PVT) LTD</span>
            </a>
            <p>
              A Sri Lankan apparel group. Careers:{' '}
              <a className="mail-link" href={mailto()}>
                {CONFIG.careersEmail}
              </a>
            </p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {[...NAV_LINKS, { href: '#apply', label: 'Apply' }].map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="fine">
          <span>
            © {new Date().getFullYear()} {COMPANY}. Incorporated in Sri Lanka.
          </span>
          <span>Brand names and collections are shared at interview, under NDA.</span>
        </div>
      </div>
    </footer>
  );
}
