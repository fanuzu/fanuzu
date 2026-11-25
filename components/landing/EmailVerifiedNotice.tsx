'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/components/providers/LangProvider';

// Renders a brief toast and scrolls to the ranking section when landing
// with ?emailVerified=1 (from the confirmation email's verify link) — what
// actually becomes true the moment verification succeeds is that this
// registration now counts toward the public ranking, so that's what this
// landing should show, not just the plain homepage top. Scrolling to
// #ranking is a harmless no-op if the ranking feature isn't enabled (no
// element to scroll to).
export default function EmailVerifiedNotice() {
  const { tr } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('emailVerified') !== '1') return;
    setShow(true);
    const scrollTimer = setTimeout(() => {
      document.getElementById('ranking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
    const hideTimer = setTimeout(() => setShow(false), 6000);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(max(14px, env(safe-area-inset-top)) + 54px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 170,
        maxWidth: 'min(90vw, 380px)',
        padding: '12px 20px',
        borderRadius: 999,
        background: 'rgba(10,6,19,.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(124,232,255,.4)',
        boxShadow: '0 12px 32px rgba(0,0,0,.45)',
        color: '#FFFAFC',
        fontSize: 13,
        fontWeight: 600,
        textAlign: 'center',
        animation: 'toastIn .3s cubic-bezier(.22,.61,.36,1)',
      }}
    >
      {tr.rankingSection.emailVerifiedToast}
    </div>
  );
}
