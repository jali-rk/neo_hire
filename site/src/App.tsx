import { useCallback, useEffect, useState } from 'react';
import type { RoleId } from './content';
import Apply, { type ApplyRequest } from './components/Apply';
import Atelier from './components/Atelier';
import Careers from './components/Careers';
import Divisions from './components/Divisions';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import House from './components/House';

const ROLE_HASH = /^#role-([a-e])$/;

export default function App() {
  const [openRole, setOpenRole] = useState<RoleId | null>(null);
  const [applyRequest, setApplyRequest] = useState<ApplyRequest | null>(null);

  /** Opens or closes a role's details. The URL follows (#role-a), so a role can be shared as a link. */
  const showRole = useCallback((id: RoleId | null) => {
    setOpenRole(id);
    if (id) window.history.replaceState(null, '', `#role-${id}`);
    else if (ROLE_HASH.test(window.location.hash)) window.history.replaceState(null, '', '#careers');
  }, []);

  const requestApply = useCallback((role: string) => {
    setApplyRequest((prev) => ({ role, n: (prev?.n ?? 0) + 1 }));
  }, []);

  // A shared link to a role (…/#role-c) opens that role's details.
  useEffect(() => {
    const fromHash = () => {
      const m = ROLE_HASH.exec(window.location.hash);
      if (m) {
        setOpenRole(m[1] as RoleId);
        document.getElementById('careers')?.scrollIntoView();
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <House />
        <Divisions />
        <Atelier />
        <Careers openRole={openRole} onOpenRole={showRole} onApply={requestApply} />
        <Apply request={applyRequest} />
      </main>
      <Footer />
    </>
  );
}
