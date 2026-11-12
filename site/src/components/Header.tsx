import { useEffect, useRef, useState } from 'react';
import { CloseIcon, MenuIcon } from './Icons';

export const NAV_LINKS = [
  { href: '#company', label: 'The company' },
  { href: '#divisions', label: 'Divisions' },
  { href: '#studio', label: '3D studio' },
  { href: '#careers', label: 'Careers' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap header-row">
        <a className="brand" href="#top" aria-label="Aphrodite (Pvt) Ltd, back to top">
          <span className="brand-name">APHRODITE</span>
          <span className="brand-sub">(PVT) LTD</span>
        </a>

        <nav className="nav" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="btn btn-light btn-sm" href="#apply">
            Apply now
          </a>
          <button
            ref={menuBtn}
            className="menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile" hidden={!menuOpen}>
        <ul className="wrap">
          {[...NAV_LINKS, { href: '#apply', label: 'Apply now' }].map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
