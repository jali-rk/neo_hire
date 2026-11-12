import { useCallback, useEffect, useState } from 'react';
import type { RoleId } from './content';
import Apply, { type ApplyRequest } from './components/Apply';
import Faq from './components/Faq';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Process from './components/Process';
import Roles from './components/Roles';
import Studio from './components/Studio';
import WhyJoin from './components/WhyJoin';

const ROLE_HASH = /^#role-([a-e])$/;

export default function App() {
  const [openRoles, setOpenRoles] = useState<ReadonlySet<RoleId>>(() => new Set());
  const [applyRequest, setApplyRequest] = useState<ApplyRequest | null>(null);

  const setRoleOpen = useCallback((id: RoleId, open: boolean) => {
    setOpenRoles((prev) => {
      if (prev.has(id) === open) return prev;
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const requestApply = useCallback((role: string) => {
    setApplyRequest((prev) => ({ role, n: (prev?.n ?? 0) + 1 }));
  }, []);

  // Any link to a role (spec sheet, drawing pins, studio workflow) opens that role.
  useEffect(() => {
    const fromHash = () => {
      const m = ROLE_HASH.exec(window.location.hash);
      if (m) setRoleOpen(m[1] as RoleId, true);
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="#role-"]');
      const m = link && ROLE_HASH.exec(link.getAttribute('href') ?? '');
      if (m) setRoleOpen(m[1] as RoleId, true);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('hashchange', fromHash);
      document.removeEventListener('click', onClick);
    };
  }, [setRoleOpen]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero onApply={requestApply} />
        <WhyJoin />
        <Studio />
        <Roles open={openRoles} onToggle={setRoleOpen} onApply={requestApply} />
        <Process />
        <Faq />
        <Apply request={applyRequest} />
      </main>
      <Footer />
    </>
  );
}
