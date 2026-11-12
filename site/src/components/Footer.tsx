import { COMPANY, CONFIG } from '../content';
import { mailto } from '../lib/mailto';
import { NAV_LINKS } from './Header';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-row">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <span className="brand-name">APHRODITE</span>
              <span className="brand-sub">(PVT) LTD</span>
            </a>
            <p>Incorporated as a private limited company in the Democratic Socialist Republic of Sri Lanka.</p>
          </div>
          <div className="footer-contact">
            <h2>Contact</h2>
            <p>
              Careers:{' '}
              <a className="mail-link" href={mailto()}>
                {CONFIG.careersEmail}
              </a>
            </p>
            {CONFIG.corporateEmail && (
              <p>
                Corporate and manufacturing:{' '}
                <a className="mail-link" href={`mailto:${CONFIG.corporateEmail}`}>
                  {CONFIG.corporateEmail}
                </a>
              </p>
            )}
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {[...NAV_LINKS, { href: '#apply', label: 'Apply' }].map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="footer-mark" aria-hidden="true">
          APHRODITE
        </p>
        <div className="fine">
          <span>
            © {new Date().getFullYear()} {COMPANY}. All rights reserved.
          </span>
          <span>Pre-launch creative work and division details are covered by non-disclosure agreements.</span>
        </div>
      </div>
    </footer>
  );
}
